class AnimationManager
{
    constructor()
    {
        this.sprites = [];
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
}
