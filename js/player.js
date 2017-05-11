class DogPlayer extends GameObject
{
    constructor()
    {
        super();
        this.game;
        this.character;
        this.maxHealth = 40;
        this.health = this.maxHealth;
        this.maxEnergy = 20;
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
        
        this.appliedItems = [];
        
        this.ownLight;
        
        this.cardPieceUI = new CardPieceUI();
        
        this.attackPower = 4.0;
    }
    
    static preload(_game)
    {
        HealthBar.preload(_game);
        EnergyBar.preload(_game);
        SkillSelector.preload(_game);

        var path = "anim/"
        _game.load.atlas("dogAnimAtlas", path + "dog.png", path + "dog.json");
        _game.load.json("dogJSON", path + "dog.scon");
        
        _game.load.audio('playerAttackAudio', 'sounds/player_attack.wav');
        _game.load.audio('playerJumpAudio', 'sounds/player_jump.wav');
        _game.load.audio('playerLandAudio', 'sounds/player_land.wav');
        _game.load.audio('playerStepAudio', 'sounds/player_step.wav');

        DogHatAccesory.preload(_game);
        DogWoolHatAccesory.preload(_game);
        CardPieceUI.preload(_game);
    }
    
    create(_game)
    {
        this.game = _game;
        var sprite = loadSpriter(this.game, "dogJSON", "dogAnimAtlas", "entity_000");
        super.create(sprite, true);
        ServiceLocator.renderer.addToScene(this.sprite);
        this.sprite.position.setTo(0, this.playerInitialY);
        this.sprite.onEvent.add(this.playStepSound, this);
        
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
        
        this.sprite.pushCharMap("NoWool");
        
        this.healthBar.create();
        this.energyBar.create();
        
        this.cardPieceUI.create(this.game);
        ServiceLocator.registerListener(this.cardPiecePicked, this, "CardPieceFoundMessage");
        ServiceLocator.registerListener(this.gearCardCompleted, this, "GearCardCompletedMessage");
        
        this.ownLight = new spotLight(new Phaser.Point(this.sprite.x + 25, this.sprite.y), 250, 0xFFFF00, 0.5);
        ServiceLocator.lighting.addLight(this.ownLight);
        
        this.attackAudio = this.game.add.audio('playerAttackAudio');
        this.jumpAudio = this.game.add.audio('playerJumpAudio');
        this.landAudio = this.game.add.audio('playerLandAudio');
        this.landAudio.volume = 0.25;
        this.stepAudio = this.game.add.audio('playerStepAudio');
        this.stepAudio.volume = 0.25;
    }
    
    updateWalk()
    {
        var shouldPlay;
        this.sprite.x += this.curSpeed + this.jumpAcceleration.x;
        this.ownLight.position = new Phaser.Point(this.sprite.x + 100, this.sprite.y - 25);

        if (this.onGround() && this.jumpAcceleration.y === 0)
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
                this.landAudio.play();
                ServiceLocator.publish(new EmitParticle(EmitParticle.Types.GrassLand, new Phaser.Point(this.sprite.x - 150, this.sprite.y + 90)));
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
        ServiceLocator.inputManager.playerDirectionGesture.add(this.jump, this);
        ServiceLocator.registerListener(this.obstacleHit, this, "JumpFailedMessage");
        this.curSpeed = this.walkSpeed;
        this.play("walk");
    }
    
    finishWalk()
    {
        ServiceLocator.inputManager.playerDirectionGesture.remove(this.jump, this);
        ServiceLocator.removeListener(this.obstacleHit, this, "JumpFailedMessage");
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
    
    playStepSound()
    {
        this.stepAudio.play();
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
            this.subtractHealth(0.1);
        }
    }
    
    startAttack()
    {
        ServiceLocator.inputManager.skillSelector.add();
        ServiceLocator.registerListener(this.skillCallback, this, "SkillSelectorResultMessage");
        ServiceLocator.inputManager.skillSelector.setPosition(this.sprite.x - 100, this.sprite.y - 140);
        this.attackFinished = false;
    }
    
    skillCallback(_message)
    {
        var hitPercentage = _message.getHitPercentage();
        if (hitPercentage)
        {
            ServiceLocator.combatManager.hitFirstEnemy(hitPercentage, this.attackPower);
            this.attackAudio.volume = hitPercentage;
            this.attackAudio.play();
        }
        ServiceLocator.inputManager.skillSelector.remove();
        ServiceLocator.removeListener(this.skillCallback, this, "SkillSelectorResultMessage");
        this.attackFinished = true;
    }
    
    isAttackFinished()
    {
        return this.attackFinished;
    }
    
    enemyKilledNotification(_enemy)
    {
    }
    
    jump(_angle)
    {
        if (this.onGround())
        {
            this.jumpAudio.play();
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
    
    getFeetArea()
    {
        return [this.sprite.x - 40, this.sprite.x + 109];
    }
    
    addItem(_itemClass)
    {
        var newItem = new _itemClass();
        newItem.apply(this.game.player.sprite);
        this.appliedItems.push(newItem);
    }
    
    removeItem(_itemClass)
    {
        for (var ind in this.appliedItems)
        {
            if (this.appliedItems[ind].getClassName() === _itemClass.NAME)
            {
                this.appliedItems[ind].remove(this.game.player.sprite);
                this.appliedItems.splice(ind, 1);
            }
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
    
    getPosition()
    {
        return new Phaser.Point(this.sprite.x, this.sprite.y);
    }
    
    cardPiecePicked()
    {
        this.cardPieceUI.addPiece();
    }
    
    gearCardCompleted()
    {
        this.game.setOverlayGameMode("GearCardCompletedMode");
        var self = this;
        function cardCollectedCallback()
        {
            self.game.resetOverlayGameMode();
            ServiceLocator.removeListener(cardCollectedCallback, undefined, "GearCardCollectedMessage");
        };
        ServiceLocator.registerListener(cardCollectedCallback, undefined, "GearCardCollectedMessage");
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
    
    getClassName()
    {
        return this.constructor.NAME;
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
DogHatAccesory.NAME = "DogHatAccesory"

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
DogWoolHatAccesory.NAME = "DogWoolHatAccesory"
