class GameObject
{
    constructor()
    {
        this.sprite;
        this.isAnimation = false;
    }
    
    create(sprite, isAnimation)
    {
        this.sprite = sprite;
        if (isAnimation)
        {
            this.isAnimation = true;
            ServiceLocator.animationManager.registerSprite(this.sprite);
        }
    }
    
    destroy()
    {
        if (this.isAnimation)
        {
            ServiceLocator.animationManager.unRegisterSprite(this.sprite);
        }
        this.sprite.destroy();
    }    
    
    setVisible(_visible)
    {
        this.sprite.visible = _visible;
    }
}
