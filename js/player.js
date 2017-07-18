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
        
        _game.load.image('trajectory_arrow', './img/trajectory_arrow.png');

        DogHatAccesory.preload(_game);
        DogWoolHatAccesory.preload(_game);
        CardPieceUI.preload(_game);
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
        
        
        this.cardPieceUI.create(this.game);
        ServiceLocator.registerListener(this.cardPiecePicked, this, "CardPieceFoundMessage");
        ServiceLocator.registerListener(this.gearCardCompleted, this, "GearCardCompletedMessage");
        
        this.ownLight = new spotLight(new Phaser.Point(this.position.x + 25, this.position.y), 250, 0xFFFF00, 0.5);
        ServiceLocator.lighting.addLight(this.ownLight);
        
        this.attackAudio = this.game.add.audio('playerAttackAudio');
        this.jumpAudio = this.game.add.audio('playerJumpAudio');
        this.landAudio = this.game.add.audio('playerLandAudio');
        this.landAudio.volume = 0.25;
        this.stepAudio = this.game.add.audio('playerStepAudio');
        this.stepAudio.volume = 0.25;
        this.pickStickAudio = this.game.add.audio('pickStickAudio');
        this.pickStickAudio.volume = 0.25;
        //This has been preloaded in DialogManager, should be changed
        this.barkAudio = this.game.add.audio('dogTalk');
        
        
        this.trajectoryArrow = _game.add.sprite(0, 0, 'trajectory_arrow');
        this.trajectoryArrow.visible = false;
        this.trajectoryArrow.anchor = new Phaser.Point(0.16, 0.5);
        ServiceLocator.renderer.addToOverlay(this.trajectoryArrow);
        
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
        this.ownLight.position = new Phaser.Point(this.position.x + 100, this.position.y - 25);

        if (this.onGround() && this.jumpAcceleration.y === 0)
        {
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
        
        this.updateTrajectoryImage();
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
            this.trajectoryArrow.x = curPos.x - relativePlayerPos.x + this.position.x + 5;
            this.trajectoryArrow.y = curPos.y - relativePlayerPos.y + this.position.y;
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
            case "speechBubbleSource":
                this.speechBubbleSourcePoint = pointObj.transformed;
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
        this.trajectoryArrow.visible = false;
        this.curSpeed = 0;
        this.play(DogPlayer.Animations.IDLE);
        this.updateModeCallback = undefined;
    }
    
    canAttack()
    {
        return this.stickNumber > 0;
    }
    
    doAttack(_hitType, _enemy, _finishCallback)
    {
        this.attackAudio.play();
        var cb = () => {
            _finishCallback(); 
            _enemy.takeHit(this, _hitType, this.attackPower);
        };
        this.updateStickNumber(this.stickNumber - 1);
        new AttackStick(this.position, _enemy.position, cb, this.game);
    }
    
    updateStickNumber(_number)
    {
        if (_number < 0)
        {
            _number = 0;
        }
        if (_number > this.maxStickNumber)
        {
            _number = this.maxStickNumber
        }
        this.stickNumber = _number;
        ServiceLocator.publish(new StickNumberUpdated(this.stickNumber));
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
        return this.position.y > (GROUND_LEVEL);
    }
    
    getPosition()
    {
        return new Phaser.Point(this.position.x, this.position.y);
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

class AttackStick
{
    constructor(_initPosition, _endPosition, _callback, _game)
    {
        this.endPosition = _endPosition;
        this.callback = _callback;
        this.sprite = _game.add.sprite(_initPosition.x, _initPosition.y, 'stick');
        ServiceLocator.renderer.addToScene(this.sprite);
        _game.updateSignal.add(this.update, this);
        this.game = _game;
        this.x_accel = 10.0;
        this.y_accel = 20.0;

        var totalIterations = (_endPosition.x - _initPosition.x) / this.x_accel;
        this.halfIterations = totalIterations / 2;
        this.curIteration = 0;
        
        this.hitStickAudio = this.game.add.audio('hitStickAudio');
    }
    
    static preload(_game)
    {
        _game.load.audio('hitStickAudio', 'sounds/hit_stick.wav');
    }
    
    update()
    {
        this.sprite.x += 10.0;
        var distance;
        if (this.curIteration < this.halfIterations)
        {
            var distance = this.halfIterations - this.curIteration;
        }
        else
        {
            var distance = this.halfIterations - this.curIteration;
        }
        distance = distance / this.halfIterations;
        this.sprite.y -= distance * this.y_accel;
        if (this.sprite.x >= this.endPosition.x)
        {
            this.hitStickAudio.play();
            this.destroy();
            this.callback();
        }
        this.curIteration ++;
        this.sprite.angle -= 1 + Math.random();
    }
    
    destroy()
    {
        this.sprite.destroy();
        this.game.updateSignal.remove(this.update, this);
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
