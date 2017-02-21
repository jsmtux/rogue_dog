class WalkManager
{
    constructor(_game, _player, _walkSpeed)
    {
        this.player = _player;
        this.walkedIterations = 0;
        this.handler;
        this.walkSpeed = _walkSpeed;
        this.obstacles = [];
        this.nextObstacleIteration;
        this.obstaclesPlaced = 0;
        this.game = _game;
    }
    
    static preload(_game)
    {
        Obstacle.preload(_game);
    }
    
    update()
    {
        this.walkedIterations ++;
        this.player.updateWalk();
        
        if (this.nextObstacleIteration == undefined
            && this.obstaclesPlaced < ServiceLocator.difficultyManager.getSpikeNumber())
        {
            this.nextObstacleIteration = 
                this.walkedIterations +
                ServiceLocator.difficultyManager.getNextSpikeSeparation();
        }
        
        if (this.nextObstacleIteration <= this.walkedIterations)
        {
            var obstacle = new Obstacle(ServiceLocator.camera.getPosition());
            obstacle.create(this.game);
            this.obstacles.push(obstacle);
            this.obstaclesPlaced ++;
            this.nextObstacleIteration = undefined;
        }
    
        for (var ind in this.obstacles)
        {
            this.obstacles[ind].update();
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
        
        this.x += this.speed;
    }
    
    directionHandler(_context, _dir, _angle)
    {
        this.player.jump(_angle);
    }
    
    startWalk()
    {    
        ServiceLocator.inputManager.directionGesture.add(this.directionHandler, this);
        
        this.obstaclesPlaced = 0;
        this.nextObstacleIteration = undefined;
        this.player.startWalk();
    }
    
    isWalkingFinished()
    {
        if (this.obstaclesPlaced >= ServiceLocator.difficultyManager.getSpikeNumber() && this.obstacles.length == 0 && this.player.onGround())
        {
            ServiceLocator.inputManager.directionGesture.remove(this.directionHandler, this);
            this.player.finishWalk();
            this.walkedIterations = 0;
            
            return true;
        }
        return false;
    }
    
    getUpdatedDistance()
    {
        if ( ServiceLocator.infoManager.shouldPause())
        {
            return 0;
        }
        return this.speed;
    }
}

class Obstacle
{
    constructor(_position)
    {
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
        this.sprite = game.add.sprite(resolution.x, 0, 'spike');
        this.sprite.y = GROUND_LEVEL - this.sprite.height;
    }
    
    update()
    {
        this.sprite.x = resolution.x + this.position.x - ServiceLocator.camera.x;
    }
    
    isOut()
    {
        return this.sprite.x < -this.sprite.width;
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
