class DialogManager extends GameMode
{
    constructor(_game, _player)
    {
        super();
        this.finished = false;
        this.game = _game;
        this.cardList;
        this.player = _player;
    }

    update()
    {
    }
    
    startMode()
    {
    }
    
    setLine(_line)
    {
        console.log("Should output");
        console.log(_line);
    }
    
    isFinished()
    {
        return false;
    }
}

DialogManager.NAME = "DialogManager";