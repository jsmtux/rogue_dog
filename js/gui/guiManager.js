class GUIManager
{
    constructor()
    {
    }

    static preload(_game)
    {
        DistanceMeterUI.preload(_game);

        _game.load.bitmapFont('noto_emoji', 'fonts/noto_emoji.png', 'fonts/noto_emoji.xml');
        _game.load.bitmapFont('collar', 'fonts/collar.png', 'fonts/collar.fnt');
        _game.load.bitmapFont('comic', 'fonts/comic.png', 'fonts/comic.fnt');
    }
    
    create(_game)
    {
        this.game = _game;
        
        this.collarScreen = new CollarScreenUI();
    }
    
    addToRenderer()
    {
        this.customBmd = this.game.add.graphics(0,0);
        ServiceLocator.renderer.addToUI(this.customBmd);
        this.group = this.game.add.group();
        
        this.collarScreen.create(this.game, this.group);
    }
    
    update()
    {
        ServiceLocator.renderer.UIGroup.bringToTop(this.customBmd);
        this.game.world.bringToTop(this.group);
        
        this.collarScreen.update();
    }
}