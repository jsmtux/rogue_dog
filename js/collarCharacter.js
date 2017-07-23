class CollarCharacter
{
    constructor()
    {
        this.lastReceivedStickChange = 0;
    }
    
    static preload()
    {
        
    }
    
    create()
    {
        this.screen = new CollarScreenUI();
        ServiceLocator.guiManager.createUI(this.screen);
        
        ServiceLocator.registerListener(this.obstacleHit, this, "JumpFailedMessage");
        ServiceLocator.registerListener(this.stickNumberUpdated, this, "StickNumberUpdated");
    }
    
    obstacleHit(_msg)
    {
        this.screen.setFace(":grin:");
        setTimeout(()=>{this.screen.setFace(":smile:");}, 1000);
    }
    
    stickNumberUpdated(_msg)
    {
        
        if (_msg.getNumber() > _msg.getPreviousNumber())
        {
            if (performance.now() - this.lastReceivedStickChange > 1000)
            {
                this.screen.setFace(":thumbs_up:");
                setTimeout(()=>{this.screen.setFace(":smile:");}, 1000);
            }
            else
            {
                this.screen.setFace(":praise:");
                setTimeout(()=>{this.screen.setFace(":smile:");}, 1000);
            }
            
            this.lastReceivedStickChange = performance.now();
        }
    }
}
