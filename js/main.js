var GROUND_LEVEL = 525;

var viewportHandler = new ViewportHandler(new Phaser.Point(1200, 720), 4.0/3.0, 18.0/9.0);
ServiceLocator.initialize('viewportHandler', viewportHandler);

var game = new Phaser.Game(viewportHandler.resolution.x, viewportHandler.resolution.y, Phaser.WEBGL, 'container', null, true, false);

game.state.onStateChange.add(function()
{
    ServiceLocator.resetMessageListeners();
});

game.state.add('Init', InitState);
game.state.add('Menu', MenuState);
game.state.add('Load', LoadState);
game.state.add('Main', MainState);
game.state.start('Init');
