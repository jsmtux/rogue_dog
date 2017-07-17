function LoadState(_game)
{
    this.game = _game;
    this.bgSprite;
    this.menuGUI;
    this.loaded = false;
}

LoadState.prototype.preload = function()
{
    ServiceLocator.initialize('guiManager', new GUIManager());
    ServiceLocator.initialize('difficultyManager', new DifficultyManager());
    
    ServiceLocator.guiManager.addToState(this.game);
}

LoadState.prototype.update = function()
{
    if (this.loaded && performance.now() - this.showTime > 1000)
    {
        this.state.start('Main');
    }
}

LoadState.prototype.create = function ()
{
    ServiceLocator.difficultyManager.create(); 
    ServiceLocator.guiManager.create(this);
    this.bgSprite = this.game.add.sprite(50, 450, 'company_logo');

    this.showTime = performance.now();
    
    Background.preload(this.game);
    Enemy.preload(this.game);
    BasicEnemy.preload(this.game);
    BeeEnemy.preload(this.game);
    WalkManager.preload(this.game);
    DogPlayer.preload(this.game);
    Renderer.preload(this.game);
    CardManager.preload(this.game);
    InputManager.preload(this.game);
    this.game.load.onLoadComplete.add(this.loadComplete, this);
    this.game.load.start();
}

LoadState.prototype.loadComplete = function()
{
    this.loaded = true;
}