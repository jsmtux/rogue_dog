function LoadState(_game)
{
    this.game = _game;
}

LoadState.prototype.preload = function()
{
    Background.preload(this.game);
    BasicEnemy.preload(this.game);
    BeeEnemy.preload(this.game);
    WalkManager.preload(this.game);
    DogPlayer.preload(this.game);
    Renderer.preload(this.game);
    CardManager.preload(this.game);
    InGameHelper.preload(this.game);
    InputManager.preload(this.game);
    this.game.load.onLoadComplete.add(this.loadComplete, this);
    
    this.loaded = false;
}

LoadState.prototype.update = function()
{
    if (this.loaded)
    {
        this.state.start('Main');
    }
}

LoadState.prototype.loadComplete = function()
{
    this.loaded = true;
}