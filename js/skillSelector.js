
function SkillSelector()
{
    this.sprite;
    this.skillselector;
    this.spriteGroup;
    this.direction = 1;
}

SkillSelector.preload = function(_game)
{
    _game.load.image('skillbar', './img/skillbar/skillbar.png');
    _game.load.image('skillselector', './img/skillbar/skillselector.png');
}

SkillSelector.prototype.create = function()
{
    this.spriteGroup = game.add.group();
    this.sprite = game.add.sprite(0, 0, 'skillbar');
    this.skillselector = game.add.sprite(10, 0, 'skillselector');
    this.sprite.addChild(this.skillselector);
}

SkillSelector.prototype.update = function()
{
    this.skillselector.x += this.direction * 5;
    if (this.skillselector.x > 150 || this.skillselector.x < 10)
    {
        this.direction *= -1;
    }
}

SkillSelector.prototype.getSuccess = function()
{
    return this.skillselector.x > 85 && this.skillselector.x < 108;
}

SkillSelector.prototype.reset = function()
{
    this.skillselector.destroy();
    this.sprite.destroy();
    this.skillselector = this.sprite = undefined;
}

SkillSelector.prototype.isActive = function()
{
    return this.sprite != undefined;
}
