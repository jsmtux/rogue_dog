class InputManager
{
    constructor(_game)
    {
        this.bg;
        this.game = _game;
        this.directionGesture = new DirectionGesture(_game, this);
        this.drawGesture = new DrawGesture(_game, this);
        this.skillSelector = new SkillSelector(_game);
    }
    
    preload(_game)
    {
        SkillSelector.preload(game);
    }
    
    create(game)
    {
        this.up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    
        this.bg = game.add.sprite(0, 0);
        this.bg.scale.setTo(resolution.x, resolution.y);
        this.bg.inputEnabled = true;
        this.bg.input.priorityID = 0; // lower priority
        this.leftButton = {}
        this.leftButton.onDown = game.input.onDown;
        this.leftButton.lastTouched = performance.now();
        this.leftButton.getLastTouched = () => {
            return performance.now() - this.leftButton.lastTouched;
        }
        this.leftButton.onDown.add(this.handleTouch, this);
        
        this.bmd = game.add.graphics(0, 0);
    }
    
    handleTouch()
    {
        this.leftButton.lastTouched = performance.now();
    }
    
    getBmd()
    {
        return this.bmd;
    }
}
