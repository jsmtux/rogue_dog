class DialogManager extends GameMode
{
    constructor(_game, _player)
    {
        super();
        this.finished = false;
        this.game = _game;
        this.cardList;
        this.player = _player;
        this.dialogUI;
        
        this.callback;
        this.callbackCtx;
        
        this.talkingCharacters = {};
    }
    
    static preload(_game)
    {
        DialogManager.addTalkingCharacter("collar", _game);
        DialogManager.addTalkingCharacter("dog", _game);
    }
    
    create(_game)
    {
        this.bmd = game.add.graphics(0, 0);
        ServiceLocator.renderer.addToUI(this.bmd);
        
        this.dialogUI = new DialogGuiElement();
        ServiceLocator.guiManager.createUI(this.dialogUI);
        this.dialogUI.addListener(this.dialogHandler, this);
    }
    
    static addTalkingCharacter(_name, _game)
    {
        var character = new TalkingCharacter(_name);
        character.preload(_game);
        DialogManager.talkingCharacters[_name] = character;
    }

    update()
    {
        if (this.dialogUI)
        {
            var position = ServiceLocator.viewportHandler.sceneToUIPosition(this.player.position);
            var sourcePos = this.player.speechBubbleSourcePoint;
            position = position.add(sourcePos.x, sourcePos.y + 80);
            this.dialogUI.update(position);
        }
    }
    
    startMode()
    {
        ServiceLocator.guiManager.disableOtherInputs();
    }
    
    finishMode()
    {
        this.speechBubble = undefined;
        ServiceLocator.guiManager.enableOtherInputs();
    }
    
    findCharacter(_line)
    {
        var ret;
        var separator = _line.fullText.indexOf(":");
        if (separator >= 0)
        {
            var characterName = _line.fullText.substring(0, separator);
            ret = DialogManager.talkingCharacters[characterName];
            _line.fullText = _line.fullText.substring(separator + 1);
        }
        return ret;
    }
    
    setLine(_line, _callback, _callbackCtx)
    {
        var currentCharacter = this.findCharacter(_line);
        this.dialogUI.show(_line.fullText, _line.options, currentCharacter);
        
        for(var i = 0; i < _line.options.length; i++)
        {
            var curLine = _line.options[i].text;
            var separator;
            if ((separator = curLine.indexOf(":")) >= 0)
            {
                _line.options[i].text = curLine.substring(separator + 1);
            }
        }
                
        this.callback = _callback;
        this.callbackCtx = _callbackCtx;
    }
    
    dialogHandler(_option)
    {
        //this is caused by not disabling button after choosing dialog answer
        if (this.dialogUI)
        {
            this.dialogUI.hide();
            this.callback.call(this.callbackCtx, _option);
        }
    }
    
    isFinished()
    {
        return false;
    }
}

DialogManager.talkingCharacters = {};

DialogManager.NAME = "DialogManager";

class TalkingCharacter
{
    constructor(_name)
    {
        this.name = _name;
        this.soundName = this.name + 'Talk';
        this.audioLoadId;
    }
    
    preload(_game)
    {
        this.audioLoadId = _game.load.audio(this.soundName, 'sounds/' + this.name + '_talk.wav');
    }
    
    getAudioId()
    {
        if (this.audioLoadId.hasLoaded)
        {
            return this.soundName;
        }
        return "";
    }
}
