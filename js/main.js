var WALKSPEED = 6;
var GROUND_LEVEL = 525;

var resolution = {x: 800, y: 600};

var game = new Phaser.Game(resolution.x, resolution.y, Phaser.AUTO, 'test', null, true, false);


game.state.add('Load', LoadState);
game.state.add('Main', MainState);
game.state.start('Load');
