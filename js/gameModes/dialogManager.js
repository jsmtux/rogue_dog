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
        ServiceLocator.inputManager.disableOtherInputs();
    }
    
    finishMode()
    {        
        ServiceLocator.inputManager.enableOtherInputs();
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

        var collarText = _line.fullText;
        var emojiText = "";
        var i = 0;
        while(i < collarText.length)
        {
            var curChar = collarText.charAt(i++);
            if (curChar !== ':')
            {
                emojiText += curChar;
            }
            else
            {
                var emojiCode = "";
                do
                {
                    emojiCode += curChar;
                    curChar = collarText.charAt(i++);
                }
                while (curChar !== ':')
                emojiCode += curChar;
                var id = getCodeForEmoji(emojiCode);
                if (id)
                {
                    emojiText += id;
                }
                else
                {
                    emojiText += "[]";
                }
            }
        }
        var emojiLines = emojiText.split('\\n');

        var vGroupContents = [];

        for (var ind in emojiLines)
        {
            vGroupContents.push(new MarginsScreenWidget(new TextScreenWidget(emojiLines[ind]), 20, 20));
        }
        
        for(var i = 0; i < _line.options.length; i++)
        {
            var curLine = _line.options[i].text;
            var separator;
            if ((separator = curLine.indexOf(":")) >= 0)
            {
                curLine = curLine.substring(separator + 1);
            }
            var self = this;
            var callback = (function(index){return () => {self.dialogHandler(index)}})(i);
            vGroupContents.push(new ButtonScreenWidget(new TextScreenWidget(curLine), callback));
        }
        
        if (_line.options.length == 0)
        {
            ServiceLocator.inputManager.leftButton.onDown.addOnce(() => this.dialogHandler(0));
        }
        
        var dialogWidget = new VGroupScreenWidget(vGroupContents);
        ServiceLocator.guiManager.collarScreen.pushWidget(dialogWidget);
                
        this.callback = _callback;
        this.callbackCtx = _callbackCtx;
    }
    
    dialogHandler(_option)
    {
        ServiceLocator.guiManager.collarScreen.popWidget();
        this.callback.call(this.callbackCtx, parseInt(_option));
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
