class Message
{
    constructor(_name, _arguments)
    {
        this.name = _name;
        this.arguments = _arguments;
    }
}

class JumpFailedMessage extends Message
{
    constructor()
    {
        super("JumpFailedMessage", {});
    }
}

class ObstacleShownMessge extends Message
{
    constructor(_obstacle)
    {
        super("ObstacleShownMessge", {"obstacle":_obstacle});
    }
    
    getObstacle()
    {
        return this.arguments["obstacle"];
    }
}

class SkillSelectorResultMessage extends Message
{
    constructor(_succeeded)
    {
        super("SkillSelectorResultMessage", {"success":_succeeded});
    }
    
    getSuccess()
    {
        return this.arguments["success"];
    }
}

class EnemiesInPlaceMessage extends Message
{
    constructor()
    {
        super("EnemiesInPlaceMessage", {});
    }
}

class StoryCommandReceived extends Message
{
    constructor(_command)
    {
        super("StoryCommandReceived", {"command": _command});
    }
    
    getCommand()
    {
        return this.arguments["command"];
    }
}

class CardPieceFoundMessage extends Message
{
    constructor(_command)
    {
        super("CardPieceFoundMessage", {});
    }
}

class GearCardCompletedMessage extends Message
{
    constructor(_command)
    {
        super("GearCardCompletedMessage", {});
    }
}
