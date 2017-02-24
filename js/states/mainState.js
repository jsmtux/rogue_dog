function MainState(game)
{
    this.player = new DogPlayer();

    this.game = game;

    ServiceLocator.initialize('difficultyManager', new DifficultyManager());
    ServiceLocator.initialize('camera', new Camera());
    ServiceLocator.initialize('infoManager', new InfoManager(this));
    ServiceLocator.initialize('combatManager', new CombatManager(this, this.player));
    ServiceLocator.initialize('walkManager', new WalkManager(this, this.player));
    ServiceLocator.initialize('guiManager', new GUIManager());
    ServiceLocator.initialize('inputManager', new InputManager(this));
    ServiceLocator.initialize('background', new Background(this));
    
    this.updateSignal = new Phaser.Signal();
};

MainState.State = {
    WALKING : 0,
    FIGHTING : 1
}

MainState.prototype.preload = function ()
{
    this.state;
    
    this.game.load.image('attack', './img/attack.png');
    this.game.load.image('defend', './img/defend.png');
    
}

MainState.prototype.create = function ()
{
    this.state = undefined;
    this.game.world.setBounds(0, 0, 192000, 0);
    //this.game.camera.bounds = undefined;

    ServiceLocator.background.create(this);
    ServiceLocator.inputManager.create(this);
    ServiceLocator.guiManager.create(this);
    ServiceLocator.infoManager.create();
    this.player.create(this);
    ServiceLocator.camera.create(this, this.player);
}

MainState.prototype.update = function ()
{
    this.updateSignal.dispatch();
    if (ServiceLocator.infoManager.shouldPause())
    {
        return;
    }
    if (this.state == undefined)
    {
        this.state = MainState.State.WALKING;
        ServiceLocator.walkManager.startWalk();
    }

    if (this.state == MainState.State.WALKING)
    {
        ServiceLocator.walkManager.update();
        if (ServiceLocator.walkManager.isWalkingFinished())
        {
            this.state = MainState.State.FIGHTING;
            ServiceLocator.combatManager.startCombat(ServiceLocator.difficultyManager.getEnemies());
        }
    }
    else if (this.state == MainState.State.FIGHTING)
    {
        ServiceLocator.combatManager.update();
        if (ServiceLocator.combatManager.isCombatFinished())
        {
            this.state = MainState.State.WALKING;
            ServiceLocator.walkManager.startWalk();
        }
    }
}

MainState.prototype.render = function ()
{
}
