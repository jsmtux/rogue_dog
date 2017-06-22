class DogPlayer extends GameObject
{
    constructor(_game)
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
        
        this.gravity = 0.3;
        
        this.jumpStrenght = 10.5;
        
        this.walkSpeed = 6;
        this.curSpeed = 0;
        
        this.currentAnimation = '';
        this.playerInitialY = GROUND_LEVEL - 90;
        
        this.ownLight;
        
        this.cardPieceUI = new CardPieceUI();
        
        this.attackPower = 4.0;

        this.iterationsShowingTrajectory = 0;
        this.trajectoryShowRate = 1.0;
        
        this.trajectoryArrow;
        
        this.collisionBodies = {};
        
        this.appliedItems = {};
        
        _game.updateSignal.add(this.update, this);
        _game.renderSignal.add(this.updateRender, this);
        this.updateModeCallback;
        
        this.stickNumber = 0;
    }
    
    static preload(_game)
    {
        HealthBar.preload(_game);
        EnergyBar.preload(_game);

        var path = "anim/"
        _game.load.atlas("dogAnimAtlas", path + "dog.png", path + "dog.json");
        _game.load.json("dogJSON", path + "dog.scon");
        
        _game.load.audio('playerAttackAudio', 'sounds/player_attack.wav');
        _game.load.audio('playerJumpAudio', 'sounds/player_jump.wav');
        _game.load.audio('playerLandAudio', 'sounds/player_land.wav');
        _game.load.audio('playerStepAudio', 'sounds/player_step.wav');
        
        _game.load.image('trajectory_arrow', './img/trajectory_arrow.png');

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
        this.sprite.onPointUpdated.add(this.updateItemHandlePoints, this);
        
        this.collisionBodies[DogPlayer.CollisionBoxes.BODY] = this.sprite.getSpriteByName("body");
        ServiceLocator.physics.addToWorld(this.collisionBodies[DogPlayer.CollisionBoxes.BODY]);
        this.collisionBodies[DogPlayer.CollisionBoxes.HEAD] = this.sprite.getSpriteByName("head");
        ServiceLocator.physics.addToWorld(this.collisionBodies[DogPlayer.CollisionBoxes.HEAD]);
        
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
        
        this.trajectoryArrow = _game.add.sprite(0, 0, 'trajectory_arrow');
        this.trajectoryArrow.visible = false;
        this.trajectoryArrow.anchor = new Phaser.Point(0.16, 0.5);
        ServiceLocator.renderer.addToOverlay(this.trajectoryArrow);

        this.addItem(DogWoolHatAccesory);
        
        ServiceLocator.registerListener(this.itemPicked, this, "ItemPickedMessage");
        
        this.stickCounterGUI = new StickCounterGuiElement()
        ServiceLocator.guiManager.createUI(this.stickCounterGUI);
    }
    
    update()
    {
        if (this.updateModeCallback)
        {
            this.updateModeCallback();
        }
    }
    
    updateRender()
    {
        for(var ind in this.appliedItems)
        {
            if (this.appliedItems[ind])
            {
                var transformed = this.appliedItems[ind].transformed;
                this.appliedItems[ind].sprite.position.set(this.sprite.x + transformed.x, this.sprite.y + transformed.y);
                this.appliedItems[ind].sprite.angle = this.sprite.angle + transformed.angle;
            }
        }
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
            this.jumpAcceleration.y -= this.gravity;
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
                ServiceLocator.publish(new EmitParticle(EmitParticle.Types.GrassLand, new Phaser.Point(this.sprite.x, this.sprite.y + 90)));
                this.jumpAcceleration.y = 0;
                this.sprite.y = groundLevel;
            }
        }
        this.play(shouldPlay);
        
        if (this.isUnderground())
        {
            this.subtractEnergy(0.01);
        }
        
        this.updateTrajectoryImage();
    }
    
    getCollisionBox(_part)
    {
        return this.collisionBodies[_part];
    }
    
    updateTrajectoryImage()
    {
        var bmd = ServiceLocator.inputManager.getBmd();
        bmd.clear();
        this.trajectoryArrow.visible = false;
        var curAngle = ServiceLocator.inputManager.playerDirectionGesture.curAngle;
        if (curAngle !== undefined && this.onGround())
        {
            this.iterationsShowingTrajectory++;
            var playerPos = this.getPosition();
            var cameraPos = ServiceLocator.camera.getPosition();
            var relativePlayerPos = playerPos.subtract(cameraPos.x, cameraPos.y);
            
            bmd.moveTo(relativePlayerPos.x,relativePlayerPos.y);
            var curPos = relativePlayerPos.clone();
            var iterationAdvance = 1;
            var jumpAcceleration = new Phaser.Point();
            var jumpStrength = this.jumpStrenght;
            jumpAcceleration.y = jumpStrength * -Math.sin(Math.radians(curAngle));
            jumpAcceleration.x = jumpStrength * Math.cos(Math.radians(curAngle)) + this.curSpeed;
            
            var iteration = 0;
            while(relativePlayerPos.y >= curPos.y && iteration++ < this.iterationsShowingTrajectory * this.trajectoryShowRate)
            {
                curPos.x += iterationAdvance * jumpAcceleration.x;
                curPos.y -= iterationAdvance * jumpAcceleration.y;
                jumpAcceleration.y -= this.gravity;
                bmd.lineStyle(10, 0x000000, 1.0);
                bmd.lineTo(curPos.x, curPos.y);
            }
            
            jumpAcceleration.y = jumpStrength * -Math.sin(Math.radians(curAngle));
            curPos = relativePlayerPos.clone();
            bmd.moveTo(curPos.x, curPos.y);
            iteration = 0;
            var prevPos;
            while(relativePlayerPos.y >= curPos.y && iteration++ < this.iterationsShowingTrajectory * this.trajectoryShowRate)
            {
                prevPos = curPos.clone();
                curPos.x += iterationAdvance * jumpAcceleration.x;
                curPos.y -= iterationAdvance * jumpAcceleration.y;
                jumpAcceleration.y -= this.gravity;
                bmd.lineStyle(6, 0xffffff, 1.0);
                bmd.lineTo(curPos.x, curPos.y);
            }
            
            this.trajectoryArrow.visible = true;
            this.trajectoryArrow.x = curPos.x - relativePlayerPos.x + this.sprite.x + 5;
            this.trajectoryArrow.y = curPos.y - relativePlayerPos.y + this.sprite.y;
            this.trajectoryArrow.angle = Math.degrees(Phaser.Point.angle(curPos, prevPos));
        }
        else
        {
            this.iterationsShowingTrajectory = 0;
        }
    }
    
    updateItemHandlePoints(spriter, pointObj)
    {
        var item;
        switch(pointObj.name)
        {
            case "headitem_handle":
                item = this.appliedItems[Accesory.BodyParts.HEAD];
                break;
            default:
                console.error("Invalid point handler in dog animation.");
        }
        
        if (item)
        {
            var transformed = pointObj.transformed;
            item.transformed = transformed;
        }
    }
    
    startWalk()
    {
        ServiceLocator.inputManager.playerDirectionGesture.add(this.jump, this);
        ServiceLocator.registerListener(this.obstacleHit, this, "JumpFailedMessage");
        this.curSpeed = this.walkSpeed;
        this.play("walk");
        this.updateModeCallback = this.updateWalk;
    }
    
    finishWalk()
    {
        ServiceLocator.inputManager.playerDirectionGesture.remove(this.jump, this);
        ServiceLocator.removeListener(this.obstacleHit, this, "JumpFailedMessage");
        this.trajectoryArrow.visible = false;
        this.curSpeed = 0;
        this.play("idle");
        this.updateModeCallback = undefined;
    }
    
    doAttack(_hitType, _enemy)
    {
        this.attackAudio.play();
        _enemy.takeHit(this, _hitType, this.attackPower);
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
        var newItem = new _itemClass(this.game);
        this.appliedItems[newItem.getBodyPart()] = newItem;
    }
    
    removeItem(_bodyPosition)
    {
        this.appliedItems[_bodyPosition].destroy();
        this.appliedItems[_bodyPosition] = undefined;
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
    
    itemPicked(_msg)
    {
        _msg.getItem().pick();
        this.stickNumber++;
        this.stickCounterGUI.setNumber(this.stickNumber);
    }
}

DogPlayer.CollisionBoxes = {
    HEAD: 0,
    BODY: 1
}

class Accesory
{
    constructor(_bodyPart, _name, _sprite, _anchor = new Phaser.Point(0,0))
    {
        this.bodyPart = _bodyPart;
        this.name = _name;
        this.sprite = _sprite;
        ServiceLocator.renderer.addToScene(_sprite);
        this.sprite.anchor.set(_anchor.x, _anchor.y);
    }
    
    destroy()
    {
        this.sprite.destroy();
    }
    
    getName()
    {
        return this.name;
    }
    
    getBodyPart()
    {
        return this.bodyPart;
    }
}

Accesory.BodyParts = {
    HEAD: 0,
    NECK: 1,
    FEET: 2
}

class DogHatAccesory extends Accesory
{
    constructor(_game)
    {
        super(Accesory.BodyParts.HEAD, "Magician hat", _game.add.sprite(0, 0, "hat01"), new Phaser.Point(0.37, 0.31));
    }
    
    static preload(_game)
    {
        _game.load.image('hat01', './img/objects/tophat.png');
    }
}

class DogWoolHatAccesory extends Accesory
{
    constructor(_game)
    {
        super(Accesory.BodyParts.HEAD, "Wool hat", _game.add.sprite(0, 0, "hat02"), new Phaser.Point(0.37, 0.31));
    }
    
    static preload(_game)
    {
        _game.load.image('hat02', './img/objects/woolhat.png');
    }
}
