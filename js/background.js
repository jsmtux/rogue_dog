class Background
{
    constructor()
    {
        this.layers = [];
        this.scale = 1.0;
    }
    
    static preload(_game)
    {
        _game.load.image('bg1', './img/background/layer-1.png');
        _game.load.image('bg2', './img/background/layer-2.png');
        _game.load.image('bg3', './img/background/layer-3.png');
    }
    
    create(_game)
    {
        this.addLayer(_game, 'bg1', 0.2);
        this.addLayer(_game, 'bg2', 0.5);
        this.addLayer(_game, 'bg3', 1.0);
        
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
            var layer = this.layers[ind];
            
            if (layer.imgA.x < - layer.imgA.width)
            {
                layer.imgA.x = layer.imgB.x + layer.imgA.width;
            }
            if (layer.imgB.x < - layer.imgB.width)
            {
                layer.imgB.x = layer.imgA.x + layer.imgB.width;
            }
            layer.imgA.x -= distance * layer.speed;
            layer.imgB.x -= distance * layer.speed;
        }
    }
    
    addLayer(_game, _image, _speed)
    {
        var layer = {};
        layer.imgA = _game.add.sprite(0, 0, _image);
        if (this.layers.length == 0)
        {
            this.scale = resolution.y / layer.imgA.height;
        }
        layer.imgB = _game.add.sprite(0, 0, _image);
        
        layer.imgA.scale.setTo(this.scale, this.scale);
        layer.imgB.scale.setTo(this.scale, this.scale);
        layer.imgA.y = resolution.y - layer.imgA.height;
        layer.imgB.y = resolution.y - layer.imgB.height;
        layer.imgB.x = -layer.imgB.width;
        layer.speed = _speed;
        this.layers.push(layer);
    }
}
