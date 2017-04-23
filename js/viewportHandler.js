class ViewportHandler
{
    constructor(_minAspectRatio, _maxAspectRatio)
    {
        this.minAspectRatio = _minAspectRatio;
        this.maxAspectRatio = _maxAspectRatio;
        
        var ratio = window.devicePixelRatio || 1;
        this.w = window.innerWidth * ratio;
        this.h = window.innerHeight * ratio;
        
        this.topOffset = 0;
        this.leftOffset = 0;
        
        var aspectRatio = this.w/this.h;
        if (aspectRatio < this.minAspectRatio)
        {
            var newH = this.w / this.minAspectRatio;
            this.topOffset = (this.h - newH) / 2;
            this.h = newH;
        }
        else if (aspectRatio > this.maxAspectRatio)
        {
            var newW = this.h * this.maxAspectRatio;
            this.leftOffset = (this.w - newW) / 2;
            this.w = newW;
        }
    }
    
    onGameCreation(_game)
    {        
        var gameCanvas = _game.canvas;
        gameCanvas.style.left = this.leftOffset + "px";
        gameCanvas.style.top = this.topOffset + "px";
    }
}