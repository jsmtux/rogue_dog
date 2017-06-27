class GameMode
{
    constructor()
    {
    }

    update()
    {
        console.error("Unimplemented function");
    }

    getModeName()
    {
        return this.constructor.NAME;
    }
    
    startMode()
    {
    }
    
    finishMode()
    {
    }
    
    isFinished()
    {
        return false;
    }

    getNextMode()
    {
        console.error("Unimplemented function");
    }
    
    getNextModeArguments()
    {
        return undefined;
    }
}

GameMode.visibleTypes = {
    ATTACK: 0,
    DEFEND: 1,
    JUMP: 2,
    ESCAPE: 3,
    LOOT: 4
}