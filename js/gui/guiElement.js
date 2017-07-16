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
        panel.add(new SlickUI.Element.Text(10,0, "Rogue Dog", 16, "comic")).centerHorizontally().text.alpha = 0.5;
        panel.add(button = new SlickUI.Element.Button(0, 50, 240, 40)).events.onInputUp.add(this.getSignalCall("playButtonClicked"));
        button.add(new SlickUI.Element.Text(0,0, "Story", 16, "comic")).center();
        panel.add(button = new SlickUI.Element.Button(0, 100, 240, 40)).events.onInputUp.add(this.getSignalCall("endlessButtonClicked"));
        button.add(new SlickUI.Element.Text(0,0, "Endless", 16, "comic")).center();
        
        super.create(_slickUI, _game, panel);
    }
}

class GameOverGuiElement extends GuiElement
{
    create(_slickUI, _game)
    {
        var res = ServiceLocator.viewportHandler.resolution;
        var pos = new Phaser.Point((res.x - 300) / 2, (res.y - 150) / 2);
        var button, panel;
        _slickUI.add(panel = new SlickUI.Element.Panel(pos.x, pos.y, 300, 150));
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
    
    static preload(_game)
    {
        _game.load.image('cardbg', 'img/card/card_bg.png');
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

class StickCounterGuiElement extends GuiElement
{
    constructor()
    {
        super();
    }
    
    create(_slickUI, _game)
    {
        _slickUI.add(new SlickUI.Element.DisplayObject(300, 23, game.make.sprite(0, 0, 'stick')));
        this.text = _slickUI.add(new SlickUI.Element.Text(370,20, "x"));
        this.setNumber(0);
        ServiceLocator.registerListener(this.numberUpdated, this, "StickNumberUpdated");
    }
    
    setNumber(_number)
    {
        this.text.value = "x" + _number;
    }
    
    numberUpdated(_msg)
    {
        this.setNumber(_msg.getNumber());
    }
}

class DialogGuiElement extends GuiElement
{
    constructor(_text, _options, _talkingCharacter)
    {
        super();
        this.fullText = _text;
        this.options = _options;
        this.currentText = "";
        this.finishedShowing = false;
        this.buttons = [];
        this.talkingCharacter = _talkingCharacter;
        this.talkingAudio;
        this.containsAnswers = true;
    }
    
    create(_slickUI, _game, _customBmd)
    {
        this.slickUI = _slickUI;
        this.bmd = _customBmd;
        if (!this.options || this.options.length === 0)
        {
            this.options = [{text:"continue"}];
            this.containsAnswers = false;
        }
        var res = ServiceLocator.viewportHandler.resolution;
        var pos = new Phaser.Point((res.x - 700) / 2, (res.y - 150) / 2);
        _slickUI.add(this.panel = new SlickUI.Element.Panel(pos.x, 150, 700, 150));
        this.panel._sprite.visible = false;
        this.panel.add(this.text = new SlickUI.Element.Text(10,10, "", 16, "collar"));
        
        if (this.talkingCharacter)
        {
            var audioID = this.talkingCharacter.getAudioId();
            if (audioID)
            {
                this.talkingAudio = _game.add.audio(audioID);
            }
        }
        if (this.talkingAudio)
        {
            this.talkingAudio.play();
        }
        
        super.create(_slickUI, _game, this.panel);
        ServiceLocator.inputManager.leftButton.onDown.add(this.finishWritingText, this);
    }
    
    update(_source)
    {
        
        this.bmd.clear();
        var textPosition = new Phaser.Point(this.panel.x, this.panel.y);
        var textSize = new Phaser.Point(this.text.text.width + 40, this.text.text.height + 40);
        
        this.bmd.beginFill(0xFEE98C);
        this.bmd.moveTo(textPosition.x, textPosition.y);
        this.bmd.lineTo(textPosition.x + textSize.x, textPosition.y);
        this.bmd.lineTo(textPosition.x + textSize.x, textPosition.y + textSize.y);
        this.bmd.lineTo(textPosition.x, textPosition.y + textSize.y);

        this.bmd.moveTo(_source.x, _source.y);
        this.bmd.lineTo(textPosition.x, textPosition.y + textSize.y);
        var bottomRightPanel = textPosition.x + textSize.x;
        this.bmd.lineTo(textSize.x < 100 ? bottomRightPanel : textPosition.x + 100, textPosition.y + textSize.y);
        this.bmd.moveTo(_source.x, _source.y);
        
        this.bmd.endFill();

        var desiredHeight = 160 + 50 * this.options.length;
        if (this.currentText.length < this.fullText.length)
        {
            this.currentText += this.fullText.charAt(this.currentText.length);
        }
        else if(this.panel.height < desiredHeight)
        {
            this.panel.height = desiredHeight;
            this.panel._sprite.visible = false;
        }
        else if (!this.finishedShowing)
        {
            var textFinishPos = this.text.text.textHeight;
            ServiceLocator.inputManager.leftButton.onDown.remove(this.finishWritingText, this);
            this.finishedShowing = true;
            var buttonHeight = textSize.y;
            for(var ind in this.options)
            {
                ind = parseInt(ind);
                var button;
                this.panel.add(button = new SlickUI.Element.Button(100, buttonHeight, 690, 40));
                if (this.containsAnswers)
                {
                    ((_ind) =>
                    {
                        button.events.onInputUp.add((_button) => {
                            ServiceLocator.publish(new DogAnswerChosen())
                            for (var ind in this.buttons)
                            {
                                if (_ind === parseInt(ind))
                                {
                                    this.buttons[ind].sprite.events.onInputDown.removeAll();
                                }
                                else
                                {
                                    this.buttons[ind].visible = false;
                                }
                            }
                            setTimeout(this.getSignalCall(_ind), 1000);
                        });
                    })(ind);
                }
                else
                {
                    button.events.onInputUp.add(this.getSignalCall(ind));
                }
                button.add(new SlickUI.Element.Text(0,0, this.options[ind].text, 16, "comic")).center();
                button.sprite.input.priorityID = 3;
                this.buttons.push(button);
                buttonHeight += 50;
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
        this.bmd.clear();
        super.destroy();
    }
}
