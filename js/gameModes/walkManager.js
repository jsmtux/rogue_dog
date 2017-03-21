class WalkLevel
{
    constructor(_groundTileName, _height, _walkManager)
    {
        this.height = _height;
        this.groundTileName = _groundTileName;
        this.walkManager = _walkManager;
        this.lastX = 0;
        this.stagePrototype;
    }
    
    fillEmpty()
    {
        while(this.lastX - 80 < ServiceLocator.camera.getVisibleArea().right)
        {
            this.walkManager.addTile(this.groundTileName, new Phaser.Point(this.lastX, this.height));
            this.lastX += 80;
        }
    }
    
    update()
    {
        while(this.lastX < ServiceLocator.camera.getVisibleArea().right)
        {
            var newCell = StagePrototype.cellType.GRASS;
            if (this.stagePrototype)
            {
                newCell = this.stagePrototype.getNextCellType();
                if (this.stagePrototype.isStageFinished())
                {
                    this.stagePrototype = undefined;
                }
            }
            
            if (newCell !== StagePrototype.cellType.HOLE)
            {
                var obstacle;
                if (newCell === StagePrototype.cellType.OBSTACLE)
                {
                    obstacle = Obstacle;
                }
                else if (newCell === StagePrototype.cellType.TALL_OBSTACLE)
                {
                    obstacle = TallObstacle;
                }
                this.walkManager.addTile(this.groundTileName, new Phaser.Point(this.lastX, this.height), obstacle);
            }
            
            this.lastX += 80;
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
}

class WalkManager extends GameMode
{
    constructor(_game, _player)
    {
        super();
        this.game = _game;
        this.lastX = 0;
        this.lastUndergroundX = 0;
        this.groundTiles = [];
        this.player = _player;
        this.obstaclesPlaced = 0;

        this.background = new Background(this.game);
        
        this.stagePrototype = undefined;
        
        this.walkLevels = [];
        this.walkLevels.push(new WalkLevel('grassTile', GROUND_LEVEL, this));
        this.walkLevels.push(new WalkLevel('undergroundTile', 880, this));
        
        this.currentWalkLevel = this.walkLevels[0];
    }
    
    static preload(_game)
    {
        Obstacle.preload(_game);
        TallObstacle.preload(_game);
        GroundTile.preload(_game);
    }
    
    create(_game)
    {
        this.background.create(_game, [
            {'name':'bg0', 'speed':0.2},
            {'name':'bg1', 'speed':0.5},
            {'name':'bg2', 'speed':0.7, 'yOffset':360}]);
    }
    
    addTile(_grassName, _position, _obstacle)
    {
        var newTile = new GroundTile(new Phaser.Point(_position.x, _position.y), _grassName, _obstacle);

        newTile.create(this.game);
        this.groundTiles.push(newTile);        
    }

    update()
    {
        this.player.updateWalk();
        
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
    
    getNextMode()
    {
        var finished = this.currentWalkLevel.isFinished() && this.player.onGround() && this.getVisibleObstacles().length == 0;
        var ret;
        if (finished)
        {
            ret = "CombatManager";
        }
        return ret;
    }
    
    startMode()
    {
        this.player.startWalk();
        this.currentWalkLevel.setStagePrototype(ServiceLocator.difficultyManager.getStagePrototype());
    }
    
    finishMode()
    {
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
    
    getGroundLevels(_x)
    {
        var list = [];
        for (var ind in this.groundTiles)
        {
            var area = this.groundTiles[ind].getArea();
            if (_x >= area.x && _x <= area.x + area.width)
            {
                list.push(area.y - 90);
            }
        }
        return list;
    }
    
    fillEmpty()
    {
        for(var levelInd in this.walkLevels)
        {
            this.walkLevels[levelInd].fillEmpty();
        }
    }
}

WalkManager.NAME = "WalkManager";

class VisibleObject extends GameObject
{
    isOut()
    {
        var camera = ServiceLocator.camera;
        return this.sprite.x + this.sprite.width < camera.getPosition().x;
    }
    
    getArea()
    {
        return new Phaser.Rectangle(this.sprite.x, this.sprite.y, 80, 80);
    }
}

class GroundTile extends VisibleObject
{
    constructor(_position, _imageName, _obstacle)
    {
        super();
        this.imageName = _imageName;
        this.position = _position;
        if (_obstacle)
        {
            this.obstacle = new _obstacle(_position);
        }
    }
    
    static preload(_game)
    {
        _game.load.image('grassTile', './img/tiles/grass_block.png');
        _game.load.image('undergroundTile', './img/tiles/underground_block.png');
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
    }
    
    destroy()
    {
        this.sprite.destroy()
        if (this.obstacle)
        {
            this.obstacle.destroy();
        }
    }
    
    update(_player)
    {
        if (this.obstacle)
        {
            this.obstacle.update(_player);
        }
    }
}

class Obstacle extends VisibleObject
{
    constructor(_position)
    {
        super();
        this.sprite;
        this.broken = false;
        this.position = _position;
    }
    
    static preload(_game)
    {
        _game.load.image('spike', './img/spike.png');
        _game.load.image('brokenspike', './img/brokenspike.png');
    }
    
    create(_game)
    {
        this.sprite = _game.add.sprite(this.position.x, 0, 'spike');
        ServiceLocator.renderer.addToScene(this.sprite);
        this.sprite.y = this.position.y - this.sprite.height;
    }
    
    break()
    {
        this.broken = true;
        this.sprite.loadTexture('brokenspike');
    }
    
    destroy()
    {
        this.sprite.destroy();
    }
    
    update(_player)
    {
        if (this.collides(_player))
        {
            _player.obstacleHit();
            this.break();
        }
    }
    
    collides(_player)
    {
        if (this.broken)
        {
            return false;
        }
        var characterArea = _player.getFeetArea();
        var xCol = this.sprite.x < characterArea[1]
            && (this.sprite.x + this.sprite.width) > characterArea[0];
        
        var yCol = false;
        
        if (xCol)
        {
            var yDiff = _player.sprite.y - this.sprite.y;
            yCol = yDiff  <= 0 && yDiff > - this.sprite.height;
        }
        
        return xCol && yCol;
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
        _game.load.image('tall_spike', './img/tall_spike.png');
        _game.load.image('brokentall_spike', './img/tall_spike_broken.png');
    }
    
    create(_game)
    {
        this.sprite = _game.add.sprite(this.position.x, 0, 'tall_spike');
        ServiceLocator.renderer.addToScene(this.sprite);
        this.sprite.y = this.position.y - this.sprite.height;
    }
    
    break()
    {
        this.broken = true;
        this.sprite.loadTexture('brokentall_spike');
    }
    
    collides(_player)
    {
        if (this.broken)
        {
            return false;
        }
        var characterArea = _player.getFeetArea();
        var xCol = this.sprite.x < characterArea[1]
            && (this.sprite.x + this.sprite.width) > characterArea[0];
        
        var yCol = false;
        
        if (xCol)
        {
            var playerBottom = _player.getHitAreaBottom();
            var height = this.sprite.y - playerBottom;
            yCol = height < 0;
        }
        
        return xCol && yCol;
    }
    
}