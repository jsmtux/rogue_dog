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

class EnemyTargeted extends Message
{
    constructor(_enemy, _hitType)
    {
        super("EnemyTargeted", {"enemy":_enemy, "hitType":_hitType});
    }
    
    getEnemy()
    {
        return this.arguments["enemy"];
    }
    
    getHitType()
    {
        return this.arguments["hitType"];
    }
}

class ItemPickedMessage extends Message
{
    constructor(_item)
    {
        super("ItemPickedMessage", {"item":_item});
    }
    
    getItem()
    {
        return this.arguments["item"];
    }
}

class NewGameModeMessage extends Message
{
    constructor(_mode)
    {
        super("NewGameModeMessage", {"mode": _mode});
    }
    
    getMode()
    {
        return this.arguments["mode"];
    }
}

class AttackDefendedMessage extends Message
{
    constructor()
    {
        super("AttackDefendedMessage");
    }
}

class StickNumberUpdated extends Message
{
    constructor(_number)
    {
        super("StickNumberUpdated", {"number": _number});
    }
    
    getNumber()
    {
        return this.arguments["number"];
    }
}

class HealthPercentageUpdated extends Message
{
    constructor(_percentage)
    {
        super("HealthPercentageUpdated", {"percentage": _percentage});
    }
    
    getPercentage()
    {
        return this.arguments["percentage"];
    }
}

class WildcardPicked extends Message
{
    constructor()
    {
        super("WildcardPicked");
    }
}

class WildcardShown extends Message
{
    constructor()
    {
        super("WildcardShown");
    }
}

class DogAnswerChosen extends Message
{
    constructor()
    {
        super("DogAnswerChosen");
    }
}