class CollarCharacter
{
    constructor()
    {
        this.lastReceivedStickChange = 0;
        this.faceWidget = new FaceScreenWidget();
    }
    
    static preload(_game)
    {
        _game.load.image("logo", "img/logo.png");
    }
    
    create()
    {
        this.screen = ServiceLocator.guiManager.collarScreen;
        
        this.screen.pushWidget(this.faceWidget);
        
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
        this.faceWidget.setFace(_name);
        this.currentTimeout = setTimeout(()=>{this.faceWidget.setFace(":smile:");}, _time);        
    }
}
