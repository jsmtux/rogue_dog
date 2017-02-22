class DrawGesture
{
    constructor(_game, _inputManager)
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
    
    add(_function, _context)
    {
        this.bmd = this.game.add.graphics(0, 0);
        ServiceLocator.guiManager.addToUI(this.bmd);
        this.game.input.addMoveCallback(this.updateMouse, this);
        this.game.updateSignal.add(this.update, this);
        this.functionCb = _function;
        this.contextCb = _context;
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
    
    showPolyIntersection(startPoint, i, j)
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
    
    updateMouse(pointer, x, y)
    {
        if (pointer.isDown && !ServiceLocator.infoManager.shouldPause())
        {
            this.points.push({'point':new Phaser.Point(x, y), 'time':performance.now()});
        }
    }
}