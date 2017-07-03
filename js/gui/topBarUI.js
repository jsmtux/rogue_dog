class TopBarUI
{
    constructor(_game)
    {
        this.game = _game;
        
        this.topBarGroup = _game.add.group();
        //this.healthBar = new HealthBar();
    }
    
    static preload(_game)
    {
        _game.load.image("topUiBg", "img/ui/top_ui_bg.png");
        
        GameModeUI.preload(_game);
        
        //HealthBar.preload(_game);
        HeartsUI.preload(_game);
    }
    
    create()
    {
        ServiceLocator.renderer.addToUI(this.topBarGroup);

        this.sprite = this.game.add.sprite(0, 0, 'topUiBg');
        this.sprite.width = ServiceLocator.viewportHandler.resolution.x;
        this.topBarGroup.add(this.sprite);

        this.gameModeUI = new GameModeUI(this.game);
        this.gameModeUI.create(this.topBarGroup);
        
        this.stickCounterGUI = new StickCounterGuiElement()
        var stickCounterUI = ServiceLocator.guiManager.createUI(this.stickCounterGUI);
        
        //this.healthBar.create(this.topBarGroup);
        this.hearts = new HeartsUI(4, this.game);
        this.hearts.create(this.topBarGroup);
    }
    
}