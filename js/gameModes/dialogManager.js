class DialogManager extends GameMode
{
    constructor(_game)
    {
        super();
        this.finished = false;
        this.game = _game;
        
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
    }
    
    static addTalkingCharacter(_name, _game)
    {
        var character = new TalkingCharacter(_name);
        character.preload(_game);
        DialogManager.talkingCharacters[_name] = character;
    }

    update()
    {
    }
    
    startMode()
    {
        ServiceLocator.guiManager.disableOtherInputs();
    }
    
    finishMode()
    {        
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
        /*
        var textContainer = new MarginsScreenWidget(new TextScreenWidget(getCodeForEmoji(":tap:") +" to start!"), 20, 20);
        var textGroup = new HGroupScreenWidget([new SeparatorScreenWidget(300, 0), textContainer]);
        var screenGroup = new VGroupScreenWidget([new ImageScreenWidget("logo"), new SeparatorScreenWidget(0, 40), textGroup]);
        */
        var collarText = new MarginsScreenWidget(new TextScreenWidget(_line.fullText), 20, 20);
        var vGroupContents = [collarText];
        for(var i = 0; i < _line.options.length; i++)
        {
            var curLine = _line.options[i].text;
            var separator;
            if ((separator = curLine.indexOf(":")) >= 0)
            {
                curLine = curLine.substring(separator + 1);
            }
            vGroupContents.push(new TextScreenWidget(curLine));
        }
        var dialogWidget = new VGroupScreenWidget(vGroupContents);
        ServiceLocator.guiManager.collarScreen.pushWidget(dialogWidget);
                
        this.callback = _callback;
        this.callbackCtx = _callbackCtx;
        setTimeout(() => {this.dialogHandler(0)}, 1000);
    }
    
    dialogHandler(_option)
    {
        ServiceLocator.guiManager.collarScreen.popWidget();
        this.callback.call(this.callbackCtx, _option);
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
