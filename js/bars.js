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
        
        this.mask = game.add.graphics(0, 0);
        ServiceLocator.renderer.addToUI(this.mask);
        this.mask.beginFill(0x0000FF);
        this.mask.lineStyle(2, 0x0000FF, 1);
        this.mask.drawRect(0, 0, 50 + width, 300);
        
        this.spriteFill.mask = this.mask;
    }
    
    setVisible(_visible)
    {
        this.sprite.visible = _visible;
        this.spriteFill.visible = _visible;
    }
}

class HealthBar extends StatsBar
{
    static preload(_game)
    {
        _game.load.image('health_bar', './img/statBars/health_bar.png');
        _game.load.image('health_bar_fill', './img/statBars/health_bar_fill.png');
    }
    
    create(_group)
    {
        var renderer = ServiceLocator.renderer;
        this.sprite = game.add.sprite(20, 0, 'health_bar', 0);
        ServiceLocator.renderer.addToUI(this.sprite);
        this.spriteFill = game.add.sprite(20, 0, 'health_bar_fill', 0);
        ServiceLocator.renderer.addToUI(this.spriteFill);
        this.setPercentage(100);
        ServiceLocator.registerListener(this.updateHealthPercentage, this, "HealthPercentageUpdated");
    }
    
    updateHealthPercentage(_msg)
    {
        this.setPercentage(_msg.getPercentage());
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
