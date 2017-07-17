class DistanceMeterUI
{
    constructor()
    {
    }
    
    static preload(_game)
    {
        _game.load.image("meterBg", "img/bars/distance_meter_bg.png");
        _game.load.image("meterIndicator", "img/bars/distance_meter_indicator.png");
    }
    
    create(_game)
    {
        this.meterGroup = _game.add.group();
        ServiceLocator.renderer.addToUI(this.meterGroup);
        this.bg = _game.add.sprite(0, 0, 'meterBg', this.meterGroup);
        this.meterGroup.add(this.bg);
        this.bg.x = ServiceLocator.viewportHandler.resolution.x / 2 - this.bg.width / 2;
        this.bg.y = ServiceLocator.viewportHandler.resolution.y - 90;
        this.indicator = _game.add.sprite(0, 0, 'meterIndicator');
        this.meterGroup.add(this.indicator);
        this.indicator.x = ServiceLocator.viewportHandler.resolution.x / 2 - this.bg.width / 2;
        this.indicator.y = ServiceLocator.viewportHandler.resolution.y - 70;
        this.game = _game;
    }
    
    setPercentage(_percentage)
    {
        if (_percentage > 1.0)
        {
            _percentage = 1.0;
        }
        this.indicator.x = ServiceLocator.viewportHandler.resolution.x / 2 - this.bg.width / 2 + (this.bg.width - 50) * _percentage;
    }
    
    visible(_visible)
    {
        this.meterGroup.visible = _visible;
    }
}