function Background()
{
    this.layers = [];
    this.scale = 1.0;
}

Background.preload = function(_game)
{
    _game.load.image('bg1', './img/background/layer-1.png');
    _game.load.image('bg2', './img/background/layer-2.png');
    _game.load.image('bg3', './img/background/layer-3.png');
}

Background.prototype.create = function(_game, WALKSPEED)
{
    this.addLayer(_game, 'bg1', WALKSPEED / 5);
    this.addLayer(_game, 'bg2', WALKSPEED / 2);
    this.addLayer(_game, 'bg3', WALKSPEED);
    
    _game.updateSignal.add(this.update, this);
}

Background.prototype.update = function()
{
    if (this.paused || ServiceLocator.infoManager.shouldPause())
    {
        return;
    }

    for(ind in this.layers)
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
        layer.imgA.x -= layer.speed;
        layer.imgB.x -= layer.speed;
    }
}

Background.prototype.addLayer = function(_game, _image, _speed)
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

Background.prototype.setPaused = function(value)
{
    this.paused = value;
}
