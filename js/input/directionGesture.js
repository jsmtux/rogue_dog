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
        return new Phaser.Point(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
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
        _game.load.image("jumpArrow", "./img/jumpArrow.png");
        this.arrowSprite;
    }
    
    mouseUp()
    {
        if (this.initialPos)
        {
            this.initialPos = undefined;
            this.cbFunction.call(this.cbContext, this.curAngle);
            
            this.curAngle = undefined;
        }
        
        if (this.arrowSprite)
        {
            this.arrowSprite.destroy();
        }
    }
    
    remove()
    {
        super.remove();
        
        if (this.arrowSprite)
        {
            this.arrowSprite.destroy();
        }
    }

    mouseDown()
    {
        super.mouseDown();
        var mousePos = this.getMousePos();
        this.arrowSprite = this.game.add.sprite(mousePos.x, mousePos.y, "jumpArrow");
        this.arrowSprite.anchor.x = 0.5;
        this.arrowSprite.anchor.y = 0.5;
        ServiceLocator.guiManager.addToUI(this.arrowSprite);
    }
    
    update()
    {
        if (this.initialPos)
        {
            var curPos = this.getMousePos();
            var distance = this.initialPos.distance(curPos);
            var vectorDifference = curPos.clone().subtract(this.initialPos.x, this.initialPos.y)

            this.arrowSprite.x = curPos.x - vectorDifference.x / 2;
            this.arrowSprite.y = curPos.y - vectorDifference.y / 2;

            var angle = Math.degrees(this.initialPos.angle(curPos));
            
            this.arrowSprite.angle = angle;
            this.arrowSprite.scale.setTo(distance / 50, 1.0);
            
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