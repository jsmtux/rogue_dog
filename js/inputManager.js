function InputManager(_game)
{
    this.bg;
    this.game = _game;
    this.directionGesture = new DirectionGesture(_game, this);
    this.drawGesture = new DrawGesture(_game, this);
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
}

function DrawGesture(_game, _inputManager)
{
    this.game = _game;
    this.points = [];
    this.polygonPoints;
    this.polyFillAlpha = 1.0;
    this.polyFillDecay = 0.05;
    this.functionCb;
    this.contextCb;
    this.removeUpdateSignal = false;
}

DrawGesture.prototype.add = function(_function, _context)
{
    this.bmd = this.game.add.graphics(0, 0);
    this.game.input.addMoveCallback(this.updateMouse, this);
    this.game.updateSignal.add(this.update, this);
    this.functionCb = _function;
    this.contextCb = _context;
}

DrawGesture.prototype.remove = function(_function, _cont)
{
    this.game.input.deleteMoveCallback(this.updateMouse, this);
    this.functionCb = undefined;
    this.contextCb = undefined;
    this.removeUpdateSignal = true;
};

DrawGesture.prototype.update = function()
{
    var timeThreshold = performance.now() - 300;
    for (var ind in this.points)
    {
        if(this.points[ind].time < timeThreshold)
        {
            this.points.shift();
        }
        else
        {
            break;
        }
    }
    this.bmd.clear();
    this.game.world.bringToTop(this.bmd);
    
    if (this.polygonPoints)
    {
        this.bmd.lineStyle(0, 0x000000, 0);
        this.bmd.beginFill(0xFF700B, this.polyFillAlpha);
        this.bmd.drawPolygon(this.polygonPoints);
        this.bmd.endFill();

        this.polyFillAlpha -= this.polyFillDecay;
        if (this.polyFillAlpha < 0)
        {
            this.polygonPoints = undefined;
            this.polyFillAlpha = 1.0;
        }
    }

    this.bmd.lineStyle(10, 0xffd900, 1);
    if (this.points.length > 0)
    {
        this.bmd.moveTo(this.points[0].point.x,this.points[0].point.y);
        for(var i = 1; i < this.points.length; i++)
        {
            this.bmd.lineTo(this.points[i].point.x,this.points[i].point.y);
        }
    }
    
    for (var i = 0; i < this.points.length - 1; i++)
    {
        var lineA = new Phaser.Line(this.points[i].point.x, this.points[i].point.y, this.points[i+1].point.x, this.points[i+1].point.y);
        for(var j = 0; j < this.points.length - 1; j++)
        {
            if (i + 5 > j)
            {
                continue;
            }
            var lineB = new Phaser.Line(this.points[j].point.x, this.points[j].point.y, this.points[j+1].point.x, this.points[j+1].point.y);
            var p = lineA.intersects(lineB, true);
            if (p)
            {
                this.showPolyIntersection(p, i + 1, j - 1);
                break;
            }
        }
    }
    
    //remove update signal only when finished and graphics are not shown anymore
    if (this.polyFillAlpha == 1.0 && this.removeUpdateSignal)
    {
        this.game.updateSignal.remove(this.update, this);
        this.removeUpdateSignal = false;
        this.bmd.destroy();
        this.points = [];
        this.polygonPoints = undefined;
    }
}

DrawGesture.prototype.showPolyIntersection = function(startPoint, i, j)
{
    var tmpPoints = [startPoint];
    for(var x = i; x < j; x++)
    {
        tmpPoints.push(this.points[x].point);
    }
    this.polygonPoints = new Phaser.Polygon(tmpPoints);
    if (this.functionCb)
    {
        this.functionCb.call(this.contextCb, this.polygonPoints);
    }
}

DrawGesture.prototype.updateMouse = function(pointer, x, y)
{
    if (pointer.isDown && !ServiceLocator.infoManager.shouldPause())
    {
        this.points.push({'point':new Phaser.Point(x, y), 'time':performance.now()});
    }
}