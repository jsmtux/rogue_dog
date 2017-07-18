class HeartsUI
{
    constructor(_number, _game)
    {
        this.number = _number;
        this.heartsGroup;
        this.game = _game;
        this.hearts = [];
    }
    
    static preload(_game)
    {
        _game.load.image("heart_icon_1", "img/ui/hearts/full.png");
        _game.load.image("heart_icon_0_75", "img/ui/hearts/3quarters.png");
        _game.load.image("heart_icon_0_5", "img/ui/hearts/half.png");
        _game.load.image("heart_icon_0_25", "img/ui/hearts/quarter.png");
        _game.load.image("heart_icon_0", "img/ui/hearts/empty.png");
    }
    
    create(_group)
    {
        this.heartsGroup = this.game.add.group();
        _group.add(this.heartsGroup);
        var x = 10;
        var y = 10;
        
        for (var i = 0; i < this.number; i++)
        {
            this.hearts.push(this.game.add.sprite(x, y, "heart_icon_1", 0, this.heartsGroup));
            x += 30;
        }

        ServiceLocator.registerListener(this.heartNumberUpdated, this, "HeartNumberUpdated");
    }

    heartNumberUpdated(_msg)
    {
        var total = _msg.getNumber();
        for (var i = 0; i < this.number; i++)
        {
            var img;
            if (total >= 4)
            {
                img = "heart_icon_1";
            }
            else if (total >= 3)
            {
                img = "heart_icon_0_75";
            }
            else if (total >= 2)
            {
                img = "heart_icon_0_5";
            }
            else if (total >= 1)
            {
                img = "heart_icon_0_25";
            }
            else
            {
                img = "heart_icon_0";
            }
            this.hearts[i].loadTexture(img);
            total -= 4;
        }
    }
}