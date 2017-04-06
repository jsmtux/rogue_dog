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
    constructor()
    {
        super("ObstacleShownMessge", {});
    }
}

class SkillSelectorResult extends Message
{
    constructor(_succeeded)
    {
        super("SkillSelectorResult", {"success":_succeeded});
    }
    
    getSuccess()
    {
        return this.arguments["success"];
    }
}