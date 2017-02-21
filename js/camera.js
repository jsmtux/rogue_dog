class Camera
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.lastX = this.x;
        this.speed = 0;
    }
    
    create(_game, _player)
    {
        this.game = _game;
        this.game.updateSignal.add(this.update, this);
        this.player = _player;
    }
    
    update()
    {
        this.game.camera.x = this.player.spriterGroup.x - 140;
    }
    
    getPosition()
    {
        if (!this.game)
        {
            return new Phaser.Point(0,0);
        }
        return new Phaser.Point(this.game.camera.x, this.game.camera.y);
    }
    
    setSpeed(_speed)
    {
        this.speed = _speed;
    }

    getResolution()
    {
        return resolution;
    }

    getVisileArea()
    {
        return this.game.camera.view;
    }
}
