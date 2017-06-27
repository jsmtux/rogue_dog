class GameModeUI
{
    constructor(_game)
    {
        this.game = _game;
        this.currentGameMode = 0;
    }
    
    static preload(_game)
    {
        _game.load.image("AttackModeLabel", "img/mode_labels/attack.png");
        _game.load.image("DefendModeLabel", "img/mode_labels/defend.png");
        _game.load.image("JumpModeLabel", "img/mode_labels/jump.png");
        _game.load.image("EscapeModeLabel", "img/mode_labels/escape.png");
        _game.load.image("LootModeLabel", "img/mode_labels/loot.png");
    }
    
    create()
    {
        this.sprite = this.game.add.sprite(100, 100, 'JumpModeLabel');
        this.sprite.x = ServiceLocator.viewportHandler.resolution.x - 50 - this.sprite.width;
        this.sprite.y = 15;
        ServiceLocator.renderer.addToUI(this.sprite);
        ServiceLocator.registerListener(this.newGameMode, this, "NewGameModeMessage");
    }
    
    newGameMode(_msg)
    {
        switch(_msg.getMode())
        {
            case GameMode.visibleTypes.ATTACK:
                this.sprite.loadTexture('AttackModeLabel');
                break;
            case GameMode.visibleTypes.DEFEND:
                this.sprite.loadTexture('DefendModeLabel');
                break;
            case GameMode.visibleTypes.JUMP:
                this.sprite.loadTexture('JumpModeLabel');
                break;
            case GameMode.visibleTypes.ESCAPE:
                this.sprite.loadTexture('EscapeModeLabel');
                break;
            case GameMode.visibleTypes.LOOT:
                this.sprite.loadTexture('LootModeLabel');
                break;
        }
        this.sprite.x = ServiceLocator.viewportHandler.resolution.x - 50 - this.sprite.width;
        this.sprite.y = 15;
    }
}