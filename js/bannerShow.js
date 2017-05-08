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
        _game.load.image('attack', './img/attack.png');
        _game.load.image('defend', './img/defend.png');
    }
    
    newBanner(_msg)
    {
        this.destroyCurrentBanner();
        switch(_msg.getMessageType())
        {
            case NewBannerMessage.Types.Attack:
                this.sprite = this.game.add.sprite(100,100,'attack');
                break;
            case NewBannerMessage.Types.Defend:
                this.sprite = this.game.add.sprite(100,100,'defend');
                break;
        }
        ServiceLocator.renderer.addToUI(this.sprite);
        this.timeout = setTimeout(() => this.destroyCurrentBanner(), 1000);
        
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
