class Card
{
    constructor(_title, _text, _logoName)
    {
        this.sprite;
        this.title = _title;
        this.text = _text;
        this.logoName = _logoName;
        
        this.handlerFunction;
        this.handlerContext;
        
        
        this.position = new Phaser.Point(0,0);
        
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
        var cardGUIContainer = ServiceLocator.guiManager.getCardUI(this.title, this.text, this.logoName);
        cardGUIContainer.show();

        var spriteGroup = cardGUIContainer.guiContainer.phaserGroup;
        
        var renderTexture = _game.add.renderTexture(280, 400, this.logoName + 'cardRT');
        
        renderTexture.renderXY(spriteGroup, 0, 0, true);
        
        cardGUIContainer.destroy();
        
        return renderTexture;
    }
    
    create(_game)
    {
        this.frontImage = ServiceLocator.cardManager.getCardImage(this);
        this.sprite = _game.add.sprite(0, 0, this.frontImage);
        ServiceLocator.guiManager.addToUI(this.sprite);
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
        this.setPosition(this.position);
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
        this.position = _position;
        this.sprite.x = _position.x - 0.5 * 280 * Math.cos(this.yRotAngle);
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
}

class SmMedkitCard extends Card
{
    constructor(_game)
    {
        super("Small health", "Receive 25 health ptsReceive 25 health ptsReceive 25 health pts", "heart_icon", _game);
    }
    
    apply(_arguments)
    {
        _arguments.player.addHealth(5);
    }
}
SmMedkitCard.ID = "SmMedkitCard";

class SmEnergyCard extends Card
{
    constructor(_game)
    {
        super("Small Crystal", "Small energy increase", "small_energy_icon", _game);
    }
    
    apply(_arguments)
    {
        _arguments.player.addEnergy(2);
    }
}
SmEnergyCard.ID = "SmEnergyCard";

class MedEnergyCard extends Card
{
    constructor(_game)
    {
        super("Med. Crystal", "Medium energy increase", "medium_energy_icon", _game);
    }
    
    apply(_arguments)
    {
        _arguments.player.addEnergy(5);
    }
}
MedEnergyCard.ID = "MedEnergyCard";

class BigEnergyCard extends Card
{
    constructor(_game)
    {
        super("Big Crystal", "Big energy increase", "big_energy_icon", _game);
    }
    
    apply(_arguments)
    {
        _arguments.player.addEnergy(10);
    }
}
BigEnergyCard.ID = "BigEnergyCard";

class NewEnemyCard extends Card
{
    constructor(_game)
    {
        super("Shiny Pig", "A new type of enemy will appear!", "new_enemy_icon", _game);
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
        super("Wood Wood Wood", "You'll probably find more obstacles along your way!", "wood_logs_icon", _game);
    }
    
    apply(_arguments)
    {
        ServiceLocator.difficultyManager.increaseObstacleNumber();
    }
}
MoreObstaclesCard.ID = "MoreObstaclesCard";

class StrongerEnemyCard extends Card
{
    constructor(_game)
    {
        super("Ancient Mask", "Enemies will be stronger!", "stronger_enemy_icon", _game);
    }
    
    apply(_arguments)
    {
        //Should be making enemies stronger
    }
}
StrongerEnemyCard.ID = "StrongerEnemyCard"

class NewObstacleCard extends Card
{
    constructor(_game)
    {
        super("Stupid Map", "New obstacles may appear!", "new_obstacle_icon", _game);
    }
    
    apply(_arguments)
    {
        //Should be making enemies stronger
    }
}
StrongerEnemyCard.ID = "StrongerEnemyCard"

class TwoEnemiesCard extends Card
{
    constructor(_game)
    {
        super("Let's Hang Out", "You will find multiple enemies in combat!", "enemy_friend_icon", _game);
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
        super("Three's a crowd", "You will find up to three enemies in combat!", "enemy_friends_icon", _game);
    }
    
    apply(_arguments)
    {
        ServiceLocator.difficultyManager.setNumberOfEnemies(3);
    }
}
ThreeEnemiesCard.ID = "ThreeEnemiesCard"