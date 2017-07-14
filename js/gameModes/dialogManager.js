class DialogManager extends GameMode
{
    constructor(_game, _player)
    {
        super();
        this.finished = false;
        this.game = _game;
        this.cardList;
        this.player = _player;
        this.currentDialogUI;
        
        this.callback;
        this.callbackCtx;
        
        this.talkingCharacters = {};
        
        this.inputDisablingSprite;
    }
    
    static preload(_game)
    {
        DialogManager.addTalkingCharacter("collar", _game);
        DialogManager.addTalkingCharacter("dog", _game);
    }
    
    create(_game)
    {
        this.inputDisablingSprite = _game.add.sprite(0, 0);
        var resolution = ServiceLocator.viewportHandler.resolution;
        this.inputDisablingSprite.width = resolution.x;
        this.inputDisablingSprite.height = resolution.y;
        this.inputDisablingSprite.inputEnabled = false;
        ServiceLocator.renderer.addToUI(this.inputDisablingSprite);

        this.bmd = game.add.graphics(0, 0);
        ServiceLocator.renderer.addToUI(this.bmd);
    }
    
    static addTalkingCharacter(_name, _game)
    {
        var character = new TalkingCharacter(_name);
        character.preload(_game);
        DialogManager.talkingCharacters[_name] = character;
    }

    update()
    {
        if (this.currentDialogUI)
        {
            var position = ServiceLocator.viewportHandler.sceneToUIPosition(this.player.position);
            var sourcePos = this.player.speechBubbleSourcePoint;
            position = position.add(sourcePos.x, sourcePos.y + 80);
            this.currentDialogUI.update(position);
        }
    }
    
    startMode()
    {
        this.inputDisablingSprite.inputEnabled = true;
        this.inputDisablingSprite.input.priorityID = 2;
    }
    
    finishMode()
    {
        this.inputDisablingSprite.inputEnabled = false;
        this.speechBubble = undefined;
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
        
        for(var i = 0; i < _line.options.length; i++)
        {
            var curLine = _line.options[i].text;
            var separator;
            if ((separator = curLine.indexOf(":")) >= 0)
            {
                _line.options[i].text = curLine.substring(separator + 1);
            }
        }
        
        this.currentDialogUI = new DialogGuiElement(_line.fullText, _line.options, currentCharacter);
        ServiceLocator.guiManager.createUI(this.currentDialogUI);
        this.currentDialogUI.addListener(this.dialogHandler, this);
        
        this.callback = _callback;
        this.callbackCtx = _callbackCtx;
    }
    
    dialogHandler(_option)
    {
        //this is caused by not disabling button after choosing dialog answer
        if (this.currentDialogUI)
        {
            this.currentDialogUI.destroy();
            this.currentDialogUI = undefined;
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
