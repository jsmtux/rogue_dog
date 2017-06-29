class Card
{
    constructor(_title, _text, _logoName, _cardType)
    {
        this.sprite;
        this.title = _title;
        this.text = _text;
        this.logoName = _logoName;
        
        this.cardType = _cardType;
        
        this.handlerFunction;
        this.handlerContext;
        
        this.yRotAngle = 0.0;
        this.yDesiredAngle = undefined;
        this.flipCb;
        this.flipCbCtxt;
    }
    
    preload(_game)
    {
        _game.load.image(this.logoName, './img/card/' + this.logoName + '.png');
    }
    
    buildImage(_game)
    {
        var cardGUIContainer = new CardGuiElement(this.title, this.text, this.logoName);
        ServiceLocator.guiManager.createUI(cardGUIContainer);

        var spriteGroup = cardGUIContainer.rootElement.container.displayGroup;
        
        var renderTexture = _game.add.renderTexture(280, 400, this.logoName + 'cardRT');
        
        renderTexture.renderXY(spriteGroup, 0, 0, true);
        
        cardGUIContainer.destroy();
        
        return renderTexture;
    }
    
    create(_game)
    {
        this.frontImage = ServiceLocator.cardManager.getCardImage(this);
        this.sprite = _game.add.sprite(0, 0, this.frontImage);
        ServiceLocator.renderer.addToUI(this.sprite);
        this.sprite.anchor.x = 0.5;
        this.game = _game;
    }
    
    show()
    {
        this.sprite.visible = true;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clickHandler, this);
        
        this.game.updateSignal.add(this.update, this);
    }
    
    update()
    {
        if (this.yDesiredAngle === undefined)
        {
            return;
        }

        if (this.yRotAngle > this.yDesiredAngle)
        {
            this.callFlipCb();
            this.yRotAngle = this.yDesiredAngle;
            this.yDesiredAngle = undefined;
        }
        else
        {
            this.setYAngle(this.yRotAngle + 0.05);
        }
    }
    
    setYAngle(_angle)
    {
        this.yRotAngle = _angle;
        this.sprite.scale.x = Math.cos(this.yRotAngle);
        if (this.sprite.scale.x < 0)
        {
            this.sprite.loadTexture('cardBack');
        }
        else
        {
            this.sprite.loadTexture(this.frontImage);
        }
    }
    
    flip(_cb, _cbCtxt)
    {
        this.flipCb = _cb;
        this.flipCbCtxt = _cbCtxt;
        if (this.yRotAngle == 0)
        {
            this.yDesiredAngle = Math.PI;
        }
        if (this.yRotAngle == Math.PI)
        {
            this.yRotAngle = -Math.PI;
            this.yDesiredAngle = 0;
        }
    }
    
    callFlipCb()
    {
        if (this.flipCb === undefined)
        {
            return;
        }
        this.flipCb.call(this.flipCbCtxt, this);
        this.flipCb = undefined;
        this.flipCbCtxt = undefined;
    }
    
    hide()
    {
        this.game.updateSignal.remove(this.update, this);
        this.sprite.visible = false;
        this.sprite.inputEnabled = false;
        this.sprite.events.onInputDown.remove(this.clickHandler, this);
    }
    
    setPosition(_position)
    {
        this.sprite.x = _position.x;
        this.sprite.y = _position.y;
    }
    
    clickHandler()
    {
        this.handlerFunction.call(this.handlerContext, this);
    }
    
    setHandler(_fun, _ctxt)
    {
        this.handlerFunction = _fun;
        this.handlerContext = _ctxt;
    }
    
    getID()
    {
        return this.constructor.ID;
    }
    
    destroy()
    {
        this.sprite.destroy();
    }
    
    hide()
    {
        this.destroy();
    }
    
    getType()
    {
        return this.cardType;
    }
}

Card.Type = {
    'ITEM': 0,
    'TRAP': 1,
    'GEAR': 2
}

class SmMedkitCard extends Card
{
    constructor(_game)
    {
        super("Small cake", "A bit of health", "small_cake_icon", Card.Type.ITEM, _game);
    }
    
    apply(_arguments)
    {
        _arguments.player.addHealth(5);
        ServiceLocator.publish(new EmitParticle(EmitParticle.Types.HealthIncrease));
    }
}
SmMedkitCard.ID = "SmMedkitCard";

class NewEnemyCard extends Card
{
    constructor(_game)
    {
        super("Shiny Pig", "A new type of enemy will appear!", "new_enemy_icon", Card.Type.TRAP, _game);
    }
    
    apply(_arguments)
    {
        ServiceLocator.difficultyManager.unlockEnemy();
    }
}
NewEnemyCard.ID = "NewEnemyCard";

class MoreObstaclesCard extends Card
{
    constructor(_game)
    {
        super("Wood Wood Wood", "You'll probably find more obstacles along your way!", "wood_logs_icon", Card.Type.TRAP, _game);
    }
    
    apply(_arguments)
    {
        ServiceLocator.difficultyManager.increaseObstacleNumber();
    }
}
MoreObstaclesCard.ID = "MoreObstaclesCard";

class StrongerBasicEnemyCard extends Card
{
    constructor(_game)
    {
        super("Ancient Mask", "BasicEnemy will be stronger!", "stronger_enemy_icon", Card.Type.TRAP, _game);
    }
    
    apply(_arguments)
    {
        ServiceLocator.difficultyManager.increaseEnemyDifficulty("BasicEnemy");
    }
}
StrongerBasicEnemyCard.ID = "StrongerBasicEnemyCard"

class StrongerBeeEnemyCard extends Card
{
    constructor(_game)
    {
        super("Ancient Mask", "BeeEnemy will be stronger!", "stronger_enemy_icon", Card.Type.TRAP, _game);
    }
    
    apply(_arguments)
    {
        ServiceLocator.difficultyManager.increaseEnemyDifficulty("BeeEnemy");
    }
}
StrongerBeeEnemyCard.ID = "StrongerBeeEnemyCard"

class NewObstacleCard extends Card
{
    constructor(_game)
    {
        super("Stupid Map", "Harder obstacles may appear!", "new_obstacle_icon", Card.Type.TRAP, _game);
    }
    
    apply(_arguments)
    {
        ServiceLocator.difficultyManager.increaseObstacleLevel();
    }
}
NewObstacleCard.ID = "NewObstacleCard"

class TwoEnemiesCard extends Card
{
    constructor(_game)
    {
        super("Let's Hang Out", "You will find multiple enemies in combat!", "enemy_friend_icon", Card.Type.TRAP, _game);
    }
    
    apply(_arguments)
    {
        ServiceLocator.difficultyManager.setNumberOfEnemies(2);
    }
}
TwoEnemiesCard.ID = "TwoEnemiesCard"

class ThreeEnemiesCard extends Card
{
    constructor(_game)
    {
        super("Three's a crowd", "You will find up to three enemies in combat!", "enemy_friends_icon", Card.Type.TRAP, _game);
    }
    
    apply(_arguments)
    {
        ServiceLocator.difficultyManager.setNumberOfEnemies(3);
    }
}
ThreeEnemiesCard.ID = "ThreeEnemiesCard"

class MagicianHatCard extends Card
{
    constructor(_game)
    {
        super("Magician's hat", "Sometimes you'll get a stick if you defend correctly!", "tophat_gear_icon", Card.Type.GEAR, _game);
    }
    
    apply(_arguments)
    {
        var player = _arguments.player;
        player.addItem(DogHatAccesory);
    }
}
MagicianHatCard.ID = "MagicianHatCard"