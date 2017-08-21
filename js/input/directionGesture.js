class DirectionGesture
{
    constructor(_game, _inputManager)
    {
        this.game = _game;
        this.inputManager = _inputManager;
        this.initialPos;
        this.curAngle;
    }
    
    getMousePos()
    {
        if (Phaser.Device.desktop)
        {
            return new Phaser.Point(this.game.input.x, this.game.input.y);
        }
        else
        {
            return new Phaser.Point(this.game.input.pointer1.x, this.game.input.pointer1.y);
        }
    }
    
    add(_function, _context)
    {
        this.game.input.onDown.add(this.mouseDown, this);
        this.game.input.onUp.add(this.mouseUp, this);
        this.game.input.addMoveCallback(this.updateMouse, this);
        this.cbFunction = _function;
        this.cbContext = _context;
        ServiceLocator.updateSignal.add(this.update, this);
    }
    
    remove(_function, _cont)
    {
        this.game.input.onDown.remove(this.mouseDown, this);
        this.game.input.onUp.remove(this.mouseUp, this);
        this.game.input.deleteMoveCallback(this.updateMouse, this);
        ServiceLocator.updateSignal.remove(this.update, this);
    };

    mouseDown()
    {
        this.initialPos = this.getMousePos();
    }
    
    mouseUp()
    {
        if (this.initialPos)
        {
            this.initialPos = undefined;
            
            var direction;
            
            if (this.curAngle < 45)
            {
                direction = 'right';
            }
            else if (this.curAngle < 135)
            {
                direction = 'down';
            }
            else if (this.curAngle < 225)
            {
                direction = 'left';
            }
            else if (this.curAngle < 315)
            {
                direction = 'up';
            }
            else
            {
                direction = 'right';
            }
            
            this.cbFunction.call(this.cbContext, direction, this.curAngle);
            
            this.curAngle = undefined;
        }
    }
    
    updateMouse()
    {
    }
    
    update()
    {
        if (this.initialPos)
        {
            var curPos = this.getMousePos();
            var angle = Math.degrees(this.initialPos.angle(curPos));
            this.curAngle = angle < 0 ? angle + 360: angle;
        }
    }
}

class PlayerDirectionGesture extends DirectionGesture
{
    constructor(_game, _inputManager)
    {
        super(_game, _inputManager);
        
        this.iterationsShowingTrajectory = 0;
        this.trajectoryShowRate = 1.0;
        this.trajectoryArrow;
        
        this.origin = new Phaser.Point(0, 0);
        
        this.enabled = false;
    }

    static preload(_game)
    {
        _game.load.image("jumpBg", "./img/ui/jump/bg.png");
        _game.load.image("jumpStick", "./img/ui/jump/stick.png");
        _game.load.image('trajectory_arrow', './img/trajectory_arrow.png');
    }
    
    create()
    {
        this.bgSprite = this.game.add.sprite(0, 0, "jumpBg");
        this.bgSprite.alpha = 0.5;
        this.stickSprite = this.game.add.sprite(0, 0, "jumpStick");
        this.stickSprite.alpha = 0.75;
        this.stickSprite.anchor.x = 0.5;
        this.stickSprite.anchor.y = 0.5;
        this.bgSprite.anchor = this.stickSprite.anchor.clone();
        ServiceLocator.renderer.addToUI(this.bgSprite);
        ServiceLocator.renderer.addToUI(this.stickSprite);
        this.bgSprite.visible = false;
        this.stickSprite.visible = false;
        
        this.trajectoryArrow = this.game.add.sprite(0, 0, 'trajectory_arrow');
        this.trajectoryArrow.visible = false;
        this.trajectoryArrow.anchor = new Phaser.Point(0.16, 0.5);
        ServiceLocator.renderer.addToOverlay(this.trajectoryArrow);
    }
    
    mouseUp()
    {
        if (this.initialPos)
        {
            
            var distance = this.getMousePos().subtract(this.initialPos.x, this.initialPos.y).getMagnitude();
            //if (distance > 25)
            {
                this.cbFunction.call(this.cbContext, this.curAngle);
            }

        }
        this.reset();
    }
    
    reset()
    {
        this.bgSprite.visible = false;
        this.stickSprite.visible = false;
        this.initialPos = undefined;
        this.curAngle = undefined;
    }
    
    remove()
    {
        super.remove();
        this.reset();
    }

    mouseDown()
    {
        super.mouseDown();
        var mousePos = this.getMousePos();
        this.bgSprite.visible = true;
        this.stickSprite.visible = true;
        
        this.bgSprite.x = this.stickSprite.x = mousePos.x;
        this.bgSprite.y = this.stickSprite.y = mousePos.y;
    }
    
    update()
    {
        if (this.initialPos)
        {
            var curPos = this.getMousePos();
            var realDistance = this.initialPos.distance(curPos);
            var vectorDifference = curPos.clone().subtract(this.initialPos.x, this.initialPos.y).normalize();
            var distance = realDistance < 50 ? realDistance : 50;
            
            vectorDifference.setMagnitude(distance);
            this.stickSprite.x = this.initialPos.x + vectorDifference.x;
            this.stickSprite.y = this.initialPos.y + vectorDifference.y;

            var angle = Math.degrees(this.initialPos.angle(curPos));
            
            this.curAngle = angle < 0 ? angle + 360: angle;
            
            
            if (realDistance > 70)
            {
                    if (this.curAngle > 135 && this.curAngle < 205)
                    {
                        var drawGesture = new DrawGesture(this.game, this.inputManager, this.initialPos);
                        drawGesture.create();
                        this.initialPos = undefined;
                        this.reset();
                    }
            }

            if (this.curAngle < 45)
            {
                this.curAngle = 340;
            }
            else if (this.curAngle < 270)
            {
                this.curAngle = 270;
            }
            else if (this.curAngle > 340)
            {
                this.curAngle = 340;
            }
            
        }
        this.updateTrajectoryImage();
    }
    
    updateTrajectoryImage()
    {
        var bmd = ServiceLocator.inputManager.getBmd();
        this.trajectoryArrow.visible = false;
        if (this.curAngle !== undefined && this.enabled)
        {
            this.iterationsShowingTrajectory++;
            var cameraPos = ServiceLocator.camera.getPosition();
            var relativeOrigin = this.origin.clone().subtract(cameraPos.x, cameraPos.y);
            
            bmd.moveTo(relativeOrigin.x,relativeOrigin.y);
            var curPos = relativeOrigin.clone();
            var iterationAdvance = 1;
            var jumpAcceleration = new Phaser.Point();
            jumpAcceleration.y = this.speed.y + this.strength * -Math.sin(Math.radians(this.curAngle));
            jumpAcceleration.x = this.speed.x + this.strength * Math.cos(Math.radians(this.curAngle));
            
            var iteration = 0;
            while(relativeOrigin.y >= curPos.y && iteration++ < this.iterationsShowingTrajectory * this.trajectoryShowRate)
            {
                curPos.x += iterationAdvance * jumpAcceleration.x;
                curPos.y -= iterationAdvance * jumpAcceleration.y;
                jumpAcceleration.x += this.acceleration.x;
                jumpAcceleration.y += this.acceleration.y;
                bmd.lineStyle(10, 0x000000, 1.0);
                bmd.lineTo(curPos.x, curPos.y);
            }
            
            jumpAcceleration.y = this.speed.y + this.strength * -Math.sin(Math.radians(this.curAngle));
            jumpAcceleration.x = this.speed.x + this.strength * Math.cos(Math.radians(this.curAngle));
            curPos = relativeOrigin.clone();
            bmd.moveTo(curPos.x, curPos.y);
            iteration = 0;
            var prevPos;
            while(relativeOrigin.y >= curPos.y && iteration++ < this.iterationsShowingTrajectory * this.trajectoryShowRate)
            {
                prevPos = curPos.clone();
                curPos.x += iterationAdvance * jumpAcceleration.x;
                curPos.y -= iterationAdvance * jumpAcceleration.y;
                jumpAcceleration.x += this.acceleration.x;
                jumpAcceleration.y += this.acceleration.y;
                bmd.lineStyle(6, 0xffffff, 1.0);
                bmd.lineTo(curPos.x, curPos.y);
            }

            this.trajectoryArrow.visible = true;
            this.trajectoryArrow.x = curPos.x - relativeOrigin.x + this.origin.x + 5;
            this.trajectoryArrow.y = curPos.y - relativeOrigin.y + this.origin.y;
            this.trajectoryArrow.angle = Math.degrees(Phaser.Point.angle(curPos, prevPos));
        }
        else
        {
            this.iterationsShowingTrajectory = 0;
        }
    }
    
    updateSettings(_enabled, _origin, _speed, _acceleration, _strength)
    {
        this.enabled = _enabled;
        this.origin = _origin.clone();
        this.speed = _speed;
        this.acceleration = _acceleration;
        this.strength = _strength;
    }
}