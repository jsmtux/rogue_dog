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
        /*var cardGUIContainer = new CardGuiElement(this.title, this.text, this.logoName);
        ServiceLocator.guiManager.createUI(cardGUIContainer);

        var spriteGroup = cardGUIContainer.rootElement.container.displayGroup;*/
        var spriteGroup = _game.add.group();
        _game.add.sprite(0, 0, 'cardbg', undefined, spriteGroup);
        _game.add.bitmapText(40, 40, 'comic', this.title, undefined, spriteGroup);
        _game.add.sprite(50, 90, this.logoName, undefined, spriteGroup);
        var description = _game.add.bitmapText(30, 285, 'comic', this.text, 16, spriteGroup);
        description.maxWidth = 220;
        
        var renderTexture = _game.add.renderTexture(280, 400, this.logoName + 'cardRT');
        
        renderTexture.renderXY(spriteGroup, 0, 0, true);
        
        spriteGroup.destroy();
        
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
        _arguments.player.addHeartNumber(4);
        ServiceLocator.publish(new EmitParticle(EmitParticle.Types.HealthIncrease));
    }
}
SmMedkitCard.ID = "SmMedkitCard";

class BasicEnemyCard extends Card
{
    constructor(_game)
    {
        super("Dirt monster", "Dirt monster has been awakened!\nFollowing its orders might save you", "basic_monster_icon", Card.Type.TRAP, _game);
    }
    
    apply(_arguments)
    {
        ServiceLocator.difficultyManager.unlockEnemy(BasicEnemy);
        var wildDeck = ServiceLocator.cardManager.wildDeck;
        wildDeck.addCard("StrongerBasicEnemyCard", 2);
        wildDeck.addCard("TwoEnemiesCard", 1, CardDeck.cardProbability.MED);
        wildDeck.addCard("BeeEnemyCard", 1, CardDeck.cardProbability.MED);
        wildDeck.addCard("OneStickCard", undefined, CardDeck.cardProbability.MED);
        wildDeck.addCard("ThreeSticksCard", undefined);
    }
}
BasicEnemyCard.ID = "BasicEnemyCard";

class BeeEnemyCard extends Card
{
    constructor(_game)
    {
        super("Bee monster", "Bee monster has been awakened!\nDraw a circle around the missile to disarm it", "bee_monster_icon", Card.Type.TRAP, _game);
    }
    
    apply(_arguments)
    {
        ServiceLocator.difficultyManager.unlockEnemy(BeeEnemy);
        var wildDeck = ServiceLocator.cardManager.wildDeck;
        wildDeck.addCard("OneStickCard", undefined, CardDeck.cardProbability.MED);
        wildDeck.addCard("ThreeSticksCard", undefined);
        wildDeck.addCard("StrongerBeeEnemyCard", 2);
        wildDeck.addCard("TwoEnemiesCard", 1, CardDeck.cardProbability.MED);
        wildDeck.addCard("BasicEnemyCard", 1, CardDeck.cardProbability.MED);
    }
}
BeeEnemyCard.ID = "BeeEnemyCard";

class OneStickCard extends Card
{
    constructor(_game)
    {
        super("One stick", "You found a stick!", "wood_logs_icon", Card.Type.ITEM, _game);
    }
    
    apply(_arguments)
    {
        var player = _arguments.player;
        player.updateStickNumber(player.stickNumber + 1);
    }
}
OneStickCard.ID = "OneStickCard";

class ThreeSticksCard extends Card
{
    constructor(_game)
    {
        super("Three sticks!", "You found 3 sticks!", "wood_logs_icon", Card.Type.ITEM, _game);
    }
    
    apply(_arguments)
    {
        var player = _arguments.player;
        player.updateStickNumber(player.stickNumber + 3);
    }
}
ThreeSticksCard.ID = "ThreeSticksCard";

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