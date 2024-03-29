function MainState(_game)
{
    this.game = _game;
        
    this.gameModes = {};
    this.currentGameMode;
};

MainState.prototype.create = function ()
{
    this.game.sound.mute = true;
    this.statePaused = false;

    this.player = new DogPlayer(this);
    
    ServiceLocator.initialize('camera', new Camera());
    ServiceLocator.initialize('combatManager', new CombatManager(this, this.player));
    ServiceLocator.initialize('walkManager', new WalkManager(this, this.player));
    ServiceLocator.initialize('inputManager', new InputManager(this));
    ServiceLocator.initialize('animationManager', new AnimationManager(this));
    ServiceLocator.initialize('renderer', new Renderer(this));
    ServiceLocator.initialize('cardManager', new CardManager(this));
    ServiceLocator.initialize('dialogManager', new DialogManager(this, this.player));
    ServiceLocator.initialize('physics', new Physics(this));


    ServiceLocator.renderer.create(this);
    ServiceLocator.inputManager.create(this);
    ServiceLocator.camera.create(this, this.player);
    ServiceLocator.walkManager.create(this);
    
    ServiceLocator.guiManager.addToRenderer();

    ServiceLocator.dialogManager.create(this.game);
    ServiceLocator.combatManager.create(this.game);

    this.topBarUI = new TopBarUI(this.game);
    this.topBarUI.create();
    this.topBarUI.visible(false);

    this.player.create(this);

    this.currentGameMode = undefined;
    this.addGameMode(ServiceLocator.walkManager);
    this.addGameMode(ServiceLocator.combatManager);
    this.addGameMode(ServiceLocator.dialogManager);
    this.addGameMode(new WalkToCombatTransition(this.game, this.player));
    this.addGameMode(new EmptyGameMode());
    this.addGameMode(new CombatLootMode(this, this.player));
    
    this.particleEmitter = new ParticleEmitter(this.game);
    this.particleEmitter.create();
    
    this.collarCharacter = new CollarCharacter();
    this.collarCharacter.create(this);
    
    this.gameConfiguration = new EndlessConfiguration();
    this.gameConfiguration.resetGameState(this);
    //this should be in gui manager
    this.distanceMeter = new DistanceMeterUI();
    this.distanceMeter.create(this.game);
    this.distanceMeter.visible(false);
}

MainState.prototype.addGameMode = function(_mode)
{
    this.gameModes[_mode.getModeName()] = _mode;
}

MainState.prototype.update = function ()
{
    ServiceLocator.guiManager.update();

    this.gameConfiguration.update(this.currentGameMode, this);
    
    ServiceLocator.updateSignal.dispatch();

    if (this.overlayGameMode)
    {
        this.overlayGameMode.update();
    }
    
    if (!this.statePaused)
    {
        this.currentGameMode.update();
    }
}

MainState.prototype.setNextMode = function(_modeName, _args)
{
    if (this.currentGameMode)
    {
        this.currentGameMode.finishMode();
    }
    this.currentGameMode = this.gameModes[_modeName];
    this.currentGameMode.startMode(_args);
}

MainState.prototype.render = function ()
{
    ServiceLocator.renderSignal.dispatch();
}

MainState.prototype.handleUI = function(_name, _event)
{
    //this is only on 'reload' event
    if (_name === "reload")
    {
        this.setPaused(false);
        this.restart();
    }
}

MainState.prototype.die = function()
{
    ServiceLocator.camera.fade(2000, () => this.restart());
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

MainState.prototype.setOverlayGameMode = function(_mode, _arguments)
{
    this.overlayGameMode = this.gameModes[_mode];
    this.overlayGameMode.startMode(_arguments);
}

MainState.prototype.resetOverlayGameMode = function()
{
    if (this.overlayGameMode)
    {
        this.overlayGameMode.finishMode();
    }
    this.overlayGameMode = undefined;
}

MainState.prototype.getCurrentModeName = function()
{
    return this.currentGameMode.getModeName();
}