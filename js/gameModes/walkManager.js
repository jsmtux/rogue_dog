class WalkLevel
{
    constructor(_groundTileName, _height, _walkManager)
    {
        this.height = _height;
        this.groundTileName = _groundTileName;
        this.walkManager = _walkManager;
        this.columnsDrawn = 0;
        this.stagePrototype;
        this.active = false;
    }
    
    fillEmpty()
    {
        while(this.columnsDrawn - 2 < (ServiceLocator.camera.getVisibleArea().right) / 80 + 5)
        {
            this.walkManager.addTile(this.groundTileName, new Phaser.Point(this.columnsDrawn * 80, this.height), undefined, undefined, this);
            this.columnsDrawn ++;
        }
    }
    
    update()
    {
        if (!this.active)
        {
            this.fillEmpty();
            return;
        }
        while(this.columnsDrawn < (ServiceLocator.camera.getVisibleArea().right / 80) + 5)
        {
            var newCell = new GrassStageCell();
            if (this.stagePrototype)
            {
                if (this.stagePrototype.isStageFinished())
                {
                    this.stagePrototype = undefined;
                }
                else
                {
                    newCell = this.stagePrototype.getNextCell();
                }
            }
            
            for (var ind in newCell.walkLevels)
            {
                this.walkManager.addTile(this.groundTileName, new Phaser.Point(this.columnsDrawn * 80, this.height + newCell.walkLevels[ind]), newCell.obstacle, newCell.item, this);
            }
            
            this.columnsDrawn ++;
        }
    }
    
    setStagePrototype(_stagePrototype)
    {
        this.stagePrototype = _stagePrototype;
    }
    
    isFinished()
    {
        return this.stagePrototype == undefined;
    }
    
    setActive(_isActive)
    {
        this.active = _isActive;
    }
}

class UndergroundWalkLevel extends WalkLevel
{
    constructor(_groundTileName, _height, _walkManager)
    {
        super(_groundTileName, _height, _walkManager);
        this.game = _walkManager.game;
        this.cardPieces = [];
        this.gap = 10;
    }
    
    update()
    {
        super.update();
        /* NEED TO USE ITEMS TO ADD THIS
        while(this.lastProcessedX < this.lastX)
        {
            this.lastProcessedX += this.gap;
            if (this.active && Math.random() < ServiceLocator.difficultyManager.getCardSpawnChance())
            {
                this.addCardPiece();
            }
        }
        
        for(var ind in this.cardPieces)
        {
            this.cardPieces[ind].update();
        }*/
    }
}

class WalkManager extends GameMode
{
    constructor(_game, _player)
    {
        super();
        this.game = _game;
        this.groundTiles = [];
        this.player = _player;
        this.obstaclesPlaced = 0;

        this.background = new Background(this.game);
        
        this.walkLevels = [];
        this.walkLevels.push(new WalkLevel('grassTile', GROUND_LEVEL, this));
        this.walkLevels.push(new UndergroundWalkLevel('undergroundTile', 880, this));
        
        this.currentWalkLevel;
        
        this.lastShownJumpHelp = performance.now();
    }
    
    static preload(_game)
    {
        Obstacle.preload(_game);
        TallObstacle.preload(_game);
        GroundTile.preload(_game);
        CardPiece.preload(_game);
        Stick.preload(_game);
        CeilingObstacle.preload(_game);
    }
    
    create(_game)
    {
        this.background.create(_game, [
            {'name':'bg0', 'speed':0.2},
            {'name':'bg1', 'speed':0.5, 'yOffset':360},
            {'name':'bg2', 'speed':0.7, 'yOffset':550}]);
    }
    
    addTile(_grassName, _position, _obstacle, _item, _walkLevel)
    {
        var newTile = new GroundTile(new Phaser.Point(_position.x, _position.y), _grassName, _obstacle, _item, _walkLevel);

        newTile.create(this.game);
        this.groundTiles.push(newTile);
    }

    update()
    {
        if (ServiceLocator.inputManager.leftButton.getLastTouched() > 2000)
        {
            ServiceLocator.inGameHelper.showJumpHelp();
        }
        else
        {
            ServiceLocator.inGameHelper.hideJumpHelp();
        }
        
        for(var levelInd in this.walkLevels)
        {
            this.walkLevels[levelInd].update();
        }
        
        for (var ind in this.groundTiles)
        {
            if (this.groundTiles[ind].isOut())
            {
                this.groundTiles[ind].destroy();
                this.groundTiles.splice(ind, 1);
                ind--;
            }
            else
            {
                this.groundTiles[ind].update(this.player);
            }
        }
        
        for (var ind in this.obstacles)
        {
            this.obstacles[ind].update(this.player);
        }
    }
    
    directionHandler(_dir, _angle)
    {
        this.player.jump(_angle);
    }
    
    isFinished()
    {
        return this.currentWalkLevel && this.currentWalkLevel.isFinished() && this.player.onGround() && this.getVisibleObstacles().length == 0;
    }
    
    startMode()
    {
        this.player.startWalk();
        this.walkLevels[0].setStagePrototype(ServiceLocator.difficultyManager.getStagePrototype());
        this.walkLevels[1].setStagePrototype(ServiceLocator.difficultyManager.getUndergroundStagePrototype());
    }
    
    finishMode()
    {
        ServiceLocator.inputManager.getBmd().clear();
        ServiceLocator.inGameHelper.hideJumpHelp();
        this.player.finishWalk();
    }

    getVisibleObstacles()
    {
        var ret = []
        for (var ind in this.groundTiles)
        {
            if (this.groundTiles[ind].obstacle != undefined)
            {
                ret.push(this.groundTiles[ind].obstacle);
            }
        }
        return ret;
    }
    
    getGroundTiles(_x)
    {
        var list = [];
        for (var ind in this.groundTiles)
        {
            var area = this.groundTiles[ind].getArea();
            if (_x >= area.x && _x <= area.x + area.width)
            {
                list.push(this.groundTiles[ind]);
            }
        }
        return list;
    }
    
    setCurrentWalkLevel(_level)
    {
        if (this.currentWalkLevel == _level)
        {
            return;
        }
        if (this.currentWalkLevel)
        {
            this.currentWalkLevel.setActive(false);
        }
        this.currentWalkLevel = _level;
        this.currentWalkLevel.setActive(true);
    }
}

WalkManager.NAME = "WalkManager";

class VisibleObject extends GameObject
{
    constructor()
    {
        super();
    }

    isOut()
    {
        var camera = ServiceLocator.camera;
        return this.sprite.x + this.sprite.width < camera.getPosition().x;
    }
    
    getArea()
    {
        return new Phaser.Rectangle(this.sprite.x, this.sprite.y, 80, 80);
    }
    
    getTopPosition()
    {
        return this.sprite.y - 90;
    }
}

class GroundTile extends VisibleObject
{
    constructor(_position, _imageName, _obstacle, _item, _walkLevel)
    {
        super();
        this.imageName = _imageName;
        this.position = _position;
        this.walkLevel = _walkLevel;
        if (_obstacle)
        {
            this.obstacle = new _obstacle(_position.clone());
        }
        if (_item)
        {
            this.item = new _item(_position.clone());
        }
    }
    
    static preload(_game)
    {
        _game.load.image('grassTile', './img/tiles/grass_block.png');
        _game.load.image('undergroundTile', './img/tiles/underground_block.png');
        _game.load.image('tutorialObstacle', './img/tutorial_obstacle.png');
    }
    
    create(_game)
    {
        var sprite = _game.add.sprite(this.position.x, this.position.y, this.imageName);
        ServiceLocator.renderer.addToScene(sprite);
        super.create(sprite)
        if (this.obstacle)
        {
            this.obstacle.create(_game);
        }
        if (this.item)
        {
            this.item.create(_game);            
        }
    }
    
    destroy()
    {
        super.destroy()
        if (this.obstacle)
        {
            this.obstacle.destroy();
        }
        if (this.item)
        {
            this.item.destroy();
        }
    }
    
    update(_player)
    {
        if (this.obstacle)
        {
            this.obstacle.update(_player);
        }
        if (this.item)
        {
            this.item.update(_player);
        }
    }
    
    getWalkLevel()
    {
        return this.walkLevel;
    }
}

class Obstacle extends VisibleObject
{
    constructor(_position)
    {
        super();
        this.broken = false;
        this.sprite;
        this.position = _position;
    }
    
    static preload(_game)
    {
        _game.load.image('spike', './img/obstacles/spike.png');
        _game.load.image('brokenspike', './img/obstacles/brokenspike.png');
        _game.load.audio('obstacleBreakAudio', 'sounds/obstacle_break.wav');
    }
    
    createObstacle(_sprite, _game)
    {
        super.create(_sprite)
        ServiceLocator.renderer.addToScene(this.sprite);
        ServiceLocator.physics.addToWorld(this.sprite);
    }
    
    create(_game)
    {
        var sprite = _game.add.sprite(this.position.x, 0, 'spike');
        sprite.y = this.position.y - sprite.height;
        this.createObstacle(sprite, _game);
        this.breakAudio = _game.add.audio('obstacleBreakAudio');
    }
    
    break()
    {
        this.broken = true;
        this.sprite.loadTexture('brokenspike');
        this.breakAudio.play();
    }
    
    destroy()
    {
        this.sprite.destroy();
        ServiceLocator.physics.removeFromWorld(this.sprite);
    }
    
    update(_player)
    {
        if (this.collides(_player))
        {
            console.log("Player collision");
            ServiceLocator.publish(new JumpFailedMessage());
            this.break();
        }
    }
    
    collides(_player)
    {
        if (this.broken)
        {
            return false;
        }
        
        return ServiceLocator.physics.isCollidingWith(this.sprite, _player.getCollisionBox(DogPlayer.CollisionBoxes.BODY)) 
            || ServiceLocator.physics.isCollidingWith(this.sprite, _player.getCollisionBox(DogPlayer.CollisionBoxes.HEAD));
    }
}

class EnemyObstacle extends Obstacle
{
    constructor(_position)
    {
        super(_position);
    }
    
    create(_game)
    {
        var sprite = _game.add.sprite(this.position.x, 0, 'tutorialObstacle');
        sprite.y = this.position.y - sprite.height;
        super.createObstacle(sprite, _game);
    }
    
    update(_player)
    {
    }
    
    break()
    {
        this.sprite.alpha = 0.2;
    }
    
    collides(_player)
    {
        return false;
    }
}

class TallObstacle extends Obstacle
{
    constructor(_position)
    {
        super(_position);
    }
    
    static preload(_game)
    {
        _game.load.image('tall_spike', './img/obstacles/tall_spike.png');
        _game.load.image('brokentall_spike', './img/obstacles/tall_spike_broken.png');
    }
    
    create(_game)
    {
        var sprite = _game.add.sprite(this.position.x, 0, 'tall_spike');
        sprite.y = this.position.y - sprite.height;
        this.createObstacle(sprite, _game);
    }
    
    break()
    {
        this.broken = true;
        this.sprite.loadTexture('brokentall_spike');
    }
}

class CeilingObstacle extends Obstacle
{
    constructor(_position)
    {
        super(_position)
    }
    
    static preload(_game)
    {
        _game.load.image('ceiling_spike', './img/obstacles/ceiling_spike.png');
        _game.load.image('ceiling_spike_broken', './img/obstacles/ceiling_spike_broken.png');
    }
    
    create(_game)
    {
        var sprite = _game.add.sprite(this.position.x, 0, 'ceiling_spike');
        sprite.y = this.position.y + 80;
        this.createObstacle(sprite, _game);
    }
    
    break()
    {
        this.broken = true;
        this.sprite.loadTexture('ceiling_spike_broken');
    }
}

class Item extends VisibleObject
{
    constructor(_position)
    {
        super();
        this.position = _position;
        this.dying = false;
    }
    
    collides(_player)
    {
        return ServiceLocator.physics.isCollidingWith(this.sprite, _player.getCollisionBox(DogPlayer.CollisionBoxes.HEAD));
    }   
}

class Stick extends Item
{
    constructor(_position)
    {
        super(_position);
        this.position.y -=  250;
        this.active = true;
    }
    
    destroy()
    {
        ServiceLocator.physics.removeFromWorld(this.sprite);
        super.destroy();
    }
    
    static preload(_game)
    {
        _game.load.image('stick', './img/items/stick.png');
    }
    
    create(_game)
    {
        var sprite = _game.add.sprite(this.position.x, this.position.y, 'stick');
        super.create(sprite);
        ServiceLocator.renderer.addToScene(this.sprite);
        ServiceLocator.physics.addToWorld(this.sprite);
    }
    
    update(_player)
    {
        if (this.active && this.collides(_player))
        {
            ServiceLocator.publish(new ItemPickedMessage(this));
        }
    }
    
    pick()
    {
        this.active = false;
        this.sprite.alpha = 0.1;
    }
}

class CardPiece extends Item
{
    constructor(_position)
    {
        super(_position);
        this.position.y -=  (230*Math.random() + 50.0);
        this.glowSprite;
        this.glowDifference = 0.01;
    }
    
    static preload(_game)
    {
        _game.load.image('card_piece', './img/items/piece.png');
        _game.load.image('card_piece_glow', './img/items/piece_glow.png');
        _game.load.audio('cardPieceCollectedAudio', 'sounds/card_piece_collected.wav');
    }
    
    create(_game)
    {
        var sprite = _game.add.sprite(this.position.x, this.position.y, 'card_piece');
        ServiceLocator.renderer.addToScene(sprite);
        super.create(sprite);
        var sprite = _game.add.sprite(this.position.x, this.position.y, 'card_piece_glow');
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        ServiceLocator.renderer.addToOverlay(sprite);
        this.glowSprite = sprite;
        this.glowSprite.alpha = 0.7;
        this.glowSprite.inputEnabled = true;
        this.glowSprite.events.onInputDown.add(this.clicked, this);
        this.glowSprite.anchor.x = 0.5;
        this.glowSprite.anchor.y = 0.5;
        
        this.collectSound = _game.add.audio('cardPieceCollectedAudio');
    }
    
    destroy()
    {
        this.sprite.destroy();
        this.glowSprite.destroy();
    }
    
    update()
    {
        if (this.dying)
        {
            if (this.scale === undefined)
            {
                this.scale = 1.0;
                this.glowSprite.alpha = 0.7;
            }
            this.glowSprite.scale.setTo(this.scale, this.scale);
            this.scale += 0.1;
            this.glowSprite.alpha -= 0.03;
            this.sprite.alpha -= 0.05;
        }
        else
        {
            if (this.glowSprite.alpha >= 0.8 || this.glowSprite.alpha <= 0.1)
            {
                this.glowDifference *= -1.0;
            }
            this.glowSprite.alpha += this.glowDifference;
        }
    }
    
    clicked()
    {
        this.collectSound.play();
        this.dying = true;
        this.glowSprite.events.onInputDown.remove(this.clicked, this);
        ServiceLocator.publish(new CardPieceFoundMessage());
    }
}