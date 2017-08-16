class DogPlayer extends GameObject
{
    constructor(_game)
    {
        super();
        this.game;
        this.character;
        this.maxHeartQuarters = 16;
        this.heartQuarters = this.maxHeartQuarters;
        this.jumpAcceleration = new Phaser.Point(0, 0);
        this.dizzy = false;
        
        this.gravity = 0.3;
        
        this.jumpStrenght = 10.5;
        
        this.walkSpeed = 6;
        this.curSpeed = 0;
        
        this.currentAnimation = '';
        this.playerInitialY = GROUND_LEVEL - 90;
        
        this.collisionBodies = {};
        
        this.appliedItems = {};
        
        _game.updateSignal.add(this.update, this);
        _game.renderSignal.add(this.updateRender, this);
        this.updateModeCallback;
        
        this.stickNumber = 0;
        this.maxStickNumber = 5;
        
        this.position = new Phaser.Point(0,0);
        this.offset = new Phaser.Point(0,90);
        
        this.bodyBox;
        this.mouthBox;
        
        this.speechBubbleSourcePoint = new Phaser.Point(0,0);
    }
    
    static preload(_game)
    {
        AttackStick.preload(_game);

        var path = "anim/"
        _game.load.atlas("dogAnimAtlas", path + "dog 2.png", path + "dog 2.json");
        _game.load.json("dogJSON", path + "dog 2.scon");
        
        _game.load.audio('playerAttackAudio', 'sounds/player_attack.wav');
        _game.load.audio('playerJumpAudio', 'sounds/player_jump.wav');
        _game.load.audio('playerLandAudio', 'sounds/player_land.wav');
        _game.load.audio('playerStepAudio', 'sounds/player_step.wav');
        _game.load.audio('pickStickAudio', 'sounds/pick_stick.wav');

        DogHatAccesory.preload(_game);
        DogWoolHatAccesory.preload(_game);
    }
    
    create(_game)
    {
        this.game = _game;
        var sprite = loadSpriter(this.game, "dogJSON", "dogAnimAtlas", "Dog");
        super.create(sprite, true);
        ServiceLocator.renderer.addToScene(this.sprite);
        this.sprite.onEvent.add(this.playStepSound, this);
        this.sprite.onPointUpdated.add(this.updateItemHandlePoints, this);
        this.sprite.onBoxUpdated.add(this.updateCollisionBox, this);
        
        this.position.setTo(0, this.playerInitialY);
        
        this.collisionBodies[DogPlayer.CollisionBoxes.BODY] = this.game.add.sprite(0, 0);
        ServiceLocator.renderer.addToScene(this.collisionBodies[DogPlayer.CollisionBoxes.BODY]);
        ServiceLocator.physics.addToWorld(this.collisionBodies[DogPlayer.CollisionBoxes.BODY]);
        this.collisionBodies[DogPlayer.CollisionBoxes.HEAD] = this.game.add.sprite(0, 0);
        ServiceLocator.renderer.addToScene(this.collisionBodies[DogPlayer.CollisionBoxes.HEAD]);
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
        
        this.jumpAudio = this.game.add.audio('playerJumpAudio');
        this.landAudio = this.game.add.audio('playerLandAudio');
        this.landAudio.volume = 0.25;
        this.stepAudio = this.game.add.audio('playerStepAudio');
        this.stepAudio.volume = 0.25;
        this.pickStickAudio = this.game.add.audio('pickStickAudio');
        this.pickStickAudio.volume = 0.25;
        //This has been preloaded in DialogManager, should be changed
        this.barkAudio = this.game.add.audio('dogTalk');
        
        ServiceLocator.registerListener(this.itemPicked, this, "ItemPickedMessage");
        ServiceLocator.registerListener(this.answerChosen, this, "DogAnswerChosen");
    }
    
    update()
    {
        this.sprite.x = this.position.x + this.offset.x;
        this.sprite.y = this.position.y + this.offset.y;
        
        if (this.bodyBox)
        {
            this.collisionBodies[DogPlayer.CollisionBoxes.BODY].x = this.bodyBox.x + this.sprite.x;
            this.collisionBodies[DogPlayer.CollisionBoxes.BODY].y = this.bodyBox.y + this.sprite.y;
            
            this.collisionBodies[DogPlayer.CollisionBoxes.BODY].width = this.bodyBox.width * this.bodyBox.scaleX;
            this.collisionBodies[DogPlayer.CollisionBoxes.BODY].height = this.bodyBox.height * this.bodyBox.scaleY;
        }
        if (this.mouthBox)
        {
            this.collisionBodies[DogPlayer.CollisionBoxes.HEAD].x = this.mouthBox.x + this.sprite.x;
            this.collisionBodies[DogPlayer.CollisionBoxes.HEAD].y = this.mouthBox.y + this.sprite.y;
            
            this.collisionBodies[DogPlayer.CollisionBoxes.HEAD].width = this.mouthBox.width * this.mouthBox.scaleX;
            this.collisionBodies[DogPlayer.CollisionBoxes.HEAD].height = this.mouthBox.height * this.mouthBox.scaleY;
        }
        
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
                this.appliedItems[ind].sprite.position.set(this.position.x + transformed.x, this.position.y + transformed.y);
                this.appliedItems[ind].sprite.angle = this.sprite.angle + transformed.angle;
            }
        }
    }
    
    updateWalk()
    {
        var shouldPlay;
        this.position.x += this.curSpeed + this.jumpAcceleration.x;
        var initialSpeed = new Phaser.Point(this.curSpeed, 0);
        var acceleration = new Phaser.Point(0, -this.gravity);
        ServiceLocator.inputManager.playerDirectionGesture.updateSettings(this.onGround(), this.position, initialSpeed, acceleration, this.jumpStrenght);
        
        if (this.isUnderground())
        {
            this.position.y = this.playerInitialY - 200;
            this.sprite.alpha = 0.5;
            this.curSpeed = 0;
            var curX = this.position.x;
            while (ServiceLocator.walkManager.getGroundTiles(curX).length < 1)
            {
                curX += 10;
            }
            this.position.x = curX;
            this.updateHeartNumber(this.heartQuarters - 4);
        }

        if (this.onGround() && this.jumpAcceleration.y === 0)
        {
            this.sprite.alpha = 1.0;
            this.curSpeed = this.walkSpeed;
            shouldPlay = DogPlayer.Animations.WALK;
            this.jumpAcceleration.x = 0;
        }
        else
        {
            this.position.y -= this.jumpAcceleration.y;
            this.jumpAcceleration.y -= this.gravity;
            if (this.jumpAcceleration.y > 0)
            {
                shouldPlay = DogPlayer.Animations.JUMP;
            }
            else
            {
                shouldPlay = DogPlayer.Animations.FALL;
            }
            var groundLevel = this.getGroundLevel();
            if (groundLevel)
            {
                this.landAudio.play();
                ServiceLocator.publish(new EmitParticle(EmitParticle.Types.GrassLand, new Phaser.Point(this.position.x, this.position.y + 90)));
                this.jumpAcceleration.y = 0;
                this.position.y = groundLevel;
            }
        }
        this.play(shouldPlay);
    }
    
    getCollisionBox(_part)
    {
        return this.collisionBodies[_part];
    }
    
    updateCollisionBox(_spriterGroup, _spriterObject)
    {
        if (_spriterObject.name == "body_box")
        {
            this.bodyBox = _spriterObject.transformed;
            this.bodyBox.height = _spriterObject.objectInfo.height;
            this.bodyBox.width = _spriterObject.objectInfo.width;
        }
        else if (_spriterObject.name == "mouth_box")
        {
            this.mouthBox = _spriterObject.transformed;
            this.mouthBox.height = _spriterObject.objectInfo.height;
            this.mouthBox.width = _spriterObject.objectInfo.width;
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
            case "speechBubbleSource":
                //this should no longer be needed
                this.speechBubbleSourcePoint = pointObj.transformed;
                
                var position = this.position.clone();
                position.add(pointObj.transformed.x - 5, pointObj.transformed.y + 80);
                var sceneOffset = ServiceLocator.viewportHandler.getSceneOffset();
                position.subtract(sceneOffset.x, sceneOffset.y);
                ServiceLocator.publish(new DialogSourceUpdated(position));
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
        this.play(DogPlayer.Animations.WALK);
        this.updateModeCallback = this.updateWalk;
    }
    
    finishWalk()
    {
        ServiceLocator.inputManager.playerDirectionGesture.remove(this.jump, this);
        ServiceLocator.removeListener(this.obstacleHit, this, "JumpFailedMessage");
        this.curSpeed = 0;
        this.play(DogPlayer.Animations.IDLE);
        this.updateModeCallback = undefined;
    }
    
    canAttack()
    {
        return this.stickNumber > 0;
    }
    
    updateStickNumber(_number)
    {
        if (_number < 0)
        {
            _number = 0;
        }
        ServiceLocator.publish(new StickNumberUpdated(_number, this.stickNumber));
        this.stickNumber = _number;
    }

    play(_animationName)
    {
        if (this.currentAnimation != _animationName)
        {
            this.currentAnimation = _animationName;
            this.sprite.animations.play(_animationName);
        }
    }
    
    updateHeartNumber(_number)
    {
        if (_number < 0)
        {
            _number = 0;
            this.game.die();
        }
        if (_number > this.maxHeartQuarters)
        {
            _number = this.maxHeartQuarters;
        }
        this.heartQuarters = _number;
        ServiceLocator.publish(new HeartNumberUpdated(this.heartQuarters));
    }
    
    addHeartNumber(_number)
    {
        this.updateHeartNumber(this.heartQuarters + _number);
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
        this.updateHeartNumber(this.heartQuarters - 1);
        if (this.jumpAcceleration.y > 0)
        {
            this.jumpAcceleration.y = 0;
        }
        
        this.updateStickNumber(this.stickNumber - 1);
    }
    
    monsterHit()
    {
        ServiceLocator.camera.flash(0xff0000, 200);
        this.updateHeartNumber(this.heartQuarters - 2);
        var self = this;
        setTimeout(function(){
            self.play(DogPlayer.Animations.IDLE);
        }, 500);
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
        
        var groundTiles = ServiceLocator.walkManager.getGroundTiles(this.position.x);
        
        for (var ind in groundTiles)
        {
            var offset = Math.abs(this.jumpAcceleration.y);
            var height = groundTiles[ind].getTopPosition();
            if (this.position.y >= height - offset && this.position.y <= height + offset)
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
        return [this.position.x - 40, this.position.x + 112];
    }
    
    addItem(_itemClass)
    {
        var newItem = new _itemClass(this.game, this);
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
        return this.position.y - bottomHeight;
    }
    
    isUnderground()
    {
        return this.position.y > (GROUND_LEVEL + 150);
    }
    
    getPosition()
    {
        return new Phaser.Point(this.position.x, this.position.y);
    }
    
    itemPicked(_msg)
    {
        this.updateStickNumber(this.stickNumber + 1);
        this.pickStickAudio.play();
    }
    
    answerChosen()
    {
        this.play(DogPlayer.Animations.BARK);
        this.barkAudio.play();
        
        var changeAnimationOnEnd = () => {
            this.sprite.onLoop.remove(changeAnimationOnEnd);
            this.play(DogPlayer.Animations.IDLE);
        }
        this.sprite.onLoop.add(changeAnimationOnEnd);
    }
}

DogPlayer.Animations = {
    IDLE:"Idle",
    WALK:"Run",
    JUMP:"Jump",
    AIR:"air",
    FALL:"Fall",
    BARK:"Barking"
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
    constructor(_game, _player)
    {
        super(Accesory.BodyParts.HEAD, "Magician hat", _game.add.sprite(0, 0, "hat01"), new Phaser.Point(0.37, 0.31));
        ServiceLocator.registerListener(this.attackDefended, this, "AttackDefendedMessage");
        this.player = _player;
    }
    
    static preload(_game)
    {
        _game.load.image('hat01', './img/objects/tophat.png');
    }
    
    attackDefended()
    {
        this.player.stickNumber++;
        this.player.updateStickNumber();
    }
    
    destroy()
    {
        super.destroy();
        ServiceLocator.removeListener(this.attackDefended, this, "AttackDefendedMessage");
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
