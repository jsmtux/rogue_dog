function MainState(game)
{
    this.game = game;
    this.paused = false;
};

MainState.State = {
    WALKING : 0,
    FIGHTING : 1
}

MainState.prototype.preload = function ()
{
    this.gameplayState;
    
    this.game.load.image('attack', './img/attack.png');
    this.game.load.image('defend', './img/defend.png');
    
}

MainState.prototype.create = function ()
{
    this.updateSignal = new Phaser.Signal();

    this.player = new DogPlayer();
    
    ServiceLocator.initialize('difficultyManager', new DifficultyManager());
    ServiceLocator.initialize('camera', new Camera());
    ServiceLocator.initialize('infoManager', new InfoManager(this));
    ServiceLocator.initialize('combatManager', new CombatManager(this, this.player));
    ServiceLocator.initialize('walkManager', new WalkManager(this, this.player));
    ServiceLocator.initialize('guiManager', new GUIManager());
    ServiceLocator.initialize('inputManager', new InputManager(this));
    ServiceLocator.initialize('animationManager', new AnimationManager());
    ServiceLocator.initialize('lighting', new Lighting());
    ServiceLocator.initialize('renderer', new Renderer(this));

    this.gameplayState = undefined;
    this.game.world.setBounds(0, 0, 192000, 192000);
    //this.game.camera.bounds = undefined;

    ServiceLocator.renderer.create(this);
    ServiceLocator.inputManager.create(this);
    ServiceLocator.guiManager.create(this);
    ServiceLocator.infoManager.create();
    ServiceLocator.camera.create(this, this.player);
    ServiceLocator.walkManager.create(this);

    this.player.create(this);
    
    ServiceLocator.guiManager.lostUI.addCallback('reloadButton', 'click', 'reload');
    ServiceLocator.guiManager.lostUI.registerCbReceiver(this.handleUI, this)
    
    ServiceLocator.lighting.addLight(new OvergroundLight(GROUND_LEVEL - 50));
}

MainState.prototype.update = function ()
{
    this.updateSignal.dispatch();
    if (this.paused)
    {
        return;
    }
    if (this.gameplayState == undefined)
    {
        this.gameplayState = MainState.State.WALKING;
        ServiceLocator.walkManager.fillEmpty();
        ServiceLocator.walkManager.startWalk();
    }

    if (this.gameplayState == MainState.State.WALKING)
    {
        ServiceLocator.walkManager.update();
        if (ServiceLocator.walkManager.isWalkingFinished())
        {
            this.gameplayState = MainState.State.FIGHTING;
            ServiceLocator.combatManager.startCombat(ServiceLocator.difficultyManager.getEnemies());
        }
    }
    else if (this.gameplayState == MainState.State.FIGHTING)
    {
        ServiceLocator.combatManager.update();
        if (ServiceLocator.combatManager.isCombatFinished())
        {
            this.gameplayState = MainState.State.WALKING;
            ServiceLocator.walkManager.startWalk();
        }
    }
}

MainState.prototype.render = function ()
{
    ServiceLocator.renderer.render();
}

MainState.prototype.handleUI = function()
{
    //this is only on 'reload' event
    ServiceLocator.guiManager.lostUI.hide();
    this.setPaused(false);
    this.restart();
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
    this.paused = _value;
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
    return this.paused;
}
