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
            curCard.setPosition(new Phaser.Point(50 + 300 * ind,50));
            curCard.setHandler(function(_curCard){return function(){self.cardChosen(_curCard);}}(curCard));
        }
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