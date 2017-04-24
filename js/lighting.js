class Lighting
{
    constructor()
    {
        this.lights = []
        this.clearColor = 0xFFFFFF;
        this.clearAlpha = 0.05;
    }
    
    draw(_graphics)
    {
        _graphics.clear();
        
        var cameraBounds = ServiceLocator.camera.getVisibleArea();
        _graphics.beginFill(this.clearColor, this.clearAlpha);
        var resolution = ServiceLocator.viewportHandler.nativeResolution;
        _graphics.drawRect(cameraBounds.x, cameraBounds.y, resolution.x, resolution.y);
        
        for(var ind in this.lights)
        {
            this.lights[ind].draw(_graphics);
        }
    }
    
    addLight(_light)
    {
        this.lights.push(_light);
    }
    
    setAmbientLight(_color, _intensity)
    {
        this.clearColor = _color;
        this.clearAlpha = _intensity;
    }
}

class BaseLight
{
    constructor(_color = 0xFFFFFF, _intensity = 1.0)
    {
        this.color = _color;
        this.intensity = _intensity;
    }
    
    draw(_graphics)
    {
        console.error("Unimplemented draw function for:");
        console.error(this);
    }
    
    setFill(_graphics)
    {
        _graphics.beginFill(this.color, this.intensity);
    }
}

class spotLight extends BaseLight
{
    constructor(_position, _radius, _color, _intensity)
    {
        super(_color, _intensity);
        this.position = _position;
        this.radius = _radius;
    }
    
    draw(_graphics)
    {
        this.setFill(_graphics);
        _graphics.drawCircle(this.position.x, this.position.y, this.radius);
    }
}

class OvergroundLight extends BaseLight
{
    constructor(_height, _color, _intensity)
    {
        super(_color, _intensity);
        this.height = _height;
    }
    
    draw(_graphics)
    {
        this.setFill(_graphics);
        var cameraBounds = ServiceLocator.camera.getVisibleArea();
        var groundLevel = GROUND_LEVEL + 40;
        //if (cameraBounds.y < )
        var difference = groundLevel - cameraBounds.y;
        var resolution = ServiceLocator.viewportHandler.nativeResolution;

        if(difference > resolution.y)
        {
            difference = resolution.y;
        }
        
        _graphics.drawRect(cameraBounds.x, cameraBounds.y, resolution.x, groundLevel - cameraBounds.y);
    }
}