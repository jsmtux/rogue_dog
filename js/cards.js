class Card
{
    constructor(_title, _text, _logoName)
    {
        this.cardGUIContainer = undefined;
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
    
    show()
    {
        if (!this.cardGUIContainer)
        {
            this.cardGUIContainer = ServiceLocator.guiManager.getCardImage(this.title, this.text, this.logoName);
        }
        this.cardGUIContainer.show();
        
        var spriteGroup = this.cardGUIContainer.guiContainer.phaserGroup;
        spriteGroup.inputEnabled = true;
        spriteGroup.events.onInputDown.add(this.clickHandler, this);
    }
    
    hide()
    {
        this.cardGUIContainer.hide();
        spriteGroup.inputEnabled = false;
        spriteGroup.events.onInputDown.remove(this.clickHandler, this);
    }
    
    setPosition(_position)
    {
        this.cardGUIContainer.setPosition(_position);
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
}

class SmMedkitCard extends Card
{
    constructor()
    {
        super("Small health", "Receive 25 health ptsReceive 25 health ptsReceive 25 health pts", "heart_icon");
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
    constructor()
    {
        super("Small shield", "Attacks don't hurt as much", "wooden_shield_icon");
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