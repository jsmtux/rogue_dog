class DrawGesture
{
    constructor(_game, _inputManager, _initialPoint)
    {
        this.game = _game;
        this.points = [];
        this.polygonPoints;
        this.polyFillAlpha = 1.0;
        this.polyFillDecay = 0.05;
        this.functionCb;
        this.contextCb;
        this.removeUpdateSignal = false;
        this.inputManager = _inputManager;
        
        if(_initialPoint)
        {
            this.addPoint(_initialPoint);
        }
    }
    
    add(_function, _context)
    {
        this.bmd = this.inputManager.getBmd();
        this.game.input.addMoveCallback(this.updateMouse, this);
        ServiceLocator.updateSignal.add(this.update, this);
        this.functionCb = _function;
        this.contextCb = _context;
        this.removeUpdateSignal = false;
        
    }
    
    remove(_function, _cont)
    {
        this.game.input.deleteMoveCallback(this.updateMouse, this);
        this.functionCb = undefined;
        this.contextCb = undefined;
        this.removeUpdateSignal = true;
    };
    
    update()
    {
        var timeThreshold = performance.now() - 400;
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
        if (this.points.length == 0 && this.polyFillAlpha == 1.0 && this.removeUpdateSignal)
        {
            ServiceLocator.updateSignal.remove(this.update, this);
            this.removeUpdateSignal = false;
            this.bmd.clear();
            this.points = [];
            this.polygonPoints = undefined;
        }
    }
    
    showPolyIntersection(startPoint, i, j)
    {
        var tmpPoints = [startPoint];
        for(var x = i; x < j; x++)
        {
            tmpPoints.push(this.points[x].point);
        }
        this.polygonPoints = new Phaser.Polygon(tmpPoints);
        ServiceLocator.publish(new PolygonIntersectionDrawn(this.polygonPoints));
        if (this.functionCb)
        {
            this.functionCb.call(this.contextCb, this.polygonPoints);
        }
    }
    
    updateMouse(pointer, x, y)
    {
        if (pointer.isDown && !this.game.isPaused())
        {
            this.addPoint(new Phaser.Point(x,y));
        }
    }
    
    addPoint(_point)
    {
        var inputOffset = ServiceLocator.viewportHandler.getSceneOffset();
        this.points.push({'point':new Phaser.Point(_point.x + inputOffset.x, _point.y + inputOffset.y), 'time':performance.now()});
    }
}
