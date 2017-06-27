class InputManager
{
    constructor(_game)
    {
        this.bg;
        this.game = _game;
        this.directionGesture = new DirectionGesture(_game, this);
        this.playerDirectionGesture = new PlayerDirectionGesture(_game, this);
        this.tapGesture = new TapGesture(_game, this);
        this.drawGesture = new DrawGesture(_game, this);
    }
    
    static preload(_game)
    {
        PlayerDirectionGesture.preload(_game);
        TapGesture.preload(_game);
    }
    
    create(game)
    {
        this.up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    
        var nativeResolution = ServiceLocator.viewportHandler.nativeResolution;
        var offset = ServiceLocator.viewportHandler.getSceneOffset();

        this.bg = game.add.sprite(-offset.x, -offset.y);
        this.bg.scale.setTo(nativeResolution.x, nativeResolution.y);
        this.bg.inputEnabled = true;
        this.bg.input.priorityID = 0; // lower priority
        this.leftButton = {}
        this.leftButton.onDown = game.input.onDown;
        this.leftButton.lastTouched = performance.now();
        this.leftButton.getLastTouched = () => {
            return performance.now() - this.leftButton.lastTouched;
        }
        this.leftButton.onDown.add(this.handleTouch, this);
        
        this.bmd = game.add.graphics(-offset.x, -offset.y);
    }
    
    handleTouch()
    {
        this.leftButton.lastTouched = performance.now();
    }
    
    getBmd()
    {
        ServiceLocator.renderer.addToUI(this.bmd);
        return this.bmd;
    }
}
