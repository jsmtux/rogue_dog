class CombatLootMode extends GameMode
{
    constructor(_game, _player)
    {
        super();
        this.finished = false;
        this.game = _game;
        this.cardList;
        this.player = _player;
        
        this.flipCard = _game.add.audio('flipCardAudio');
        this.goodCardAudio = _game.add.audio('goodCardAudio');
        this.badCardAudio = _game.add.audio('badCardAudio');
    }

    update()
    {
    }
    
    static preload(_game)
    {
        _game.load.audio('goodCardAudio', 'sounds/card_good.wav');
        _game.load.audio('badCardAudio', 'sounds/card_bad.wav');
        _game.load.audio('flipCardAudio', 'sounds/card_flip.wav');
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
            curCard.setHandler((card) => {this.flipCard.play(), card.flip(this.cardFlipped, this)});
        }
    }
    
    isFinished()
    {
        return this.finished;
    }
    
    cardFlipped(_card)
    {
        _card.setHandler(this.cardChosen, this);
        
        var type = _card.getType();
        if (type === Card.Type.ITEM)
        {
            this.goodCardAudio.play();
        }
        else if (type === Card.Type.TRAP)
        {
            this.badCardAudio.play();
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