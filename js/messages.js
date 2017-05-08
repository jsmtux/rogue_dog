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
    constructor(_hitPercentage)
    {
        super("SkillSelectorResultMessage", {"percentage":_hitPercentage});
    }
    
    getHitPercentage()
    {
        return this.arguments["percentage"];
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
    constructor()
    {
        super("CardPieceFoundMessage", {});
    }
}

class GearCardCompletedMessage extends Message
{
    constructor()
    {
        super("GearCardCompletedMessage", {});
    }
}

class GearCardCollectedMessage extends Message
{
    constructor()
    {
        super("GearCardCollectedMessage", {});
    }
}

class CardLootedMessage extends Message
{
    constructor(_card)
    {
        super("CardLootedMessage", {"card":_card});
    }
    
    getCard()
    {
        return this.arguments["card"];
    }
}
