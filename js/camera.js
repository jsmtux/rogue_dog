class Camera
{
    constructor()
    {
        this.offset = new Phaser.Point(140, 435)
        this.yOffset = 435;
    }
    
    create(_game, _player)
    {
        this.game = _game;
        this.game.updateSignal.add(this.update, this);
        this.player = _player;
    }
    
    update()
    {
        this.game.camera.x = this.player.sprite.x - this.offset.x;
        //var diffY = this.game.camera.y - this.player.sprite.y + this.yOffset;
        this.game.camera.y = this.player.sprite.y - this.offset.y;
    }
    
    getPosition()
    {
        if (!this.game)
        {
            return new Phaser.Point(0,0);
        }
        return new Phaser.Point(this.game.camera.x, this.game.camera.y);
    }

    getResolution()
    {
        return resolution;
    }

    getVisibleArea()
    {
        return this.game.camera.view;
    }
    
    shake(_str, _time)
    {
        this.game.camera.shake(_str, _time);
    }

    flash(_color, _time)
    {
        this.game.camera.flash(_color, _time);
    }
}
