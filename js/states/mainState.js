function MainState(game)
{
    this.game = game;
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
    this.player = new DogPlayer();

    ServiceLocator.initialize('difficultyManager', new DifficultyManager());
    ServiceLocator.initialize('camera', new Camera());
    ServiceLocator.initialize('infoManager', new InfoManager(this));
    ServiceLocator.initialize('combatManager', new CombatManager(this, this.player));
    ServiceLocator.initialize('walkManager', new WalkManager(this, this.player));
    ServiceLocator.initialize('guiManager', new GUIManager());
    ServiceLocator.initialize('inputManager', new InputManager(this));
    ServiceLocator.initialize('background', new Background(this));
    
    this.updateSignal = new Phaser.Signal();

    this.gameplayState = undefined;
    this.game.world.setBounds(0, 0, 192000, 0);
    //this.game.camera.bounds = undefined;

    ServiceLocator.background.create(this);
    ServiceLocator.inputManager.create(this);
    ServiceLocator.guiManager.create(this);
    ServiceLocator.infoManager.create();
    this.player.create(this);
    ServiceLocator.camera.create(this, this.player);

    var self = this;
    ServiceLocator.inputManager.down.onDown.add(function(){self.die();});
}

MainState.prototype.update = function ()
{
    this.updateSignal.dispatch();
    if (ServiceLocator.infoManager.shouldPause())
    {
        return;
    }
    if (this.gameplayState == undefined)
    {
        this.gameplayState = MainState.State.WALKING;
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
}

MainState.prototype.die = function()
{
    this.state.start('Main');
}
