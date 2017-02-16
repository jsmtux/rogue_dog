function Player()
{
    this.game;
    this.character;
    this.maxHealth = 40;
    this.maxShield = 15;//constant
    this.health = this.maxHealth;
    this.shield = 0;
    this.healthBar = new HealthBar();
    this.shieldBar = new ShieldBar();
    this.skillSelector = new SkillSelector();
    this.jumpHeight = 0;
    this.jumpAcceleration = 0;
    this.playerInitialY = GROUND_LEVEL - 225;
    this.dizzy = false;
}

Player.preload = function(_game)
{
    _game.load.spritesheet('pc', './img/playerSpritesheet.png', 160, 225);
    HealthBar.preload(_game);
    ShieldBar.preload(_game);
    SkillSelector.preload(_game);
}

Player.prototype.create = function(_game)
{
    this.game = _game;
    this.character = this.game.add.sprite(100, this.playerInitialY, 'pc', 10);
    this.character.animations.add('idle',[0]);
    this.character.animations.add('walk', [1,2,3,4]);
    this.character.animations.add('dizzy', [7,8]);
    this.character.animations.add('jump', [5]);
    this.character.animations.add('fall', [6]);
    ServiceLocator.infoManager.register("player", this.character);
    
    this.loadLogic(_game);
}

Player.prototype.loadLogic = function(_game)
{
    this.healthBar.create();
    this.shieldBar.create();
}

Player.prototype.updateAttack = function()
{
    this.skillSelector.update();
}

Player.prototype.updateWalk = function()
{
    var shouldPlay;
    if (this.onGround() && this.jumpAcceleration == 0)
    {
        shouldPlay = 'walk';
    }
    else
    {
        this.jumpHeight += this.jumpAcceleration;
        this.jumpAcceleration -= 0.3;
        if (this.jumpAcceleration > 0)
        {
            shouldPlay = 'jump';
        }
        else
        {
            shouldPlay = 'fall';
        }
        if (this.jumpHeight < 0)
        {
            this.jumpAcceleration = 0;
            this.jumpHeight = 0;
        }
        this.character.y = this.playerInitialY - this.jumpHeight;
    }
    if (!this.dizzy)
    {
        this.play(shouldPlay);
    }
    else
    {
        this.play('dizzy');
    }
}

Player.prototype.startWalk = function()
{
}

Player.prototype.finishWalk = function()
{
    this.play('idle');
}

Player.prototype.play = function(_animationName)
{
    this.character.play(_animationName, 10, true);
}

Player.prototype.updateHealthPercentage = function()
{
    this.healthBar.setPercentage(this.health / this.maxHealth);
}

Player.prototype.updateShieldPercentage = function()
{
    this.shieldBar.setPercentage(this.shield / this.maxShield);
}

Player.prototype.obstacleHit = function()
{
    this.dizzy = true;
    var self = this;
    setTimeout(function(){self.dizzy = false}, 500);
    this.health -= 5;
    this.updateHealthPercentage();
    if (this.jumpAcceleration > 0)
    {
        this.jumpAcceleration = 0;
    }
}

Player.prototype.monsterHit = function()
{
    this.play('dizzy');
    var percentage = 1;
    if (this.shield > 0)
    {
        percentage = (this.shield / this.maxShield) / 2 + 0.5;
        this.shield -= 1;
        this.updateShieldPercentage();
    }
    this.health -= 5 * percentage;
    this.updateHealthPercentage();
    var self = this;
    setTimeout(function(){
        self.play('idle');
    }, 500);
}

Player.prototype.addHealth = function(_points)
{
    this.health += _points;
    if (this.health > this.maxHealth)
    {
        this.health = this.maxHealth;
    }
    this.updateHealthPercentage();
}


//Shield categories: 2(wood) 3(iron) 4(gold)
//  on every use the shield diminishes by 1
//  percentage protected is sqrt(shield + 1)
Player.prototype.setShield = function(_category)
{
    this.shield = Math.pow(_category, 2) - 1;
    this.updateShieldPercentage();
}

Player.prototype.startAttack = function()
{
    this.skillSelector.create();
    this.skillSelector.sprite.x = 100;
    this.skillSelector.sprite.y = 270;
    var self = this;
    ServiceLocator.inputManager.leftButton.onDown.add(function handler(){
        console.log();
        if (this.skillSelector.getSuccess())
        {
            ServiceLocator.combatManager.hitFirstEnemy();
        }
        this.skillSelector.reset();
        ServiceLocator.inputManager.leftButton.onDown.remove(handler, self);
        
    }, self);
}

Player.prototype.isAttackFinished = function()
{
    return !this.skillSelector.isActive();
}

Player.prototype.jump = function()
{
    if (this.onGround())
    {
        this.jumpAcceleration = 8.5;
    }
}

Player.prototype.onGround = function()
{
    return this.jumpHeight == 0;
}

Player.prototype.getFeetArea = function()
{
    return [this.character.x + 45, this.character.x + 109];
}

function DogPlayer()
{
    Player.prototype.constructor.call(this);
    this.currentAnimation = '';
    this.playerInitialY = GROUND_LEVEL - 90;
}

DogPlayer.prototype = Object.create(Player.prototype);
DogPlayer.prototype.constructor = DogPlayer;

DogPlayer.preload = function(_game)
{
    var path = "anim/"
    _game.load.atlas("dogAnimAtlas", path + "dog.png", path + "dog.json");
    _game.load.json("dogJSON", path + "dog.scon");
}

DogPlayer.prototype.create = function(_game)
{
    this.game = _game;
    this.spriterGroup = loadSpriter(this.game, "dogJSON", "dogAnimAtlas", "entity_000");
    this.spriterGroup.position.setTo(140, this.playerInitialY);
    this.game.world.add(this.spriterGroup);
    
    var self = this;
    this.spriterGroup.events = {'onInputDown' : {
        'add' : function(func, context){
            self.spriterGroup.forEach(function(item) {
                item.events.onInputDown.add(func, context);
            })},
        'remove' : function(func, context){
            self.spriterGroup.forEach(function(item) {
                item.events.onInputDown.remove(func, context);
            })}
        }
    }
    
    this.spriterGroup.scale.set(0.3, 0.3);
    
    ServiceLocator.infoManager.register("player", this.spriterGroup);
    
    this.loadLogic(_game);
}

DogPlayer.prototype.updateAttack = function()
{
    this.skillSelector.update();
}

DogPlayer.prototype.updateWalk = function()
{
    var shouldPlay;
    if (this.onGround() && this.jumpAcceleration == 0)
    {
        shouldPlay = 'walk';
    }
    else
    {
        this.jumpHeight += this.jumpAcceleration;
        this.jumpAcceleration -= 0.3;
        if (this.jumpAcceleration > 0)
        {
            shouldPlay = 'jump';
        }
        else
        {
            shouldPlay = 'fall';
        }
        if (this.jumpHeight < 0)
        {
            this.jumpAcceleration = 0;
            this.jumpHeight = 0;
        }
        this.spriterGroup.y = this.playerInitialY - this.jumpHeight;
    }
    this.play(shouldPlay);
    /*if (!this.dizzy)
    {
        this.play(shouldPlay);
    }
    else
    {
        this.play('dizzy');
    }*/
}

DogPlayer.prototype.getFeetArea = function()
{
    return [this.spriterGroup.x - 40, this.spriterGroup.x + 109];
}

DogPlayer.prototype.startWalk = function()
{
    this.play("walk");
}

DogPlayer.prototype.finishWalk = function()
{
    this.play("idle");
}

DogPlayer.prototype.play = function(_animationName)
{
    if (this.currentAnimation != _animationName)
    {
        this.currentAnimation = _animationName;
        this.spriterGroup.animations.play(_animationName);
    }
}

function DogHatAccesory()
{
    this.name = "Magician hat"
    this.imageName = 'hat01';
}

DogHatAccesory.preload = function(_game)
{
    _game.load.video(this.imageName, './img/items/hat_icon.png');
}

DogHatAccesory.prototype.apply = function(_dogSprite)
{
    _dogSprite.pushCharMap("hat");
}

DogHatAccesory.prototype.remove = function(_dogSprite)
{
    _dogSprite.removeCharMap("hat");
}
