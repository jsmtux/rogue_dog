function StatsBar()
{
    this.sprite;
    this.spriteFill;
    this.mask;
}

StatsBar.prototype.setPercentage = function(_percentage)
{
    if (this.mask != undefined)
    {
        this.mask.destroy();
    }
    
    var width = (_percentage) * 142
    
    this.mask = game.add.graphics(20, 20);
    this.mask.beginFill(0x0000FF);
    this.mask.lineStyle(2, 0x0000FF, 1);
    this.mask.drawRect(0, 0, 50 + width, 300);
    
    this.spriteFill.mask = this.mask;
}

function HealthBar()
{
}

HealthBar.prototype = new StatsBar();
HealthBar.prototype.constructor = HealthBar;

HealthBar.preload = function(_game)
{
    _game.load.image('health_bar', './img/statBars/health_bar.png');
    _game.load.image('health_bar_fill', './img/statBars/health_bar_fill.png');
}

HealthBar.prototype.create = function()
{
    this.sprite = game.add.sprite(20, 20, 'health_bar');
    this.spriteFill = game.add.sprite(20, 20, 'health_bar_fill');
    this.setPercentage(100);
}

function ShieldBar()
{
}

ShieldBar.prototype = new StatsBar();
ShieldBar.prototype.constructor = ShieldBar;

ShieldBar.preload = function(_game)
{
    _game.load.image('shield_bar', './img/statBars/shield_bar.png');
    _game.load.image('shield_bar_fill', './img/statBars/shield_bar_fill.png');
}

ShieldBar.prototype.create = function()
{
    this.sprite = game.add.sprite(20, 75, 'shield_bar');
    this.spriteFill = game.add.sprite(20, 80, 'shield_bar_fill');
    this.setPercentage(0);
}
