class Player
{
    constructor()
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
        
        this.walkSpeed = 6;
        this.curSpeed = 0;
    }
    
    static preload(_game)
    {
        _game.load.spritesheet('pc', './img/playerSpritesheet.png', 160, 225);
        HealthBar.preload(_game);
        ShieldBar.preload(_game);
        SkillSelector.preload(_game);
    }
    
    create(_game)
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
    
    loadLogic(_game)
    {
        this.healthBar.create();
        this.shieldBar.create();
    }
    
    updateAttack()
    {
        this.skillSelector.update();
    }
    
    updateWalk()
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
    
    startWalk()
    {
    }
    
    finishWalk()
    {
        this.play('idle');
    }
    
    play(_animationName)
    {
        this.character.play(_animationName, 10, true);
    }
    
    updateHealthPercentage()
    {
        this.healthBar.setPercentage(this.health / this.maxHealth);
    }
    
    updateShieldPercentage()
    {
        this.shieldBar.setPercentage(this.shield / this.maxShield);
    }
    
    obstacleHit()
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
    
    monsterHit()
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
    
    addHealth(_points)
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
    setShield(_category)
    {
        this.shield = Math.pow(_category, 2) - 1;
        this.updateShieldPercentage();
    }
    
    startAttack()
    {
        this.skillSelector.create();
        this.skillSelector.setPosition(100, 270);
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
    
    isAttackFinished()
    {
        return !this.skillSelector.isActive();
    }
    
    jump(_angle)
    {
        if (this.onGround())
        {
            this.jumpAcceleration = 8.5;
        }
    }
    
    onGround()
    {
        return this.jumpHeight == 0;
    }
    
    getFeetArea()
    {
        return [this.character.x + 45, this.character.x + 109];
    }
}

class DogPlayer extends Player
{
    constructor()
    {
        super();
        this.currentAnimation = '';
        this.playerInitialY = GROUND_LEVEL - 90;
        
        this.itemsList = [new DogHatAccesory(), new DogWoolHatAccesory()];
        this.appliedItems = [];
    }
    
    static preload(_game)
    {
        var path = "anim/"
        _game.load.atlas("dogAnimAtlas", path + "dog.png", path + "dog.json");
        _game.load.json("dogJSON", path + "dog.scon");
        
        DogHatAccesory.preload(_game);
        DogWoolHatAccesory.preload(_game);
    }
    
    create(_game)
    {
        this.game = _game;
        this.spriterGroup = loadSpriter(this.game, "dogJSON", "dogAnimAtlas", "entity_000");
        this.spriterGroup.position.setTo(0, this.playerInitialY);
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
        this.spriterGroup.pushCharMap("NoWool");
        
        ServiceLocator.infoManager.register("player", this.spriterGroup);
        
        this.loadLogic(_game);
    }
    
    updateAttack()
    {
        this.skillSelector.update();
    }
    
    updateWalk()
    {
        var shouldPlay;
        this.spriterGroup.x += this.curSpeed;
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
    
    getItemsList()
    {
        return this.itemsList;
    }
    
    getFeetArea()
    {
        return [this.spriterGroup.x - 40, this.spriterGroup.x + 109];
    }
    
    startWalk()
    {
        ServiceLocator.camera.setSpeed(this.walkSpeed);
        this.curSpeed = this.walkSpeed;
        this.play("walk");
    }
    
    finishWalk()
    {
        ServiceLocator.camera.setSpeed(0);
        this.curSpeed = 0;
        this.play("idle");
    }
    
    play(_animationName)
    {
        if (this.currentAnimation != _animationName)
        {
            this.currentAnimation = _animationName;
            this.spriterGroup.animations.play(_animationName);
        }
    }
    
    setAppliedItems(_items)
    {
        for (var itemInd in this.appliedItems)
        {
            this.appliedItems[itemInd].remove(this.spriterGroup);
        }
        this.appliedItems = [];
        for(var itemInd in _items)
        {
            this.appliedItems.push(_items[itemInd]);
           _items[itemInd].apply(this.game.player.spriterGroup)
        }
    }
}

class Accesory
{
    getName()
    {
        return this.name;
    }
    
    getImageName()
    {
        return this.imageName;
    }
    
    getRestriction()
    {
        return this.restriction;
    }
}

Accesory.Restrictions = {
    HEAD: 0,
    NECK: 1,
    FEET: 2
}

class DogHatAccesory extends Accesory
{
    constructor()
    {
        super();
        this.name = "Magician hat";
        this.imageName = 'hat01';
        this.restriction = Accesory.Restrictions.HEAD;
    }
    
    static preload(_game)
    {
        _game.load.image('hat01', './img/items/hat_icon.png');
    }
    
    apply(_dogSprite)
    {
        _dogSprite.pushCharMap("hat");
    }
    
    remove(_dogSprite)
    {
        _dogSprite.removeCharMap("hat");
    }
}

class DogWoolHatAccesory extends Accesory
{
    constructor()
    {
        super();
        this.name = "Wool hat";
        this.imageName = 'hat02';
        this.restriction = Accesory.Restrictions.HEAD;
    }
    
    static preload(_game)
    {
        //_game.load.image('hat01', './img/items/hat_icon.png');
    }
    
    apply(_dogSprite)
    {
        _dogSprite.removeCharMap("NoWool");
    }
    
    remove(_dogSprite)
    {
        _dogSprite.pushCharMap("NoWool");
    }
}
