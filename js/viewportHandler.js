class ViewportHandler
{
    constructor(_nativeResolution, _minAspectRatio, _maxAspectRatio)
    {
        this.minAspectRatio = _minAspectRatio;
        this.maxAspectRatio = _maxAspectRatio;
        this.nativeResolution = _nativeResolution;
        
        this.topOffset = 0;
        this.leftOffset = 0;
        
        var nativeAspectRatio = this.nativeResolution.x / this.nativeResolution.y;
        
        var ratio = window.devicePixelRatio || 1;
        var windowW = window.innerWidth;
        var windowH = window.innerHeight;
        var aspectRatio = windowW / windowH;

        if (aspectRatio < this.minAspectRatio)
        {
            aspectRatio = this.minAspectRatio;
        }
        else if (aspectRatio > this.maxAspectRatio)
        {
            aspectRatio = this.maxAspectRatio;
        }
        
        this.resolution = new Phaser.Point(this.nativeResolution.x, this.nativeResolution.y);
        
        this.scale = 1.0;
        
        if (aspectRatio < nativeAspectRatio)
        {
            this.resolution.x = this.nativeResolution.y * aspectRatio;
            this.scale = windowW / this.resolution.x;
        }
        else if (aspectRatio > nativeAspectRatio)
        {
            this.resolution.y = this.nativeResolution.x / aspectRatio;
            this.scale = windowH / this.resolution.y;
        }
        
        this.leftOffset = (windowW - this.resolution.x * this.scale) / 2;
        this.topOffset = (windowH - this.resolution.y * this.scale) / 2;
    }
    
    onGameCreation(_game)
    {        
        var gameCanvas = _game.canvas;
        gameCanvas.style.left = this.leftOffset + "px";
        gameCanvas.style.top = this.topOffset + "px";
        _game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        _game.scale.setMinMax(this.resolution.x * this.scale, this.resolution.y * this.scale, this.resolution.x * this.scale, this.resolution.y * this.scale);
    }
    
    getSceneOffset()
    {
        return new Phaser.Point((this.nativeResolution.x - this.resolution.x) / 2, (this.nativeResolution.y - this.resolution.y) / 2);
    }
}