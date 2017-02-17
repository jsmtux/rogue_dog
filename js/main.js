var BasicGame = {};

var WALKSPEED = 6;
var GROUND_LEVEL = 525;

BasicGame.Load = function(_game)
{
    this.game = _game;
}

BasicGame.Load.prototype.preload = function()
{
    Background.preload(this.game);
    BasicEnemy.preload(this.game);
    BeeEnemy.preload(this.game);
    BasicTrainer.preload(this.game);
    Player.preload(this.game);
    SmMedkitCard.preload(this.game);
    WoodShieldCard.preload(this.game);
    WalkManager.preload(this.game);
    InfoManager.preload(this.game);
    DogPlayer.preload(this.game);
    GUIManager.preload(this.game);
    this.game.load.onLoadComplete.add(this.loadComplete, this);
    
    this.loaded = false;
}

BasicGame.Load.prototype.update = function()
{
    if (this.loaded)
    {
        this.state.start('Main');
    }
}

BasicGame.Load.prototype.loadComplete = function()
{
    this.loaded = true;
}

BasicGame.Main = function (game)
{
    this.player = new DogPlayer();

    ServiceLocator.initialize('difficultyManager', new DifficultyManager());
    ServiceLocator.initialize('infoManager', new InfoManager(this));
    ServiceLocator.initialize('combatManager', new CombatManager(this, this.player));
    ServiceLocator.initialize('walkManager', new WalkManager(this, this.player, WALKSPEED));
    ServiceLocator.initialize('guiManager', new GUIManager());
    ServiceLocator.initialize('inputManager', new InputManager(this));
    ServiceLocator.initialize('background', new Background(this));
    
    this.updateSignal = new Phaser.Signal();
};

BasicGame.Main.State = {
    WALKING : 0,
    FIGHTING : 1
}

BasicGame.Main.prototype.preload = function ()
{
    this.state;
    
    game.load.image('attack', './img/attack.png');
    game.load.image('defend', './img/defend.png');
    
}

BasicGame.Main.prototype.create = function ()
{
    this.state = undefined;

    ServiceLocator.background.create(this, WALKSPEED);
    ServiceLocator.inputManager.create(this);
    ServiceLocator.guiManager.create();
    ServiceLocator.infoManager.create();
    this.player.create(this);
}

BasicGame.Main.prototype.update = function ()
{
    this.updateSignal.dispatch();
    if (ServiceLocator.infoManager.shouldPause())
    {
        return;
    }
    if (this.state == undefined)
    {
        this.state = BasicGame.Main.State.WALKING;
        ServiceLocator.walkManager.startWalk();
    }

    if (this.state == BasicGame.Main.State.WALKING)
    {
        ServiceLocator.walkManager.update();
        if (ServiceLocator.walkManager.isWalkingFinished())
        {
            this.state = BasicGame.Main.State.FIGHTING;
            ServiceLocator.combatManager.startCombat([BasicEnemy, BeeEnemy]);
        }
    }
    else if (this.state == BasicGame.Main.State.FIGHTING)
    {
        ServiceLocator.combatManager.update();
        if (ServiceLocator.combatManager.isCombatFinished())
        {
            this.state = BasicGame.Main.State.WALKING;
            ServiceLocator.walkManager.startWalk();
        }
    }
}

BasicGame.Main.prototype.render = function ()
{
}
