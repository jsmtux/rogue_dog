class GearCardCompletedMode extends GameMode
{
    constructor(_game, _player)
    {
        super();
        this.finished = false;
    }
    
    static preload(_game)
    {
        loadSpriterFiles(_game, "join_animation");
    }
    
    startMode(_cardList)
    {
        this.joinSprite = loadSpriter(this.game, "join_animationJSON", "join_animationAtlas", "entity_000");
        ServiceLocator.renderer.addToUI(this.joinSprite);
        this.joinSprite.animations.play("NewAnimation_000");
        this.joinSprite.x = resolution.x /2;
        this.joinSprite.y = resolution.y /2;
        this.joinSprite.onFinish.add(this.animationFinished, this);
    }
    
    create(_game)
    {
        this.game = _game;
    }
    
    update()
    {
    }
    
    animationFinished()
    {
        this.joinSprite.visible = false;
        var curCard = new MagicianHatCard();
        curCard.create(this.game);
        curCard.show();
        curCard.setPosition(new Phaser.Point(resolution.x /2, resolution.y /2));
        curCard.setAnchor(new Phaser.Point(0.0, 0.5));
        curCard.setYAngle(Math.PI);
        curCard.setHandler((card) => {card.flip(this.cardFlipped, this)});
        this.card = curCard;
    }
    
    cardFlipped()
    {
        this.card.setHandler((card) => {
            card.apply(this.game.player);
            ServiceLocator.publish(new GearCardCollectedMessage());
            this.card.destroy();
        });
    }
    
    isFinished()
    {
        return this.finished;
    }
}

GearCardCompletedMode.NAME = "GearCardCompletedMode";