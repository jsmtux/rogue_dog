class CombatLootMode extends GameMode
{
    constructor(_game, _player)
    {
        super();
        this.finished = false;
        this.game = _game;
        this.cardList;
        this.player = _player;
    }

    update()
    {
    }

    getNextMode()
    {
        if (this.finished)
        {
            return "WalkManager";
        }
    }
    
    startMode(_cardList)
    {
        this.finished = false;
        this.cardList = _cardList;
        var self = this;
        for (var ind in this.cardList)
        {
            var curCard = new this.cardList[ind]();
            curCard.create(this.game);
            curCard.show();
            curCard.setPosition(new Phaser.Point(150 + 300 * ind,50));
            curCard.setYAngle(Math.PI);
            curCard.setHandler((card) => {card.flip(this.cardFlipped, this)});
        }
    }
    
    cardFlipped(_card)
    {
        _card.setHandler(this.cardChosen, this);
    }
    
    cardChosen(_card)
    {
        _card.apply({'player':this.player});
        _card.hide();
        this.cardList.splice(this.cardList.indexOf(_card), 1);
        if (this.cardList.length === 0)
        {
            this.finished = true;
        }
    }
}

CombatLootMode.NAME = "CombatLootMode";