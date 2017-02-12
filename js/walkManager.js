function WalkManager(_game, _player, _walkSpeed, _difficultyManager)
{
    this.player = _player;
    this.walkedIterations = 0;
    this.handler;
    this.walkSpeed = _walkSpeed;
    this.obstacles = [];
    this.nextObstacleIteration;
    this.obstaclesPlaced = 0;
    this.game = _game;
    this.difficultyManager = _difficultyManager;
}

WalkManager.preload = function(_game)
{
    Obstacle.preload(_game);
}

WalkManager.prototype.update = function()
{
    this.walkedIterations ++;
    this.player.updateWalk();
    
    if (this.nextObstacleIteration == undefined
        && this.obstaclesPlaced < this.difficultyManager.getSpikeNumber())
    {
        this.nextObstacleIteration = 
            this.walkedIterations + 60 + // minimumJumpable distance
            this.difficultyManager.getSpikeVarSeparation();
    }
    
    if (this.nextObstacleIteration <= this.walkedIterations)
    {
        var obstacle = new Obstacle(this.walkSpeed);
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
}

WalkManager.prototype.startWalk = function()
{
    var self = this;
    this.handler = function(){
        self.player.jump();
    }
    this.game.inputManager.leftButton.onDown.add(this.handler, this);
    this.obstaclesPlaced = 0;
    this.nextObstacleIteration = undefined;
    this.player.startWalk();
}

WalkManager.prototype.isWalkingFinished = function()
{
    if (this.obstaclesPlaced >= this.difficultyManager.getSpikeNumber() && this.obstacles.length == 0 && this.player.onGround())
    {
        this.game.inputManager.leftButton.onDown.remove(this.handler, this);
        this.player.finishWalk();
        this.walkedIterations = 0;
        return true;
    }
    return false;
}

function Obstacle(_speed)
{
    this.speed = _speed;
    this.sprite;
    this.broken = false;
}

Obstacle.preload = function(_game)
{
    _game.load.image('spike', './img/spike.png');
    _game.load.image('brokenspike', './img/brokenspike.png');
}

Obstacle.prototype.create = function(_game)
{
    this.sprite = game.add.sprite(resolution.x, 0, 'spike');
    this.sprite.y = GROUND_LEVEL - this.sprite.height;
}

Obstacle.prototype.update = function()
{
    this.sprite.x -= this.speed;
}

Obstacle.prototype.isOut = function()
{
    return this.sprite.x < -this.sprite.width;
}

Obstacle.prototype.break = function()
{
    this.broken = true;
    this.sprite.loadTexture('brokenspike');
}

Obstacle.prototype.destroy = function()
{
    this.sprite.destroy();
}

Obstacle.prototype.collides = function(_player)
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