class GUIManager
{
    constructor()
    {
    }

    static preload(_game)
    {
        GUIManager.slickUIPlugin = _game.plugins.add(Phaser.Plugin.SlickUI);
        CardGuiElement.preload(_game);
    }
    
    create(_game)
    {
        this.game = _game;
    }
    
    addToState(_game)
    {
        GUIManager.slickUIPlugin.load('uiSkin/kenney/kenney.json');
    }
    
    addToRenderer()
    {
        this.customBmd = this.game.add.graphics(0,0);
        ServiceLocator.renderer.addToUI(this.customBmd);
        GUIManager.slickUIPlugin.container.displayGroup = this.game.add.group();
    }
    
    update()
    {
        ServiceLocator.renderer.UIGroup.bringToTop(this.customBmd);
        this.game.world.bringToTop(GUIManager.slickUIPlugin.container.displayGroup);
    }

    createUI(_constructor)
    {
        _constructor.create(GUIManager.slickUIPlugin, this.game, this.customBmd);
    }
}

GUIManager.loadedUIs = {};
GUIManager.slickUIPlugin;