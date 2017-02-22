class DogPlayer
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
        this.jumpHeight = 0;
        this.jumpAcceleration = new Phaser.Point(0, 0);
        this.dizzy = false;
        
        this.jumpStrenght = 9.0;
        
        this.walkSpeed = 6;
        this.curSpeed = 0;
        
        this.attackFinished = false;
        
        this.currentAnimation = '';
        this.playerInitialY = GROUND_LEVEL - 90;
        
        this.itemsList = [new DogHatAccesory(), new DogWoolHatAccesory()];
        this.appliedItems = [];
    }
    
    static preload(_game)
    {
        HealthBar.preload(_game);
        ShieldBar.preload(_game);
        SkillSelector.preload(_game);

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
        
        this.healthBar.create();
        this.shieldBar.create();
    }
    
    updateWalk()
    {
        var shouldPlay;
        this.spriterGroup.x += this.curSpeed + this.jumpAcceleration.x;
        if (this.onGround() && this.jumpAcceleration.y == 0)
        {
            shouldPlay = 'walk';
            this.jumpAcceleration.x = 0;
        }
        else
        {
            this.jumpHeight += this.jumpAcceleration.y;
            this.jumpAcceleration.y -= 0.3;
            if (this.jumpAcceleration.y > 0)
            {
                shouldPlay = 'jump';
            }
            else
            {
                shouldPlay = 'fall';
            }
            if (this.jumpHeight < 0)
            {
                this.jumpAcceleration.y = 0;
                this.jumpHeight = 0;
            }
            this.spriterGroup.y = this.playerInitialY - this.jumpHeight;
        }
        this.play(shouldPlay);
    }
    
    startWalk()
    {
        ServiceLocator.inputManager.directionGesture.add(this.jump, this);
        this.curSpeed = this.walkSpeed;
        this.play("walk");
    }
    
    finishWalk()
    {
        ServiceLocator.inputManager.directionGesture.remove(this.jump, this);
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
        if (this.jumpAcceleration.y > 0)
        {
            this.jumpAcceleration.y = 0;
        }
    }
    
    monsterHit()
    {
        ServiceLocator.camera.shake(0.02, 200);
        ServiceLocator.camera.flash(0xff0000, 200);
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
        ServiceLocator.inputManager.skillSelector.add(this.skillCallback, this);
        ServiceLocator.inputManager.skillSelector.setPosition(100, 270);
        this.attackFinished = false;
    }
    
    skillCallback(_success)
    {
        if (_success)
        {
            ServiceLocator.combatManager.hitFirstEnemy();
        }
        ServiceLocator.inputManager.skillSelector.remove(this.skillCallback, this);
        this.attackFinished = true;
    }
    
    isAttackFinished()
    {
        return this.attackFinished;
    }
    
    jump(_direction, _angle)
    {
        console.log(_angle);
        if (_angle < 270)
        {
            return;
        }
        if (this.onGround())
        {
            this.jumpAcceleration.y = this.jumpStrenght * -Math.sin(Math.radians(_angle));
            this.jumpAcceleration.x = this.jumpStrenght * Math.cos(Math.radians(_angle));
        }
    }
    
    onGround()
    {
        return this.jumpHeight == 0;
    }
    
    getItemsList()
    {
        return this.itemsList;
    }
    
    getFeetArea()
    {
        return [this.spriterGroup.x - 40, this.spriterGroup.x + 109];
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
