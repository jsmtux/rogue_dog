function InputManager(_game)
{
    this.bg;
    this.game = _game;
    this.directionGesture = new DirectionGesture(_game, this);
}

InputManager.prototype.create = function(game)
{
    this.up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    this.bg = game.add.sprite(0, 0);
    this.bg.scale.setTo(resolution.x, resolution.y);
    this.bg.inputEnabled = true;
    this.bg.input.priorityID = 0; // lower priority
    this.leftButton = {}
    this.leftButton.onDown = this.bg.events.onInputDown;
}

function DirectionGesture(_game, _inputManager)
{
    this.game = _game;
    this.initialPos;
}

DirectionGesture.direction = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
}

DirectionGesture.prototype.getMousePos = function()
{
    return new Phaser.Point(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
}

DirectionGesture.prototype.add = function(_function, _context)
{
    this.game.input.onDown.add(this.mouseDown, this);
    this.game.input.onUp.add(this.mouseUp, this);
    this.game.input.addMoveCallback(this.updateMouse, this);
    this.cbFunction = _function;
    this.cbContext = _context;
}

DirectionGesture.prototype.remove = function(_function, _cont)
{
    this.game.input.onDown.remove(this.mouseDown, this);
    this.game.input.onUp.remove(this.mouseUp, this);
    this.game.input.deleteMoveCallback(this.updateMouse, this);
};

DirectionGesture.prototype.mouseDown = function()
{
    this.initialPos = this.getMousePos();
}

DirectionGesture.prototype.mouseUp = function()
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
        
        this.cbFunction.call(this.cbContext, direction);
    }
}

DirectionGesture.prototype.updateMouse = function()
{
    //console.log(this.getMousePos() - this.initialPos);
}