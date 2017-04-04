class StatsBar
{
    constructor()
    {
        this.sprite;
        this.spriteFill;
        this.mask;
    }
    
    setPercentage(_percentage)
    {
        if (this.mask !== undefined)
        {
            this.mask.destroy();
        }
        
        var width = (_percentage) * 142
        
        this.mask = game.add.graphics(20, 20);
        ServiceLocator.renderer.addToUI(this.mask);
        this.mask.beginFill(0x0000FF);
        this.mask.lineStyle(2, 0x0000FF, 1);
        this.mask.drawRect(0, 0, 50 + width, 300);
        
        this.spriteFill.mask = this.mask;
    }   
}

class HealthBar extends StatsBar
{
    static preload(_game)
    {
        _game.load.image('health_bar', './img/statBars/health_bar.png');
        _game.load.image('health_bar_fill', './img/statBars/health_bar_fill.png');
    }
    
    create()
    {
        var renderer = ServiceLocator.renderer;
        this.sprite = game.add.sprite(20, 20, 'health_bar', 0, renderer.uiGroup);
        ServiceLocator.renderer.addToUI(this.sprite);
        this.spriteFill = game.add.sprite(20, 20, 'health_bar_fill', 0, renderer.uiGroup);
        ServiceLocator.renderer.addToUI(this.spriteFill);
        this.setPercentage(100);
    }
}

class ShieldBar extends StatsBar
{
    static preload(_game)
    {
        _game.load.image('shield_bar', './img/statBars/shield_bar.png');
        _game.load.image('shield_bar_fill', './img/statBars/shield_bar_fill.png');
    }
    
    create()
    {
        this.sprite = game.add.sprite(20, 75, 'shield_bar');
        ServiceLocator.renderer.addToUI(this.sprite);
        this.spriteFill = game.add.sprite(20, 80, 'shield_bar_fill');
        ServiceLocator.renderer.addToUI(this.spriteFill);
        this.setPercentage(0);
    }
}

class EnergyBar extends StatsBar
{
    static preload(_game)
    {
        _game.load.image('energy_bar', './img/statBars/energy_bar.png');
        _game.load.image('energy_bar_fill', './img/statBars/energy_bar_fill.png');
    }
    
    create()
    {
        this.sprite = game.add.sprite(20, 75, 'energy_bar');
        ServiceLocator.renderer.addToUI(this.sprite);
        this.spriteFill = game.add.sprite(20, 80, 'energy_bar_fill');
        ServiceLocator.renderer.addToUI(this.spriteFill);
        this.setPercentage(0);
    }
}
