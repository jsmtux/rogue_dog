class GUIManager
{
    constructor()
    {
        this.lostUI = GUIManager.getUI(lostGameUI, GUIElement);
        this.mainMenuUI = GUIManager.getUI(mainMenuUI, GUIElement);
    }

    static preload(_game)
    {
        EZGUI.renderer = _game.renderer;
        _game.load.EZGUITheme('metalworks', 'lib/ezgui_assets/metalworks-theme/metalworks-theme.json');
        _game.load.image('cardbg', 'img/card/card_bg.png');
    }
    
    static getUI(_ui, _constructor)
    {
        var ret = GUIManager.loadedUIs[_ui.id];
        if (!ret)
        {
            ret = new _constructor(_ui);
            GUIManager.loadedUIs[_ui.id] = ret;
        }
        
        return ret;
    }
    
    create(_game)
    {
        this.UIGroup = _game.add.group();
        this.UIGroup.fixedToCamera = true;
        
        this.game = _game;
        
        this.game.updateSignal.add(this.update, this);
    }
    
    update()
    {
        //this.game.world.bringToTop(this.UIGroup);
    }
    
    addToUI(_sprite)
    {
        this.UIGroup.add(_sprite);
    }

    getCardUI(_title, _text, _logoName)
    {
        var currentCardUI = cloneObject(cardUI);
        currentCardUI.children[0].text = _title;
        currentCardUI.children[1].image = _logoName;
        currentCardUI.children[2].text = _text;
        
        var cardGuiContainer = new GUIElement(currentCardUI);
        cardGuiContainer.visible = false;
        
        return cardGuiContainer;
    }
    
    getDialogUI(_text, _options, _callback, _callbackCtx)
    {
        var currentDialogUI = cloneObject(dialogUI);
        currentDialogUI.children[0].text = _text;
        if (_options.length != 0)
        {
            for(var ind = 0; ind < 3; ind++)
            {
                if (_options.length <= ind)
                {
                    currentDialogUI.children[1].children[ind] = null;
                }
                else
                {
                    currentDialogUI.children[1].children[ind].text = _options[ind].text;
                }
            }
        }
        else
        {
            currentDialogUI.children[1].children[0].text = "continue";
            currentDialogUI.children[1].children[1] = null;
            currentDialogUI.children[1].children[2] = null;
        }
        
        var ret = new GUIElement(currentDialogUI);
        
        if (_options.length != 0)
        {
            for (var i = 0; i < _options.length; i++)
            {
                ret.addCallback('option' + (i+1) + 'Button', 'click', i + 'optionClicked');
            }
        }
        else
        {
            ret.addCallback('option1Button', 'click', 'continue');
        }
        ret.registerCbReceiver(_callback, _callbackCtx);
        
        return ret;
    }
}

GUIManager.loadedUIs = {};