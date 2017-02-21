class Camera
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.lastX = this.x;
        this.speed = 0;
    }
    
    create(_game)
    {
        this.game = _game;
        this.game.updateSignal.add(this.update, this);
    }
    
    update()
    {
        this.x += this.speed;
        this.game.camera.x = 10;
    }
    
    getPosition()
    {
        return {x: this.x, y:this.y};
    }
    
    setSpeed(_speed)
    {
        this.speed = _speed;
    }
}
