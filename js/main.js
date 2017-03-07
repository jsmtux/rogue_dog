var GROUND_LEVEL = 525;

var resolution = new Phaser.Point(800, 600);

var game = new Phaser.Game(resolution.x, resolution.y, Phaser.WEBGL, 'test', null, true, false);

game.state.add('Load', LoadState);
game.state.add('Main', MainState);
game.state.start('Load');
