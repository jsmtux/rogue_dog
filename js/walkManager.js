class WalkManager
{
    constructor(_game, _player)
    {
        this.player = _player;
        this.walkedIterations = 0;

        this.obstacles = [];
        this.nextObstacleIteration;
        this.obstaclesPlaced = 0;

        this.game = _game;
        
        this.groundTiles = [];
    }
    
    static preload(_game)
    {
        Obstacle.preload(_game);
        GroundTile.preload(_game);
    }
    
    update()
    {
        this.walkedIterations ++;
        this.player.updateWalk();
        
        this.updateObstacles();
        
        this.updateGroundTiles();
    }
    
    updateObstacles()
    {
        if (this.nextObstacleIteration == undefined
            && this.obstaclesPlaced < ServiceLocator.difficultyManager.getSpikeNumber())
        {
            this.nextObstacleIteration = 
                this.walkedIterations +
                ServiceLocator.difficultyManager.getNextSpikeSeparation();
        }

        if (this.nextObstacleIteration <= this.walkedIterations)
        {
            var obstacle = new Obstacle();
            obstacle.create(this.game);
            this.obstacles.push(obstacle);
            this.obstaclesPlaced ++;
            this.nextObstacleIteration = undefined;
        }
    
        for (var ind in this.obstacles)
        {
            if (this.obstacles[ind].collides(this.player))
            {
                this.player.obstacleHit();
                this.obstacles[ind].break();
            }
        }
        for (var ind in this.obstacles)
        {
            if (this.obstacles[ind].isOut())
            {
                this.obstacles[ind].destroy();
                this.obstacles.splice(ind, 1);
            }
        }
    }
    
    updateGroundTiles()
    {
        for (var ind in this.groundTiles)
        {
            if (this.groundTiles[ind].isOut())
            {
                this.groundTiles[ind].destroy();
                this.groundTiles.splice(ind, 1);
                ind--;
            }
        }
        while(this.groundTiles.length < 50)
        {
            var x = 0;
            if (this.groundTiles.length > 0)
            {
                x = this.groundTiles[this.groundTiles.length -1].position.x + 80;
            }
            var newTile = new GroundTile(new Phaser.Point(x, GROUND_LEVEL));
            newTile.create(this.game);
            this.groundTiles.push(newTile);
        }
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
        if (this.obstaclesPlaced >= ServiceLocator.difficultyManager.getSpikeNumber() && this.obstacles.length == 0 && this.player.onGround())
        {
            this.player.finishWalk();
            this.walkedIterations = 0;
            
            return true;
        }
        return false;
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
    constructor(_position)
    {
        super();
        //this.imageName = _imageName;
        this.position = _position;
    }
    
    static preload(_game)
    {
        _game.load.image('grassTile', './img/tiles/grass_block.png');
    }
    
    create(_game)
    {
        this.sprite = _game.add.sprite(this.position.x, this.position.y, 'grassTile');
        this.sprite.scale.setTo(Layer.scale, Layer.scale);
    }
    
    destroy()
    {
        this.sprite.destroy()
    }
}

class Obstacle extends VisibleObject
{
    constructor(_position)
    {
        super();
        this.sprite;
        this.broken = false;
        this.position = new Phaser.Point(ServiceLocator.camera.getVisibleArea().right, 0);
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
