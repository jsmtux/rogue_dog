function MainState(game)
{
    this.game = game;
    
    this.gameModes = {};
    this.currentGameMode;
};

MainState.prototype.preload = function ()
{
    this.game.load.image('attack', './img/attack.png');
    this.game.load.image('defend', './img/defend.png');
    
}

MainState.prototype.create = function ()
{
    this.statePaused = false;

    this.updateSignal = new Phaser.Signal();

    this.player = new DogPlayer();
    
    ServiceLocator.initialize('difficultyManager', new DifficultyManager());
    ServiceLocator.initialize('camera', new Camera());
    ServiceLocator.initialize('infoManager', new InfoManager(this));
    ServiceLocator.initialize('combatManager', new CombatManager(this, this.player));
    ServiceLocator.initialize('walkManager', new WalkManager(this, this.player));
    ServiceLocator.initialize('inputManager', new InputManager(this));
    ServiceLocator.initialize('animationManager', new AnimationManager());
    ServiceLocator.initialize('lighting', new Lighting());
    ServiceLocator.initialize('renderer', new Renderer(this));
    ServiceLocator.initialize('cardManager', new CardManager(this));
    ServiceLocator.initialize('inGameHelper', new InGameHelper(this));

    this.game.world.setBounds(0, 0, 192000, 192000);

    ServiceLocator.renderer.create(this);
    ServiceLocator.inputManager.create(this);
    ServiceLocator.guiManager.create(this);
    ServiceLocator.infoManager.create();
    ServiceLocator.camera.create(this, this.player);
    ServiceLocator.walkManager.create(this);
    ServiceLocator.difficultyManager.create();
    ServiceLocator.inGameHelper.create();

    this.player.create(this);
    
    ServiceLocator.guiManager.lostUI.addCallback('reloadButton', 'click', 'reload');
    ServiceLocator.guiManager.lostUI.addCallback('backMenuButton', 'click', 'back');
    ServiceLocator.guiManager.lostUI.registerCbReceiver(this.handleUI, this)
    
    ServiceLocator.lighting.addLight(new OvergroundLight(GROUND_LEVEL - 50));
    
    this.currentGameMode = undefined;
    this.addGameMode(ServiceLocator.walkManager);
    this.addGameMode(ServiceLocator.combatManager);
    this.addGameMode(new CombatLootMode(this, this.player));
}

MainState.prototype.addGameMode = function(_mode)
{
    if (!this.currentGameMode)
    {
        this.currentGameMode = _mode;
        this.currentGameMode.startMode();
    }
    this.gameModes[_mode.getModeName()] = _mode;
}

MainState.prototype.update = function ()
{
    this.updateSignal.dispatch();
    if (this.statePaused)
    {
        return;
    }
    
    this.currentGameMode.update();
    var nextMode = this.currentGameMode.getNextMode();
    if (nextMode)
    {
        this.currentGameMode.finishMode();
        var gameModeArguments = this.currentGameMode.getNextModeArguments();
        this.currentGameMode = this.gameModes[nextMode];
        this.currentGameMode.startMode(gameModeArguments);
    }
}

MainState.prototype.render = function ()
{
    ServiceLocator.renderer.render();
}

MainState.prototype.handleUI = function(_name, _event)
{
    //this is only on 'reload' event
    if (_name === "reload")
    {
        ServiceLocator.guiManager.lostUI.hide();
        this.setPaused(false);
        this.restart();
    }
    else if (_name === "back")
    {
        ServiceLocator.guiManager.lostUI.hide();
        this.state.start('Menu');
    }
}

MainState.prototype.die = function()
{
    ServiceLocator.guiManager.lostUI.show();
    this.setPaused(true);
}

MainState.prototype.restart = function()
{
    this.state.start('Main');
}

MainState.prototype.setPaused = function(_value)
{
    this.statePaused = _value;
    if (!_value)
    {
        ServiceLocator.animationManager.resumeAll();
    }
    else
    {
        ServiceLocator.animationManager.pauseAll();
    }
}

MainState.prototype.isPaused = function()
{
    return this.statePaused;
}
