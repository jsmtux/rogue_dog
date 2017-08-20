class Background
{
    constructor()
    {
    }
    
    static preload(_game)
    {
        _game.load.image('layer0', './img/background/layer0.png');
        _game.load.image('layer1', './img/background/layer1.png');
        _game.load.image('layer2', './img/background/layer2.png');
        _game.load.image('bg2', './img/background/under-layer-1.png');
        _game.load.image('cloud0', './img/background/cloud0.png');
        _game.load.image('cloud1', './img/background/cloud1.png');
        _game.load.image('cloud2', './img/background/cloud2.png');
    }
    
    create(_game)
    {
        var layerDefinitions = [
            {'name':'layer0', 'speed':0.1, 'yOffset':-40},
            {'name':'layer1', 'speed':0.5, 'yOffset':200},
            {'name':'layer2', 'speed':0.55, 'yOffset':350},
            {'name':'bg2', 'speed':0.8, 'yOffset':550}];
        
        this.layers = [];
        this.scale = 1.0;
        
        this.objects = [];
        
        for(var ind in layerDefinitions)
        {
            var yOffset = layerDefinitions[ind].yOffset || 0;
            this.layers.push(new Layer(layerDefinitions[ind].name, layerDefinitions[ind].speed, yOffset));
        }

        for (var ind in this.layers)
        {
            this.layers[ind].create(_game);
            if (ind === '0')
            {
                this.objectsGroup = _game.add.group();
                ServiceLocator.renderer.addToScene(this.objectsGroup);
            }
        }
        
        var cloud0Object = new BackgroundObject('cloud0', -0.10, 0.15, [0, 200], 15000);
        cloud0Object.create(_game, this.objectsGroup);
        this.objects.push(cloud0Object);
        var cloud0Object = new BackgroundObject('cloud1', -0.05, 0.18, [0, 200], 15000);
        cloud0Object.create(_game, this.objectsGroup);
        this.objects.push(cloud0Object);
        var cloud0Object = new BackgroundObject('cloud2', -0.22, 0.22, [0, 200], 15000);
        cloud0Object.create(_game, this.objectsGroup);
        this.objects.push(cloud0Object);
        
        ServiceLocator.updateSignal.add(this.update, this);
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
        
        for (var ind in this.objects)
        {
            this.objects[ind].update(distance);
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
        var resolution = ServiceLocator.viewportHandler.nativeResolution;
        var renderer = ServiceLocator.renderer;
        
        this.imgA = _game.add.sprite(0, 0, this.imageName);
        this.imgB = _game.add.sprite(0, 0, this.imageName);
        renderer.addToScene(this.imgA);
        renderer.addToScene(this.imgB);

        this.imgA.y = this.yOffset;
        this.imgB.y = this.yOffset;
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

class BackgroundObject
{
    constructor(_imgName, _speed, _speedRatio, _positionInterval, _meanTime)
    {
        this.imgName = _imgName;
        this.positionInterval = _positionInterval;
        this.meanTime = _meanTime;
        this.nextShown = performance.now() + _meanTime * Math.random() * 2;
        this.speed = _speed;
        this.speedRatio = _speedRatio;
    }
    
    create(_game, _objectGroup)
    {
        this.sprite = _game.add.sprite(0, 0, this.imgName);
        _objectGroup.add(this.sprite);
        this.sprite.visible = false;
    }
    
    update(_distance)
    {
        if(this.sprite.visible)
        {
            var visibleArea = ServiceLocator.camera.getVisibleArea();
            if (this.sprite.x + this.sprite.width < visibleArea.x)
            {
                this.sprite.visible = false;
                this.nextShown = performance.now() + this.meanTime * Math.random();
            }
            this.sprite.x += _distance * (1 - this.speedRatio) + this.speed;
        }
        else
        {
            if (performance.now() > this.nextShown)
            {
                var visibleArea = ServiceLocator.camera.getVisibleArea();
                this.sprite.x = visibleArea.x + visibleArea.width;
                this.sprite.y = this.positionInterval[0] + (this.positionInterval[1] - this.positionInterval[0]) * Math.random();
                this.sprite.visible = true;
            }
        }
    }
}