class DirectionGesture
{
    constructor(_game, _inputManager)
    {
        this.game = _game;
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
        this.game.updateSignal.add(this.update, this);
    }
    
    remove(_function, _cont)
    {
        this.game.input.onDown.remove(this.mouseDown, this);
        this.game.input.onUp.remove(this.mouseUp, this);
        this.game.input.deleteMoveCallback(this.updateMouse, this);
        this.game.updateSignal.remove(this.update, this);
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
    static preload(_game)
    {
        _game.load.image("jumpBg", "./img/ui/jump/bg.png");
        _game.load.image("jumpStick", "./img/ui/jump/stick.png");
        this.arrowSprite;
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
            var distance = this.initialPos.distance(curPos);
            var vectorDifference = curPos.clone().subtract(this.initialPos.x, this.initialPos.y).normalize();
            if (distance > 50)
            {
                distance = 50;
            }
            vectorDifference.setMagnitude(distance);
            this.stickSprite.x = this.initialPos.x + vectorDifference.x;
            this.stickSprite.y = this.initialPos.y + vectorDifference.y;

            var angle = Math.degrees(this.initialPos.angle(curPos));
            
            this.curAngle = angle < 0 ? angle + 360: angle;
            
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
    }
}