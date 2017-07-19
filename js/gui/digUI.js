class DigUI
{
    constructor(_game)
    {
        this.group;
        this.game = _game;
        this.cards = [];
        this.listSize = 6;
        this.shown = false;
        this.speed = 4;
    }
    
    static preload(_game)
    {
        _game.load.image("dig_bg", "img/ui/dig/back.png");
        _game.load.image("dig_fg", "img/ui/dig/front.png");
        _game.load.image("dig_card_attack", "img/ui/dig/attack_card.png");
        _game.load.image("dig_card_enemy", "img/ui/dig/enemy_card.png");
    }
    
    create()
    {
        this.group = this.game.add.group();
        ServiceLocator.renderer.addToUI(this.group);
        this.group.x = 270;
        this.group.y = 540;
        
        this.game.add.sprite(0, 0, "dig_bg", 0, this.group);
        this.game.add.sprite(0, 0, "dig_fg", 0, this.group);
        
        var mask = this.game.add.graphics(0, 0, this.group);

        mask.beginFill(0xffffff);
        mask.drawRect(5, 6, 30, 32);
        
        var cur_x = 0;
        for (var i = 0; i < 3; i++)
        {
            var card = this.game.add.sprite(cur_x, 5, "dig_card_attack");
            card.mask = mask;
            this.group.add(card);
            cur_x += card.width;
            this.cards.push(card);
        }
        this.hide();
    }
    
    show(_ratio)
    {
        this.list = [];
        for(var i = 0; i < this.listSize; i++)
        {
            this.list.push(Math.random() < _ratio);
            if (i >= this.listSize - 3)
            {
                this.cards[i - 3].loadTexture(this.list[i] ? "dig_card_attack" : "dig_card_enemy");
            }
        }
        this.group.visible = true;
        ServiceLocator.inputManager.leftButton.onDown.add(this.clicked, this);
    }
    
    hide()
    {
        this.group.visible = false;
        ServiceLocator.inputManager.leftButton.onDown.remove(this.clicked, this);
    }
    
    update()
    {
        if (!this.group.visible)
        {
            return;
        }
        var width = this.cards[0].width;
        for(var ind in this.cards)
        {
            this.cards[ind].x -= this.speed;
        }
        if (this.cards[0].x < -width)
        {
            var card = this.cards.shift();
            card.x = this.cards[1].x + width;
            card.loadTexture(this.list[0] ? "dig_card_attack" : "dig_card_enemy");
            this.list.push(this.list.shift());
            this.cards.push(card);
        }
    }
    
    clicked()
    {
        var width = this.cards[0].width;
        console.log(this.cards[1].frameName);
        this.cards[1].x = 4;
        this.cards[0].x = 4 - width;
        this.cards[2].x = 4 + width;
        this.speed = 0;
    }
}
