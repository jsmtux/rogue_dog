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
    
    //deprecated
    show()
    {
        this.rootElement.visible = true;
    }
    
    //deprecated
    hide()
    {
        this.rootElement.visible = false;
    }
    
    visible(_visible)
    {
        this.rootElement.visible = _visible;
    }
    
    getSpriteGroup()
    {
        return this.rootElement.container.displayGroup;
    }
    
    destroy()
    {
        this.getSpriteGroup().destroy();
        this.rootElement.destroy();
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

class DialogGuiElement extends GuiElement
{
    constructor()
    {
        super();
    }
    
    create(_slickUI, _game, _customBmd)
    {
        this.slickUI = _slickUI;
        this.bmd = _customBmd;
        this.game = _game;
        
        var res = ServiceLocator.viewportHandler.resolution;
        var pos = new Phaser.Point((res.x - 700) / 2, (res.y - 150) / 2);
        _slickUI.add(this.panel = new SlickUI.Element.Panel(pos.x, 150, 700, 150));
        this.panel._sprite.visible = false;
        this.panel.add(this.text = new SlickUI.Element.Text(10,10, "", 20, "collar"));
        
        super.create(_slickUI, _game, this.panel);
    }
    
    show(_text, _options, _talkingCharacter)
    {
        this.fullText = _text;
        this.options = _options;
        this.currentText = "";
        this.finishedShowing = false;
        this.buttons = [];
        this.talkingCharacter = _talkingCharacter;
        this.talkingAudio;
        this.containsAnswers = true;
        this.text.value = "";

        if (!this.options || this.options.length === 0)
        {
            this.options = [{text:"continue"}];
            this.containsAnswers = false;
        }
        
        if (this.talkingCharacter)
        {
            var audioID = this.talkingCharacter.getAudioId();
            if (audioID)
            {
                this.talkingAudio = this.game.add.audio(audioID);
            }
        }
        if (this.talkingAudio)
        {
            this.talkingAudio.play();
        }
        
        ServiceLocator.inputManager.leftButton.onDown.add(this.finishWritingText, this);
    }
    
    drawSpeechBubble(_rectangle, _source)
    {
        this.bmd.clear();
        
        this.bmd.beginFill(0xFEE98C);
        this.bmd.moveTo(_rectangle.x, _rectangle.y);
        this.bmd.lineTo(_rectangle.x + _rectangle.width, _rectangle.y);
        this.bmd.lineTo(_rectangle.x + _rectangle.width, _rectangle.y + _rectangle.height);
        this.bmd.lineTo(_rectangle.x, _rectangle.y + _rectangle.height);

        this.bmd.moveTo(_source.x, _source.y);
        this.bmd.lineTo(_rectangle.x, _rectangle.y + _rectangle.height);
        var bottomRightPanel = _rectangle.x + _rectangle.width;
        this.bmd.lineTo(_rectangle.width < 100 ? bottomRightPanel : _rectangle.x + 100, _rectangle.y + _rectangle.height);
        this.bmd.moveTo(_source.x, _source.y);
        
        this.bmd.endFill();
    }
    
    update(_source)
    {
        var rect = new Phaser.Rectangle(this.panel.x, this.panel.y, this.text.text.width + 40, this.text.text.height + 40);
        this.drawSpeechBubble(rect, _source);

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
            var buttonHeight = rect.height;
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
    
    hide()
    {
        this.bmd.clear();
        for (var ind in this.buttons)
        {
            this.buttons[ind].destroy();
        }
        this.buttons = [];
        this.text.value = "";
    }
    
    destroy()
    {
        super.destroy();
    }
}
