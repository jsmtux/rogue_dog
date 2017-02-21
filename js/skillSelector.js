class SkillSelector
{
    constructor()
    {
        this.sprite;
        this.skillselector;
        this.spriteGroup;
        this.direction = 1;
    }
    
    static preload(_game)
    {
        _game.load.image('skillbar', './img/skillbar/skillbar.png');
        _game.load.image('skillselector', './img/skillbar/skillselector.png');
    }
    
    create()
    {
        this.spriteGroup = game.add.group();
        ServiceLocator.guiManager.addToUI(this.spriteGroup);
        this.sprite = game.add.sprite(0, 0, 'skillbar');
        this.spriteGroup.add(this.sprite);
        this.skillselector = game.add.sprite(10, 0, 'skillselector');
        this.spriteGroup.add(this.skillselector);
        
    }
    
    setPosition(_x, _y)
    {
        this.spriteGroup.x = _x;
        this.spriteGroup.y = _y;
    }
    
    update()
    {
        this.skillselector.x += this.direction * 5;
        if (this.skillselector.x > 150 || this.skillselector.x < 10)
        {
            this.direction *= -1;
        }
    }
    
    getSuccess()
    {
        return this.skillselector.x > 85 && this.skillselector.x < 108;
    }
    
    reset()
    {
        this.skillselector.destroy();
        this.sprite.destroy();
        this.skillselector = this.sprite = undefined;
    }
    
    isActive()
    {
        return this.sprite != undefined;
    }
}
