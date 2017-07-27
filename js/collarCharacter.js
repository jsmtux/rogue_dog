class CollarCharacter
{
    constructor()
    {
        this.lastReceivedStickChange = 0;
        this.faceWidget = new FaceScreenWidget();
        this.logoImage = new ImageScreenWidget();
        this.text = new TextScreenWidget("TAP to start, motherfucker!");
        this.textContainer = new MarginsScreenWidget(this.text, 20, 20);
    }
    
    static preload(_game)
    {
        ImageScreenWidget.preload(_game);
    }
    
    create(_mainState)
    {
        this.screen = new CollarScreenUI(_mainState);
        ServiceLocator.guiManager.createUI(this.screen);
        
        ServiceLocator.registerListener(this.obstacleHit, this, "JumpFailedMessage");
        ServiceLocator.registerListener(this.stickNumberUpdated, this, "StickNumberUpdated");
        
        //this.faceWidget.create(_mainState.game);
        /*this.logoImage.create(_mainState.game);
        this.textContainer.create(_mainState.game);*/

        var screenGroup = new VGroupScreenWidget([this.faceWidget, this.logoImage, this.textContainer]);

        this.screen.setWidget(screenGroup);
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
