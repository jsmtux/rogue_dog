class DogPlayer extends GameObject
{
    constructor()
    {
        super();
        this.game;
        this.character;
        this.maxHealth = 40;
        this.health = this.maxHealth;
        this.maxEnergy = 40;
        this.energy = 0;
        this.healthBar = new HealthBar();
        this.energyBar = new EnergyBar();
        this.jumpAcceleration = new Phaser.Point(0, 0);
        this.dizzy = false;
        
        this.jumpStrenght = 10.5;
        
        this.walkSpeed = 6;
        this.curSpeed = 0;
        
        this.attackFinished = false;
        
        this.currentAnimation = '';
        this.playerInitialY = GROUND_LEVEL - 90;
        
        this.itemsList = [new DogHatAccesory(), new DogWoolHatAccesory()];
        this.appliedItems = [];
        
        this.ownLight;
    }
    
    static preload(_game)
    {
        HealthBar.preload(_game);
        EnergyBar.preload(_game);
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
        var sprite = loadSpriter(this.game, "dogJSON", "dogAnimAtlas", "entity_000");
        super.create(sprite, true);
        ServiceLocator.renderer.addToScene(this.sprite);
        this.sprite.position.setTo(0, this.playerInitialY);
        
        var self = this;
        this.sprite.events = {'onInputDown' : {
            'add' : function(func, context){
                self.sprite.forEach(function(item) {
                    item.events.onInputDown.add(func, context);
                })},
            'remove' : function(func, context){
                self.sprite.forEach(function(item) {
                    item.events.onInputDown.remove(func, context);
                })}
            },
            'onRemovedFromGroup$dispatch' : function(){
            }
        }
        
        this.sprite.scale.set(0.3, 0.3);
        this.sprite.pushCharMap("NoWool");
        
        ServiceLocator.infoManager.register("player", this.sprite);
        
        this.healthBar.create();
        this.energyBar.create();
        
        this.ownLight = new spotLight(new Phaser.Point(this.sprite.x + 25, this.sprite.y), 250, 0xFFFF00, 0.5);
        ServiceLocator.lighting.addLight(this.ownLight);
    }
    
    updateWalk()
    {
        var shouldPlay;
        this.sprite.x += this.curSpeed + this.jumpAcceleration.x;
        this.ownLight.position = new Phaser.Point(this.sprite.x + 100, this.sprite.y - 25);

        if (this.onGround() && this.jumpAcceleration.y == 0)
        {
            shouldPlay = 'walk';
            this.jumpAcceleration.x = 0;
        }
        else
        {
            this.sprite.y -= this.jumpAcceleration.y;
            this.jumpAcceleration.y -= 0.3;
            if (this.jumpAcceleration.y > 0)
            {
                shouldPlay = 'jump';
            }
            else
            {
                shouldPlay = 'fall';
            }
            var groundLevel = this.getGroundLevel();
            if (groundLevel)
            {
                this.jumpAcceleration.y = 0;
                this.sprite.y = groundLevel;
            }
        }
        this.play(shouldPlay);
        
        if (this.isUnderground())
        {
            this.subtractEnergy(0.01);
        }
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
            this.sprite.animations.play(_animationName);
        }
    }
    
    updateHealthPercentage()
    {
        this.healthBar.setPercentage(this.health / this.maxHealth);
    }
    
    updateEnergyPercentage()
    {
        this.energyBar.setPercentage(this.energy / this.maxEnergy);
    }
    
    obstacleHit()
    {
        this.dizzy = true;
        var self = this;
        setTimeout(function(){self.dizzy = false}, 500);
        this.subtractHealth(5)
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
        this.subtractHealth(5 * percentage);
        var self = this;
        setTimeout(function(){
            self.play('idle');
        }, 500);
    }
    
    subtractHealth(_amount)
    {
        this.health -= _amount;
        this.updateHealthPercentage();
        if (this.health <= 0)
        {
            this.game.die();
        }
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
    
    subtractHealth(_amount)
    {
        this.health -= _amount;
        this.updateHealthPercentage();
        if (this.health <= 0)
        {
            this.game.die();
        }
    }
    
    addEnergy(_points)
    {
        this.energy += _points;
        if (this.energy > this.maxEnergy)
        {
            this.energy = this.maxEnergy;
        }
        this.updateEnergyPercentage();
    }
    
    subtractEnergy(_amount)
    {
        this.energy -= _amount;
        this.updateEnergyPercentage();
        if (this.energy <= 0)
        {
            this.game.die();
        }
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
    
    enemyKilledNotification(_enemy)
    {
    }
    
    jump(_direction, _angle)
    {
        if (_angle < 45)
        {
            _angle = 340;
        }
        else if (_angle < 270)
        {
            _angle = 270;
        }
        else if (_angle > 340)
        {
            _angle = 340;
        }
        if (this.onGround())
        {
            this.jumpAcceleration.y = this.jumpStrenght * -Math.sin(Math.radians(_angle));
            this.jumpAcceleration.x = this.jumpStrenght * Math.cos(Math.radians(_angle));
        }
    }
    
    getGroundLevel()
    {
        var ret = undefined;
        
        var groundTiles = ServiceLocator.walkManager.getGroundTiles(this.sprite.x);
        
        for (var ind in groundTiles)
        {
            var offset = Math.abs(this.jumpAcceleration.y);
            var height = groundTiles[ind].getTopPosition();
            if (this.sprite.y >= height - offset && this.sprite.y <= height + offset)
            {
                ret = height;
                ServiceLocator.walkManager.setCurrentWalkLevel(groundTiles[ind].getWalkLevel());
                break;
            }
        }
        
        return ret;        
    }
    
    onGround()
    {
        return this.getGroundLevel() !== undefined;
    }
    
    getItemsList()
    {
        return this.itemsList;
    }
    
    getFeetArea()
    {
        return [this.sprite.x - 40, this.sprite.x + 109];
    }
    
    setAppliedItems(_items)
    {
        for (var itemInd in this.appliedItems)
        {
            this.appliedItems[itemInd].remove(this.sprite);
        }
        this.appliedItems = [];
        for(var itemInd in _items)
        {
            this.appliedItems.push(_items[itemInd]);
           _items[itemInd].apply(this.game.player.sprite)
        }
    }
    
    getHitAreaBottom()
    {
        var bottomHeight = 75;
        return this.sprite.y - bottomHeight;
    }
    
    isUnderground()
    {
        return this.sprite.y > (GROUND_LEVEL);
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
