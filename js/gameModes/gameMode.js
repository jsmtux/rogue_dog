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