function MainState(_game)
{
    this.game = _game;
        
    this.gameModes = {};
    this.currentGameMode;
};

MainState.prototype.preload = function ()
{
    CombatLootMode.preload(this.game);
    GearCardCompletedMode.preload(this.game);
    DialogManager.preload(this.game);

    BannerShow.preload(this.game);
    ParticleEmitter.preload(this.game);
}

MainState.prototype.create = function ()
{
    this.statePaused = false;

    this.updateSignal = new Phaser.Signal();

    this.player = new DogPlayer();
    
    ServiceLocator.initialize('camera', new Camera());
    ServiceLocator.initialize('combatManager', new CombatManager(this, this.player));
    ServiceLocator.initialize('walkManager', new WalkManager(this, this.player));
    ServiceLocator.initialize('inputManager', new InputManager(this));
    ServiceLocator.initialize('animationManager', new AnimationManager());
    ServiceLocator.initialize('lighting', new Lighting());
    ServiceLocator.initialize('renderer', new Renderer(this));
    ServiceLocator.initialize('cardManager', new CardManager(this));
    ServiceLocator.initialize('inGameHelper', new InGameHelper(this));
    ServiceLocator.initialize('dialogManager', new DialogManager(this));

    this.game.world.setBounds(0, 0, 192000, 900);

    ServiceLocator.renderer.create(this);
    ServiceLocator.inputManager.create(this);
    ServiceLocator.camera.create(this, this.player);
    ServiceLocator.walkManager.create(this);
    ServiceLocator.inGameHelper.create();
    
    ServiceLocator.guiManager.addToRenderer();

    this.player.create(this);
    
    this.lostUI = new GameOverGuiElement();
    ServiceLocator.guiManager.createUI(this.lostUI);
    this.lostUI.addListener(this.handleUI, this);
    this.lostUI.hide();
    
    ServiceLocator.lighting.addLight(new OvergroundLight(GROUND_LEVEL - 50));
    
    this.jumpTutorial = new JumpTutorial(this, this.player);

    this.gearCardCompletedMode = new GearCardCompletedMode();
    this.gearCardCompletedMode.create(this);

    this.currentGameMode = undefined;
    this.addGameMode(ServiceLocator.walkManager);
    this.addGameMode(ServiceLocator.combatManager);
    this.addGameMode(ServiceLocator.dialogManager);
    this.addGameMode(this.jumpTutorial);
    this.addGameMode(this.gearCardCompletedMode);
    this.addGameMode(new EmptyGameMode());
    this.addGameMode(new CombatLootMode(this, this.player));
    
    this.bannerShow = new BannerShow(this.game);
    this.particleEmitter = new ParticleEmitter(this.game);
    this.particleEmitter.create();
    
    MenuState.gameConfiguration.resetGameState(this);
}

MainState.prototype.addGameMode = function(_mode)
{
    this.gameModes[_mode.getModeName()] = _mode;
}

MainState.prototype.update = function ()
{
    MenuState.gameConfiguration.update(this.currentGameMode, this);
    this.updateSignal.dispatch(); 
    if (this.statePaused)
    {
        if (this.overlayGameMode)
        {
            this.overlayGameMode.update();
        }
        return;
    }
   
    this.currentGameMode.update();
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
    ServiceLocator.renderer.render();
}

MainState.prototype.handleUI = function(_name, _event)
{
    //this is only on 'reload' event
    if (_name === "reload")
    {
        this.lostUI.hide();
        this.setPaused(false);
        this.restart();
    }
    else if (_name === "back")
    {
        this.lostUI.hide();
        this.state.start('Menu');
    }
}

MainState.prototype.die = function()
{
    this.lostUI.show();
    this.setPaused(true);
    this.setNextMode("EmptyGameMode");
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
    this.setPaused(true);
}

MainState.prototype.resetOverlayGameMode = function()
{
    if (this.overlayGameMode)
    {
        this.overlayGameMode.finishMode();
    }
    this.overlayGameMode = undefined;
    this.setPaused(false);
}
