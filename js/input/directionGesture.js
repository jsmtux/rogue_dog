class DirectionGesture
{
    constructor(_game, _inputManager)
    {
        this.game = _game;
        this.initialPos;
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
    }
    
    remove(_function, _cont)
    {
        this.game.input.onDown.remove(this.mouseDown, this);
        this.game.input.onUp.remove(this.mouseUp, this);
        this.game.input.deleteMoveCallback(this.updateMouse, this);
    };
    
    mouseDown()
    {
        this.initialPos = this.getMousePos();
    }
    
    mouseUp()
    {
        if (this.initialPos)
        {
            var curPos = this.getMousePos();
            var angle = Math.degrees(this.initialPos.angle(curPos));
            angle = angle < 0 ? angle + 360: angle;
            this.initialPos = undefined;
            
            var direction;
            
            if (angle < 45)
            {
                direction = 'right';
            }
            else if (angle < 135)
            {
                direction = 'down';
            }
            else if (angle < 225)
            {
                direction = 'left';
            }
            else if (angle < 315)
            {
                direction = 'up';
            }
            else
            {
                direction = 'left'
            }
            
            this.cbFunction.call(this.cbContext, direction, angle);
        }
    }
    
    updateMouse()
    {
    }
}
