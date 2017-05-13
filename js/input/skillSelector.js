class SkillSelector
{
    constructor(_game)
    {
        this.sprite;
        this.skillselector;
        this.spriteGroup;
        this.direction = 1;
        this.game = _game;
    }
    
    static preload(_game)
    {
        _game.load.image('skillbar', './img/skillbar/skillbar.png');
        _game.load.image('skillselector', './img/skillbar/skillselector.png');
    }
    
    add()
    {
        this.spriteGroup = this.game.add.group();
        ServiceLocator.renderer.addToOverlay(this.spriteGroup);
        this.sprite = this.game.add.sprite(0, 0, 'skillbar');
        this.spriteGroup.add(this.sprite);
        this.skillselector = this.game.add.sprite(10, 0, 'skillselector');
        this.spriteGroup.add(this.skillselector);
        
        this.game.updateSignal.add(this.update, this);
    }
    
    remove()
    {
        this.skillselector.destroy();
        this.sprite.destroy();
        this.skillselector = this.sprite = undefined;
        
        this.game.updateSignal.remove(this.update, this);
    }
    
    setPosition(_x, _y)
    {
        this.spriteGroup.x = _x;
        this.spriteGroup.y = _y;
    }
    
    update()
    {
        this.skillselector.x += this.direction * 10;
        if (this.skillselector.x > 270 || this.skillselector.x < 0)
        {
            this.direction *= -1;
        }
    }
    
    getCurrentPrecentage()
    {
        var ret = 1 - Math.abs(this.skillselector.x - 135) / 135;
        return ret;
    }
    
    sendSignal(_msg)
    {
        ServiceLocator.publish(new SkillSelectorResultMessage(this.getCurrentPrecentage(), _msg.getEnemy()));
    }
}
