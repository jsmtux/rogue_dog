class AnimationManager
{
    constructor(_game)
    {
        this.sprites = [];
        this.game = _game;
        _game.updateSignal.add(this.update, this);
    }
    
    registerSprite(_sprite)
    {
        this.sprites.push(_sprite);
    }
    
    unRegisterSprite(_sprite)
    {
        this.sprites.splice(this.sprites.indexOf(_sprite), 1);
    }
    
    pauseAll()
    {
        for (var ind in this.sprites)
        {
            this.sprites[ind].animations.paused = true;
        }
    }
    
    resumeAll()
    {
        for (var ind in this.sprites)
        {
            this.sprites[ind].animations.paused = false;
        }
    }
    
    update()
    {
        for (var ind in this.sprites)
        {
            this.sprites[ind].animations.update();
        }
    }
}
