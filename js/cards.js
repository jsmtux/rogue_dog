function Card()
{
    this.sprite;
}

Card.prototype.apply = function()
{
    
}

Card.prototype.clicked = function()
{
    this.apply();
    this.sprite.events.onInputDown.remove(this.clicked, this);
    ServiceLocator.combatManager.finishLootChoose();
}

function SmMedkitCard(_player, _game)
{
    Card.prototype.constructor.call(this);
    this.player = _player;
    this.game = _game;
}

SmMedkitCard.prototype = new Card();
SmMedkitCard.prototype.constructor = SmMedkitCard;

SmMedkitCard.preload = function(_game)
{
    _game.load.image('SmMedkitCard_img', './img/card/sm_medkit_card.png');
}

SmMedkitCard.prototype.apply = function()
{
    this.player.addHealth(5);
}

SmMedkitCard.prototype.show = function(index)
{
    this.sprite = this.game.add.sprite(50 + 300 * index,50, 'SmMedkitCard_img');
    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(this.clicked, this);
}

SmMedkitCard.prototype.hide = function()
{
    this.sprite.destroy();
}

function WoodShieldCard(_player, _game)
{
    Card.prototype.constructor.call(this);
    this.player = _player;
    this.game = _game;
}

WoodShieldCard.prototype = new Card();
WoodShieldCard.prototype.constructor = WoodShieldCard;

WoodShieldCard.preload = function(_game)
{
    _game.load.image('WoodShieldCard_img', './img/card/wood_shield_card.png');
}

WoodShieldCard.prototype.apply = function()
{
    this.player.setShield(2);
}

WoodShieldCard.prototype.show = function(index)
{
    this.sprite = this.game.add.sprite(50 + 300 * index,50, 'WoodShieldCard_img');
    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(this.clicked, this);
}

WoodShieldCard.prototype.hide = function()
{
    this.sprite.destroy();
}

function IronShieldCard(_player, _game)
{
    Card.prototype.constructor.call(this);
    this.player = _player;
    this.game = _game;
}

IronShieldCard.prototype = new Card();
IronShieldCard.prototype.constructor = IronShieldCard;

IronShieldCard.preload = function(_game)
{
    _game.load.image('IronShieldCard_img', './img/card/iron_shield_card.png');
}

IronShieldCard.prototype.apply = function()
{
    this.player.setShield(2);
}

IronShieldCard.prototype.show = function(index)
{
    this.sprite = this.game.add.sprite(50 + 300 * index,50, 'IronShieldCard_img');
    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(this.clicked, this);
}

IronShieldCard.prototype.hide = function()
{
    this.sprite.destroy();
}