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
        var image = ServiceLocator.cardManager.getCardImage(this);
        this.sprite = _game.add.sprite(0, 0, image);
        ServiceLocator.guiManager.addToUI(this.sprite);
    }
    
    show()
    {
        this.sprite.visible = true;
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clickHandler, this);
    }
    
    hide()
    {
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
        this.handlerFunction.call(this.handlerContext);
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
}

class SmMedkitCard extends Card
{
    constructor(_game)
    {
        super("Small health", "Receive 25 health ptsReceive 25 health ptsReceive 25 health pts", "heart_icon", _game);
    }
    
    apply()
    {
        this.player.addHealth(5);
    }
    
    hide()
    {
        this.sprite.destroy();
    }
}
SmMedkitCard.ID = "SmMedkitCard";

class WoodShieldCard extends Card
{
    constructor(_game)
    {
        super("Small shield", "Attacks don't hurt as much", "wooden_shield_icon", _game);
    }
    
    apply()
    {
        this.player.setShield(2);
    }
    
    hide()
    {
        this.sprite.destroy();
    }
}
WoodShieldCard.ID = "WoodShieldCard";

class SmEnergyCard extends Card
{
    constructor(_game)
    {
        super("Small Crystal", "Small energy increase", "small_energy_icon", _game);
    }
    
    apply()
    {
        this.player.setShield(2);
    }
    
    hide()
    {
        this.sprite.destroy();
    }
}
SmEnergyCard.ID = "SmEnergyCard";

class MedEnergyCard extends Card
{
    constructor(_game)
    {
        super("Med. Crystal", "Medium energy increase", "medium_energy_icon", _game);
    }
    
    apply()
    {
        this.player.setShield(2);
    }
    
    hide()
    {
        this.sprite.destroy();
    }
}
MedEnergyCard.ID = "MedEnergyCard";

class BigEnergyCard extends Card
{
    constructor(_game)
    {
        super("Big Crystal", "Big energy increase", "big_energy_icon", _game);
    }
    
    apply()
    {
        this.player.setShield(2);
    }
    
    hide()
    {
        this.sprite.destroy();
    }
}
BigEnergyCard.ID = "BigEnergyCard";