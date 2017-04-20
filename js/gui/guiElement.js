class GuiElement
{
    constructor()
    {
        this.rootElement;
        this.elementSignal = new Phaser.Signal();
    }
    
    create(_slickUI, _game, _rootElement)
    {
        this.rootElement = _rootElement;
    }
    
    show()
    {
        this.rootElement.visible = true;
    }
    
    hide()
    {
        this.rootElement.visible = false;
    }
    
    getSpriteGroup()
    {
        return this.rootElement.container.displayGroup;
    }
    
    destroy()
    {
        this.getSpriteGroup().destroy();
    }
    
    getSignalCall(_name)
    {
        return () =>
        {
            this.elementSignal.dispatch(_name);
        }
    }
    
    addListener(_cb, _cbCtxt)
    {
        this.elementSignal.add(_cb, _cbCtxt);
    }
    
    removeListener(_cb, _cbCtxt)
    {
        this.elementSignal.remove(_cb, _cbCtxt);
    }
}

class MenuGuiElement extends GuiElement
{
    create(_slickUI, _game)
    {
        var button, panel;
        _slickUI.add(panel = new SlickUI.Element.Panel(600, 50, 250, 150));
        panel.add(new SlickUI.Element.Text(10,0, "Rogue Dog")).centerHorizontally().text.alpha = 0.5;
        panel.add(button = new SlickUI.Element.Button(0, 50, 240, 40)).events.onInputUp.add(this.getSignalCall("playButtonClicked"));
        button.add(new SlickUI.Element.Text(0,0, "Story")).center();
        panel.add(button = new SlickUI.Element.Button(0, 100, 240, 40)).events.onInputUp.add(this.getSignalCall("endlessButtonClicked"));
        button.add(new SlickUI.Element.Text(0,0, "Endless")).center();
        
        super.create(_slickUI, _game, panel);
    }
}

class GameOverGuiElement extends GuiElement
{
    create(_slickUI, _game)
    {
        var button, panel;
        _slickUI.add(panel = new SlickUI.Element.Panel(300, 200, 300, 150));
        panel.add(new SlickUI.Element.Text(10,0, "You Lost!")).centerHorizontally().text.alpha = 0.5;
        panel.add(button = new SlickUI.Element.Button(0, 50, 380, 40)).events.onInputUp.add(this.getSignalCall("reload"));
        button.add(new SlickUI.Element.Text(0,0, "Restart")).center();
        panel.add(button = new SlickUI.Element.Button(0, 100, 380, 40)).events.onInputUp.add(this.getSignalCall("back"));
        button.add(new SlickUI.Element.Text(0,0, "Back to Menu")).center();
        
        super.create(_slickUI, _game, panel);
    }
}

class CardGuiElement extends GuiElement
{
    constructor(_title, _description, _logoName)
    {
        super();
        this.title = _title;
        this.description = _description;
        this.logoName = _logoName;
    }

    create(_slickUI, _game)
    {
        var background = _slickUI.add(new SlickUI.Element.DisplayObject(0, 0, game.make.sprite(0, 0, 'cardbg')));
        background.add(new SlickUI.Element.Text(40,40, this.title));
        background.add(new SlickUI.Element.DisplayObject(50, 90, game.make.sprite(0, 0, this.logoName)));
        background.add(new SlickUI.Element.Text(30,285, this.description, undefined, undefined, 220, 80));
        
        super.create(_slickUI, _game, background);
    }
}

class DialogGuiElement extends GuiElement
{
    constructor(_text, _options, _talkingCharacter)
    {
        super();
        this.fullText = _text[0];
        this.options = _options;
        this.currentText = "";
        this.finishedShowing = false;
        this.buttons = [];
        this.talkingCharacter = _talkingCharacter;
    }
    
    create(_slickUI, _game)
    {
        if (!this.options || this.options.length == 0)
        {
            this.options = [{text:"continue"}];
        }
        var thumbnailPanel;
        _slickUI.add(this.panel = new SlickUI.Element.Panel(50, 150, 700, 150));
        this.panel.add(thumbnailPanel = new SlickUI.Element.Panel(10, 10, 120, 120));
        this.panel.add(this.text = new SlickUI.Element.Text(150,10, ""));
        
        if (this.talkingCharacter)
        {
            thumbnailPanel.add(new SlickUI.Element.DisplayObject(5, 5, game.make.sprite(0, 0, this.talkingCharacter.getImageId())));
        }
        
        super.create(_slickUI, _game, this.panel);
        ServiceLocator.inputManager.leftButton.onDown.add(this.finishWritingText, this);
    }
    
    update()
    {
        var desiredHeight = 160 + 50 * this.options.length;
        if (this.currentText.length < this.fullText.length)
        {
            this.currentText += this.fullText.charAt(this.currentText.length);
        }
        else if(this.panel.height < desiredHeight)
        {
            this.panel.height += 5;
        }
        else if (!this.finishedShowing)
        {
            ServiceLocator.inputManager.leftButton.onDown.remove(this.finishWritingText, this);
            this.finishedShowing = true;
            for(var ind in this.options)
            {
                ind = parseInt(ind);
                var button;
                this.panel.add(button = new SlickUI.Element.Button(0, 160 + 50 * ind, 690, 40)).events.onInputUp.add(this.getSignalCall(ind));
                button.add(new SlickUI.Element.Text(0,0, this.options[ind].text)).center();
                this.buttons.push(button);
            }
        }
        this.text.value = this.currentText;
    }
    
    finishWritingText()
    {
        this.currentText = this.fullText;
    }
    
    destroy()
    {
        for(var ind in this.buttons)
        {
            this.buttons[parseInt(ind)].events.destroy();
            this.buttons[parseInt(ind)].sprite.destroy();
        }
        super.destroy();
    }
}
