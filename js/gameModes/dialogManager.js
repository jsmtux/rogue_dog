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
    }
    
    static preload(_game)
    {
        DialogManager.addTalkingCharacter("collar", _game);
        DialogManager.addTalkingCharacter("dog", _game);
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
            this.currentDialogUI.update();
        }
    }
    
    startMode()
    {
    }
    
    setLine(_line, _callback, _callbackCtx)
    {
        var currentCharacter;
        for (var ind in _line.tags)
        {
            var tag = _line.tags[ind];
            var tokens = tag.split(":");
            if (tokens.length >= 2)
            {
                if (tokens[0] === "c")
                {
                    currentCharacter = DialogManager.talkingCharacters[tokens[1]];
                }
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
        this.currentDialogUI.destroy();
        this.currentDialogUI = undefined;
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
        this.imageId = this.name + 'Thumbnail';
    }
    
    preload(_game)
    {
        _game.load.image(this.imageId, './img/dialog_thumbnails/' + this.name + '.png');
    }
    
    getImageId()
    {
        return this.imageId;
    }
}