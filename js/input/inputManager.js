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
        this.leftButton.onDown = this.bg.events.onInputDown;
    }
}
