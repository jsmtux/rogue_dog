class BannerShow
{
    constructor(_game)
    {
        this.game = _game;
        ServiceLocator.registerListener(this.newBanner, this, "NewBannerMessage");
        
        this.sprite;
        this.timeout;
    }
    
    static preload(_game)
    {
        var path = "anim/"
        _game.load.atlas("attackAnimAtlas", path + "attack.png", path + "attack.json");
        _game.load.json("attackJSON", path + "attack.scon");
        _game.load.image('defend', './img/defend.png');
    }
    
    newBanner(_msg)
    {
        this.destroyCurrentBanner();
        switch(_msg.getMessageType())
        {
            case NewBannerMessage.Types.Attack:
                this.sprite = loadSpriter(this.game, "attackJSON", "attackAnimAtlas", "entity_000");
                this.sprite.animations.play();
                this.sprite.x = 400;
                this.sprite.y = 300;
                break;
            case NewBannerMessage.Types.Defend:
                this.sprite = this.game.add.sprite(100,100,'defend');
                break;
        }
        ServiceLocator.renderer.addToUI(this.sprite);
        this.timeout = setTimeout(() => this.destroyCurrentBanner(), 1200);
        
    }
    
    destroyCurrentBanner()
    {
        if (this.sprite)
        {
            this.sprite.destroy();
            clearTimeout(this.timeout);
        }
    }
}
