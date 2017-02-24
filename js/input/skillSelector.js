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
    
    add(_function, _context)
    {
        this.spriteGroup = this.game.add.group();
        ServiceLocator.guiManager.addToUI(this.spriteGroup);
        this.sprite = this.game.add.sprite(0, 0, 'skillbar');
        this.spriteGroup.add(this.sprite);
        this.skillselector = this.game.add.sprite(10, 0, 'skillselector');
        this.spriteGroup.add(this.skillselector);

        this.cbFunction = _function;
        this.cbContext = _context;
        
        this.game.updateSignal.add(this.update, this);
        
        ServiceLocator.inputManager.leftButton.onDown.add(this.sendSignal, this);
    }
    
    remove(_function, _cont)
    {
        this.skillselector.destroy();
        this.sprite.destroy();
        this.skillselector = this.sprite = undefined;
        
        this.game.updateSignal.remove(this.update, this);
        ServiceLocator.inputManager.leftButton.onDown.remove(this.sendSignal, this);
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
    
    sendSignal()
    {
        var success = this.skillselector.x > 85 && this.skillselector.x < 108;
        this.cbFunction.call(this.cbContext, success);
    }
}