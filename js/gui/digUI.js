class DigUI
{
    constructor(_game)
    {
        this.group;
        this.game = _game;
        this.cardSprites = [];
        this.cardConstructors = [];
        this.cards = [];
        this.listSize = 6;
        this.shown = false;
        this.speed = 3.5;
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
            this.cardSprites.push(card);
        }
        this.hide();
    }
    
    show()
    {
        this.cards = [];
        for(var i = 0; i < this.listSize; i++)
        {
            var cardClass = ServiceLocator.cardManager.wildDeck.getRandomCard(false);
            var card = new cardClass();
            this.cards.push(card);
            if (i >= this.listSize - 3)
            {
                this.cardSprites[i - 3].loadTexture(this.cards[i].getType() === Card.Type.ITEM ? "dig_card_attack" : "dig_card_enemy");
                this.cardConstructors[i - 3] = this.cards[i].constructor;
            }
        }
        this.group.visible = true;
        ServiceLocator.inputManager.leftButton.onDown.add(this.clicked, this);
    }
    
    hide()
    {
        this.group.visible = false;
    }
    
    update()
    {
        if (!this.group.visible)
        {
            return;
        }
        var width = this.cardSprites[0].width;
        for(var ind in this.cardSprites)
        {
            this.cardSprites[ind].x -= this.speed;
        }
        if (this.cardSprites[0].x < -width)
        {
            var card = this.cardSprites.shift();
            card.x = this.cardSprites[1].x + width;
            card.loadTexture(this.cards[0].getType() === Card.Type.ITEM ? "dig_card_attack" : "dig_card_enemy");
            
            this.cardConstructors.shift();
            this.cardConstructors.push(this.cards[0].constructor);
            
            this.cards.push(this.cards.shift());
            this.cardSprites.push(card);
        }
    }
    
    clicked()
    {
        var width = this.cardSprites[0].width;
        console.log(this.cardSprites[1].frameName);
        this.cardSprites[1].x = 4;
        this.cardSprites[0].x = 4 - width;
        this.cardSprites[2].x = 4 + width;
        var speed = this.speed;
        this.speed = 0;
        ServiceLocator.inputManager.leftButton.onDown.remove(this.clicked, this);
        setTimeout(() =>{
            this.speed = speed;
            this.hide();
            
            ServiceLocator.cardManager.wildDeck.removeOneCard(this.cardConstructors[1].ID);
            ServiceLocator.publish(new WildcardSelected(this.cardConstructors[1]));
        }, 500);
    }
}
