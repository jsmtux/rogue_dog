class SticksUI
{
    constructor(_number, _game)
    {
        this.number = _number;
        this.sticksGroup;
        this.game = _game;
        this.sticks = []
    }
    
    static preload(_game)
    {
        _game.load.image("stick_icon", "img/ui/sticks/stick.png");
        _game.load.image("empty_stick_icon", "img/ui/sticks/stick_empty.png");
    }
    
    create(_group)
    {
        this.sticksGroup = this.game.add.group();
        this.sticksGroup.x = 150;
        _group.add(this.sticksGroup);
        var x = 10;
        var y = 10;
        
        for (var i = 0; i < this.number; i++)
        {
            this.sticks.push(this.game.add.sprite(x, y, "empty_stick_icon", 0, this.sticksGroup));
            x += 30;
        }

        ServiceLocator.registerListener(this.updateStickNumber, this, "StickNumberUpdated");
    }

    updateStickNumber(_msg)
    {
        var total = _msg.getNumber();
        for (var i = 0; i < this.number; i++)
        {
            var img;
            if (total > i)
            {
                img = "stick_icon";
            }
            else
            {
                img = "empty_stick_icon";
            }
            this.sticks[i].loadTexture(img);
        }
    }
}