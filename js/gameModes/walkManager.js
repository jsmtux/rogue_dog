class WalkLevel
{
    constructor(_groundTileName, _height, _walkManager)
    {
        this.height = _height;
        this.groundTileName = _groundTileName;
        this.walkManager = _walkManager;
        this.lastX = 0;
        this.stagePrototype;
        this.active = false;
    }
    
    fillEmpty()
    {
        while(this.lastX - 80 < ServiceLocator.camera.getVisibleArea().right)
        {
            this.walkManager.addTile(this.groundTileName, new Phaser.Point(this.lastX, this.height), undefined, this);
            this.lastX += 80;
        }
    }
    
    update()
    {
        if (!this.active)
        {
            this.fillEmpty();
            return;
        }
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
            
            if (newCell === StagePrototype.cellType.PLATFORM)
            {
                this.walkManager.addTile(this.groundTileName, new Phaser.Point(this.lastX, this.height), obstacle, this);
                this.walkManager.addTile(this.groundTileName, new Phaser.Point(this.lastX, this.height - 170), obstacle, this);
            }
            else if (newCell !== StagePrototype.cellType.HOLE)
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
                this.walkManager.addTile(this.groundTileName, new Phaser.Point(this.lastX, this.height), obstacle, this);
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
    
    setActive(_isActive)
    {
        this.active = _isActive;
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
        
        this.currentWalkLevel;
        
        this.lastShownJumpHelp = performance.now();
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
    
    addTile(_grassName, _position, _obstacle, _walkLevel)
    {
        var newTile = new GroundTile(new Phaser.Point(_position.x, _position.y), _grassName, _obstacle, _walkLevel);

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
        
        this.updateTrajectoryImage();
        
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
    
    updateTrajectoryImage()
    {
        var bmd = ServiceLocator.inputManager.getBmd();
        bmd.clear();
        var curAngle = ServiceLocator.inputManager.playerDirectionGesture.curAngle;
        if (curAngle !== undefined && this.player.onGround())
        {
            var playerPos = this.player.getPosition();
            var cameraPos = ServiceLocator.camera.getPosition();
            var relativePlayerPos = playerPos.subtract(cameraPos.x, cameraPos.y);
            bmd.lineStyle(2, 0xffd900, 1);
            
            bmd.moveTo(relativePlayerPos.x,relativePlayerPos.y);
            var curPos = relativePlayerPos.clone();
            var iterationAdvance = 1;
            var jumpAcceleration = new Phaser.Point();
            var jumpStrength = this.player.jumpStrenght;
            jumpAcceleration.y = jumpStrength * -Math.sin(Math.radians(curAngle));
            jumpAcceleration.x = jumpStrength * Math.cos(Math.radians(curAngle)) + this.player.curSpeed;
            while(relativePlayerPos.y >= curPos.y)
            {
                curPos.x += iterationAdvance * jumpAcceleration.x;
                curPos.y -= iterationAdvance * jumpAcceleration.y;
                jumpAcceleration.y -= 0.3;
                bmd.lineTo(curPos.x, curPos.y);
            }
        }
    }
    
    directionHandler(_dir, _angle)
    {
        this.player.jump(_angle);
    }
    
    getNextMode()
    {
        var finished = this.currentWalkLevel && this.currentWalkLevel.isFinished() && this.player.onGround() && this.getVisibleObstacles().length == 0;
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
    constructor(_position, _imageName, _obstacle, _walkLevel)
    {
        super();
        this.imageName = _imageName;
        this.position = _position;
        this.walkLevel = _walkLevel;
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