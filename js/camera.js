class Camera
{
    constructor()
    {
        this.offset = new Phaser.Point(260, 500)
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

    getRenderArea()
    {
        var ret;
        if (this.game)
        {
            var res = ServiceLocator.viewportHandler.nativeResolution;
            ret = new Phaser.Rectangle(this.game.camera.x, this.game.camera.y, res.x, res.y);
        }
        else
        {
            return new Phaser.Rectangle();
        }
        return ret;
    }

    getVisibleArea()
    {
        var ret;
        if (this.game)
        {
            ret = this.game.camera.view;
        }
        else
        {
            return new Phaser.Rectangle();
        }
        return ret;
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
