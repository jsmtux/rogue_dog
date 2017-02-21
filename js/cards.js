class Card
{
    constructor()
    {
        this.sprite;
    }
    
    apply()
    {
        
    }
    
    clicked()
    {
        this.apply();
        this.sprite.events.onInputDown.remove(this.clicked, this);
        ServiceLocator.combatManager.finishLootChoose();
    }
}

class SmMedkitCard extends Card
{
    constructor(_player, _game)
    {
        super();
        this.player = _player;
        this.game = _game;
    }
    
    static preload(_game)
    {
        _game.load.image('SmMedkitCard_img', './img/card/sm_medkit_card.png');
    }
    
    apply()
    {
        this.player.addHealth(5);
    }
    
    show(index)
    {
        this.sprite = this.game.add.sprite(50 + 300 * index,50, 'SmMedkitCard_img');
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clicked, this);
    }
    
    hide()
    {
        this.sprite.destroy();
    }
}

class WoodShieldCard extends Card
{
    constructor(_player, _game)
    {
        super();
        this.player = _player;
        this.game = _game;
    }
    
    static preload(_game)
    {
        _game.load.image('WoodShieldCard_img', './img/card/wood_shield_card.png');
    }
    
    apply()
    {
        this.player.setShield(2);
    }
    
    show(index)
    {
        this.sprite = this.game.add.sprite(50 + 300 * index,50, 'WoodShieldCard_img');
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clicked, this);
    }
    
    hide()
    {
        this.sprite.destroy();
    }
}

class IronShieldCard extends Card
{
    constructor(_player, _game)
    {
        super();
        this.player = _player;
        this.game = _game;
    }
    
    static preload(_game)
    {
        _game.load.image('IronShieldCard_img', './img/card/iron_shield_card.png');
    }
    
    apply()
    {
        this.player.setShield(2);
    }
    
    show(index)
    {
        this.sprite = this.game.add.sprite(50 + 300 * index,50, 'IronShieldCard_img');
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clicked, this);
    }
    
    hide()
    {
        this.sprite.destroy();
    }
}