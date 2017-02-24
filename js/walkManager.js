class WalkManager
{
    constructor(_game, _player)
    {
        this.game = _game;
        this.lastX = 0;
        this.groundTiles = [];
        this.player = _player;
        this.obstaclesPlaced = 0;
        
        //modify this!!
        this.lastPlaced = 0;
        this.placeNext = 0;
        this.initial = true;
    }
    
    static preload(_game)
    {
        Obstacle.preload(_game);
        GroundTile.preload(_game);
    }
    
    update()
    {
        this.player.updateWalk();

        while(this.lastX < ServiceLocator.camera.getVisibleArea().right)
        {
            var newTile = new GroundTile(new Phaser.Point(this.lastX, GROUND_LEVEL), this.obstacleToPlace());
            newTile.create(this.game);
            this.lastX += newTile.sprite.width;
            this.groundTiles.push(newTile);
        }

        if (this.initial)
        {
            this.initial = false;
            return;
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
    
    obstacleToPlace()
    {
        if (this.initial)
        {
            return;
        }
        var ret = undefined;
        
        this.lastPlaced++;
        
        if (this.placeNext > 0 || (this.lastPlaced > 4 && Math.random() > 0.6 && this.obstaclesPlaced < ServiceLocator.difficultyManager.getSpikeNumber()))
        {
            this.lastPlaced = 0;
            ret = Obstacle;
            this.obstaclesPlaced++;
            if (this.placeNext > 0)
            {
                this.placeNext --;
            }
            else
            {
                var rand = Math.random();
                if (rand > 0.8)
                {
                    this.placeNext = 2;
                }
                else if (rand > 0.5)
                {
                    this.placeNext = 1;
                }
            }
        }
        
        return ret;
    }
    
    directionHandler(_dir, _angle)
    {
        this.player.jump(_angle);
    }
    
    startWalk()
    {
        this.obstaclesPlaced = 0;
        this.nextObstacleIteration = undefined;
        this.player.startWalk();
    }
    
    isWalkingFinished()
    {
        var ret = this.obstaclesPlaced >= ServiceLocator.difficultyManager.getSpikeNumber() && this.player.onGround() && this.getVisibleObstacles().length == 0;
        if (ret)
        {
            this.player.finishWalk();
            this.obstaclesPlaced = 0;
        }
        return ret;
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
}

class VisibleObject
{
    isOut()
    {
        var camera = ServiceLocator.camera;
        return this.sprite.x + this.sprite.width < camera.getPosition().x;
    }
    
    getArea()
    {
        return this.sprite.getBounds();
    }
}

class GroundTile extends VisibleObject
{
    constructor(_position, _obstacle)
    {
        super();
        //this.imageName = _imageName;
        this.position = _position;
        if (_obstacle)
        {
            this.obstacle = new _obstacle(_position);
        }
    }
    
    static preload(_game)
    {
        _game.load.image('grassTile', './img/tiles/grass_block.png');
    }
    
    create(_game)
    {
        this.sprite = _game.add.sprite(this.position.x, this.position.y, 'grassTile');
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
        this.sprite.y = GROUND_LEVEL - this.sprite.height;
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
        
        return xCol && _player.jumpHeight < 55;
    }
}
