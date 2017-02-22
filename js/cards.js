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
    
    show(_index)
    {
        this.sprite = this.game.add.sprite(50 + 300 * _index,50, this.imageName);
        ServiceLocator.guiManager.addToUI(this.sprite);
        this.sprite.inputEnabled = true;
        this.sprite.events.onInputDown.add(this.clicked, this);
    }
}

class SmMedkitCard extends Card
{
    constructor(_player, _game)
    {
        super();
        this.player = _player;
        this.game = _game;
        this.imageName = 'SmMedkitCard_img';
    }
    
    static preload(_game)
    {
        _game.load.image('SmMedkitCard_img', './img/card/sm_medkit_card.png');
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

class WoodShieldCard extends Card
{
    constructor(_player, _game)
    {
        super();
        this.player = _player;
        this.game = _game;
        this.imageName = 'WoodShieldCard_img';
    }
    
    static preload(_game)
    {
        _game.load.image('WoodShieldCard_img', './img/card/wood_shield_card.png');
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

class IronShieldCard extends Card
{
    constructor(_player, _game)
    {
        super();
        this.player = _player;
        this.game = _game;
        this.imageName = 'IronShieldCard_img';
    }
    
    static preload(_game)
    {
        _game.load.image('IronShieldCard_img', './img/card/iron_shield_card.png');
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