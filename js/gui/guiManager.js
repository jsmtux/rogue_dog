class GUIManager
{
    constructor()
    {
    }

    static preload(_game)
    {
        GUIManager.slickUIPlugin = _game.plugins.add(Phaser.Plugin.SlickUI);
        _game.load.image('cardbg', 'img/card/card_bg.png');
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