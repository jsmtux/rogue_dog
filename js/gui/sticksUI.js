class SticksUI
{
    constructor(_number, _game)
    {
        this.number = _number;
        this.sticksGroup;
        this.game = _game;
        this.sticks = [];
        this.lastStickNumber = 0;
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
        var added1 = total === this.lastStickNumber + 1;
        for (var i = 0; i < this.number; i++)
        {
            var img;
            if (total > i)
            {
                img = "stick_icon";
                if (added1 && total === i + 1)
                {
                    var curStick = this.sticks[i];
                    var glow = this.game.add.sprite(curStick.x + curStick.width / 2, curStick.y + curStick.height / 1.5, "stick_icon", 0, this.sticksGroup);
                    this.sticksGroup.add(glow);
    	            glow.anchor.x = 0.5;
    	            glow.anchor.y = 0.5;
                    glow.tint = 0xFF8B00;
    	            var glowTween = this.game.add.tween(glow);
                    glowTween.to({ witdth: glow.width * 3, height: glow.width * 3, alpha:0}, 500, Phaser.Easing.Circular.Out);
                    glowTween.start();
                    glowTween.onComplete.add(() =>{
                        glow.destroy();
                    });
                }
            }
            else
            {
                img = "empty_stick_icon";
            }
            this.sticks[i].loadTexture(img);
        }
        this.lastStickNumber = total;
    }
}