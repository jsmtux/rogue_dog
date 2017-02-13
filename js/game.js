var resolution = {x: 800, y: 600};

var game = new Phaser.Game(resolution.x, resolution.y, Phaser.AUTO, 'test', null, true, false);


game.state.add('Load', BasicGame.Load);
game.state.add('Main', BasicGame.Main);
game.state.start('Load');