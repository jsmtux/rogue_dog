function Background()
{
    this.layers = [];
    this.scale = 1.0;
}

Background.prototype.update = function()
{
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
