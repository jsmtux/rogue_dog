var BasicGame = {};

var WALKSPEED = 6;
var GROUND_LEVEL = 525;

BasicGame.Load = function(game)
{
}

BasicGame.Load.preload = function()
{
    
}

BasicGame.Main = function (game)
{
    this.background = new Background();
    this.difficultyManager = new DifficultyManager();
    this.infoManager = new InfoManager(this);
    this.player = new DogPlayer();
    this.combatManager = new CombatManager(this, this.player, this.difficultyManager, this.infoManager);
    this.walkManager = new WalkManager(this, this.player, WALKSPEED, this.difficultyManager);
    this.guiManager = new GUIManager();
    this.inputManager = new InputManager();
    
    this.updateSignal = new Phaser.Signal();
};

BasicGame.Main.State = {
    WALKING : 0,
    FIGHTING : 1
}

BasicGame.Main.prototype.preload = function ()
{
    this.state;
    
    game.load.image('bg1', './img/background/layer-1.png');
    game.load.image('bg2', './img/background/layer-2.png');
    game.load.image('bg3', './img/background/layer-3.png');
    game.load.image('attack', './img/attack.png');
    game.load.image('defend', './img/defend.png');
    
    BasicEnemy.preload(game);
    BeeEnemy.preload(game);
    BasicTrainer.preload(game);
    Player.preload(game);
    SmMedkitCard.preload(game);
    WoodShieldCard.preload(game);
    WalkManager.preload(game);
    InfoManager.preload(game);
    GUIManager.preload(game);
    DogPlayer.preload(game);
}

BasicGame.Main.prototype.create = function ()
{
    this.state = undefined;

    this.background.addLayer(game, 'bg1', WALKSPEED / 5);
    this.background.addLayer(game, 'bg2', WALKSPEED / 2);
    this.background.addLayer(game, 'bg3', WALKSPEED);
    
    this.inputManager.create(this);
    this.infoManager.create();
    this.player.create(this, this.infoManager);
}

BasicGame.Main.prototype.update = function ()
{
    this.updateSignal.dispatch();
    if (this.infoManager.shouldPause())
    {
        return;
    }
    if (this.state == undefined)
    {
        this.state = BasicGame.Main.State.WALKING;
        this.walkManager.startWalk();
    }

    if (this.state == BasicGame.Main.State.WALKING)
    {
        this.walkManager.update();
        this.background.update();
        if (this.walkManager.isWalkingFinished())
        {
            this.state = BasicGame.Main.State.FIGHTING;
            this.combatManager.startCombat([BasicEnemy, BeeEnemy]);
        }
    }
    else if (this.state == BasicGame.Main.State.FIGHTING)
    {
        this.combatManager.update();
        if (this.combatManager.isCombatFinished())
        {
            this.state = BasicGame.Main.State.WALKING;
            this.walkManager.startWalk();
        }
    }
}

BasicGame.Main.prototype.render = function ()
{
}
