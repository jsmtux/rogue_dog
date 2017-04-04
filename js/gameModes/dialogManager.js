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
    }

    update()
    {
    }
    
    startMode()
    {
    }
    
    setLine(_line, _callback, _callbackCtx)
    {
        this.currentDialogUI = new DialogGuiElement(_line.fullText, _line.options);
        ServiceLocator.guiManager.createUI(this.currentDialogUI);
        this.currentDialogUI.addListener(this.callback, this);
        
        this.callback = _callback;
        this.callbackCtx = _callbackCtx;
    }
    
    callback(_option)
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

DialogManager.NAME = "DialogManager";