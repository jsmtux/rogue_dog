class Background
{
    constructor()
    {
        this.layers = [];
        this.scale = 1.0;
        this.addLayer('./img/background/layer-1.png', 0.2);
        this.addLayer('./img/background/layer-2.png', 0.5);
    }
    
    static preload(_game)
    {
        for (var ind in Background.LayersToPreload)
        {
            //TODO: use real tally and not ind
            _game.load.image('bg' + ind, Background.LayersToPreload[ind]);
        }
        Background.LayersToPreload = [];
    }
    
    create(_game)
    {
        for (var ind in this.layers)
        {
            this.layers[ind].create(_game);
        }
        _game.updateSignal.add(this.update, this);
        this.prevX = ServiceLocator.camera.getPosition().x;
    }
    
    update()
    {
        var curX = ServiceLocator.camera.getPosition().x;
        var distance = curX - this.prevX;
        this.prevX = curX;
    
        for(var ind in this.layers)
        {
            this.layers[ind].cameraMoved(distance);
        }
    }
    
    addLayer(_path, _speed)
    {
        this.layers.push(new Layer(_path, _speed, this.layers.length));
        Background.LayersToPreload.push(_path);
    }
}

Background.LayersToPreload = [];

class Layer
{
    constructor(_path, _speed, _index)
    {
        this.path = _path;
        this.speed = _speed;
        this.index = _index;
    }
    
    create(_game)
    {
        var resolution = ServiceLocator.camera.getResolution();
        
        var path = 'bg' + this.index;
        
        this.imgA = _game.add.sprite(0, 0, path);
        if (!Layer.scale)
        {
            Layer.scale = resolution.y / this.imgA.height;
        }
        this.imgB = _game.add.sprite(0, 0, path);
                
        this.imgA.scale.setTo(Layer.scale, Layer.scale);
        this.imgB.scale.setTo(Layer.scale, Layer.scale);
        this.imgA.y = resolution.y - this.imgA.height;
        this.imgB.y = resolution.y - this.imgB.height;
        this.imgB.x = this.imgA.width;        
    }
    
    cameraMoved(_distance)
    {
        var visibleArea = ServiceLocator.camera.getVisibleArea();
        if (this.imgA.x + this.imgA.width < visibleArea.x)
        {
            this.imgA.x = this.imgB.x + this.imgB.width;
        }
        if (this.imgB.x + this.imgB.width< visibleArea.x)
        {
            this.imgB.x = this.imgA.x + this.imgA.width;
        }
        this.imgA.x += _distance * (1-this.speed);
        this.imgB.x += _distance * (1-this.speed);
    }
}

Layer.scale = undefined;