class Background
{
    constructor()
    {
    }
    
    static preload(_game)
    {
        _game.load.image('bg0', './img/background/layer-1.png');
        _game.load.image('bg1', './img/background/layer-2.png');
        _game.load.image('bg2', './img/background/under-layer-1.png');
    }
    
    create(_game, _layerDefinitions)
    {
        this.layers = [];
        this.scale = 1.0;
        
        for(var ind in _layerDefinitions)
        {
            var yOffset = _layerDefinitions[ind].yOffset || 0;
            this.layers.push(new Layer(_layerDefinitions[ind].name, _layerDefinitions[ind].speed, yOffset));
        }

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
}

class Layer
{
    constructor(_imageName, _speed, _yOffset)
    {
        this.imageName = _imageName;
        this.speed = _speed;
        this.yOffset = _yOffset;
    }
    
    create(_game)
    {
        var resolution = ServiceLocator.camera.getResolution();
        var renderer = ServiceLocator.renderer;
        
        this.imgA = _game.add.sprite(0, 0, this.imageName);
        this.imgB = _game.add.sprite(0, 0, this.imageName);
        renderer.addToScene(this.imgA);
        renderer.addToScene(this.imgB);

        this.imgA.y = resolution.y - this.imgA.height + this.yOffset;
        this.imgB.y = resolution.y - this.imgB.height + this.yOffset;
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