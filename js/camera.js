function Camera()
{
    this.x = 0;
    this.y = 0;
    this.lastX = this.x;
    this.speed = 0;
}

Camera.prototype.create = function(_game)
{
    this.game = _game;
    this.game.updateSignal.add(this.update, this);
}

Camera.prototype.update = function()
{
    this.x += this.speed;
    this.game.camera.x = 10;
}

Camera.prototype.getPosition = function()
{
    return {x: this.x, y:this.y};
}

Camera.prototype.setSpeed = function(_speed)
{
    this.speed = _speed;
}