class CollarCharacter
{
    constructor()
    {
        this.lastReceivedStickChange = 0;
        this.faceWidget = new FaceScreenWidget();
        this.stickNumber = 0;
    }
    
    static preload(_game)
    {
        _game.load.image("logo", "img/logo.png");
    }
    
    create(_mainState)
    {
        this.mainState = _mainState;
        this.screen = ServiceLocator.guiManager.collarScreen;
        
        this.screen.pushWidget(this.faceWidget);
        
        ServiceLocator.registerListener(this.obstacleHit, this, "JumpFailedMessage");
        ServiceLocator.registerListener(this.stickNumberUpdated, this, "StickNumberUpdated");
        ServiceLocator.registerListener(this.attackStarted, this, "AttackStartedMessage");
        
        this.warnedAboutRunningOutOfSticks = false;
    }
    
    obstacleHit(_msg)
    {
        this.stackFaceFor(":grin:", 1000);
    }
    
    stickNumberUpdated(_msg)
    {
        this.stickNumber = _msg.getNumber();
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
    
    attackStarted()
    {
        
        if (!this.warnedAboutRunningOutOfSticks && this.stickNumber === 0)
        {
            this.warnedAboutRunningOutOfSticks = true;
            this.mainState.gameConfiguration.promptStoryPath("Introduction.no_more_sticks");
        }
    }
    
    stackFaceFor(_name, _time)
    {
        clearTimeout(this.currentTimeout);
        this.faceWidget.setFace(_name);
        this.currentTimeout = setTimeout(()=>{this.faceWidget.setFace(":smile:");}, _time);
    }
}
