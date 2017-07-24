class CollarCharacter
{
    constructor()
    {
        this.lastReceivedStickChange = 0;
    }
    
    static preload()
    {
        
    }
    
    create(_mainState)
    {
        this.screen = new CollarScreenUI(_mainState);
        ServiceLocator.guiManager.createUI(this.screen);
        
        ServiceLocator.registerListener(this.obstacleHit, this, "JumpFailedMessage");
        ServiceLocator.registerListener(this.stickNumberUpdated, this, "StickNumberUpdated");
    }
    
    obstacleHit(_msg)
    {
        this.stackFaceFor(":grin:", 1000);
    }
    
    stickNumberUpdated(_msg)
    {
        
        if (_msg.getNumber() > _msg.getPreviousNumber())
        {
            if (performance.now() - this.lastReceivedStickChange > 1000)
            {
                this.stackFaceFor(":thumbs_up:", 1000);
            }
            else
            {
                this.stackFaceFor(":praise:", 1000);
            }
            
            this.lastReceivedStickChange = performance.now();
        }
    }
    
    stackFaceFor(_name, _time)
    {
        clearTimeout(this.currentTimeout);
        this.screen.setFace(_name);
        this.currentTimeout = setTimeout(()=>{this.screen.setFace(":smile:");}, _time);        
    }
}
