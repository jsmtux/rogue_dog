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
        GUIManager.slickUIPlugin.container.displayGroup = this.game.add.group();
    }
    
    update()
    {
    }

    createUI(_constructor)
    {
        _constructor.create(GUIManager.slickUIPlugin, this.game);
    }
}

GUIManager.loadedUIs = {};
GUIManager.slickUIPlugin;