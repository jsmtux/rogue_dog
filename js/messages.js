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

class NewBannerMessage extends Message
{
    constructor(_messageType)
    {
        super("NewBannerMessage", {"type":_messageType})
    }
    
    getMessageType()
    {
        return this.arguments["type"];
    }
}

NewBannerMessage.Types = {
    "Attack": 0,
    "Defend": 1
}

class EmitParticle extends Message
{
    constructor(_type, _position)
    {
        super("EmitParticle", {"type":_type, "position":_position});
    }
    
    getPosition()
    {
        return this.arguments["position"];
    }
    
    getType()
    {
        return this.arguments["type"];
    }
}

EmitParticle.Types = {
    "GrassLand": 0,
    "HealthIncrease": 1,
    "EnergyIncrease": 2
}