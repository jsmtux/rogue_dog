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
        _game.load.image("LootModeLabel", "img/mode_labels/loot.png");
    }
    
    create(_group)
    {
        this.sprite = this.game.add.sprite(0, -30, 'JumpModeLabel');
        _group.add(this.sprite);
        this.group = _group;
        ServiceLocator.registerListener(this.newGameMode, this, "NewGameModeMessage");
    }
    
    newGameMode(_msg)
    {
        var textureName;
        switch(_msg.getMode())
        {
            case GameMode.visibleTypes.ATTACK:
                textureName = 'AttackModeLabel';
                break;
            case GameMode.visibleTypes.DEFEND:
                textureName = 'DefendModeLabel';
                break;
            case GameMode.visibleTypes.JUMP:
                textureName = 'JumpModeLabel';
                break;
            case GameMode.visibleTypes.LOOT:
                textureName = 'LootModeLabel';
                break;
        }
        this.newSprite = this.game.add.sprite(0,0, textureName, this.group);
        this.newSprite.x = ServiceLocator.viewportHandler.resolution.x - 50 - this.newSprite.width;
        this.newSprite.y = -30;
        this.group.add(this.newSprite);
        
        var move = this.game.add.tween(this.newSprite);

        move.to({ y: 10 }, 500, Phaser.Easing.Bounce.Out);
        move.onComplete.add(() => {this.sprite.destroy(); this.sprite = this.newSprite; this.newSprite = undefined;});
        move.start();
        
        this.game.add.tween(this.sprite).to( { alpha: 0 }, 400, "Linear", true);
    }
}