function InputManager()
{
    this.bg;
}

InputManager.prototype.create = function(game)
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