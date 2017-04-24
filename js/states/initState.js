function InitState(_game)
{
    this.game = _game;
}

InitState.prototype.preload = function()
{
    GUIManager.preload(this.game);
    this.game.load.image('menu_bg', './img/ui/menu_dog.png');
    this.game.load.onLoadComplete.add(this.loadComplete, this);
    
    this.loaded = false;
}

InitState.prototype.create = function()
{
    ServiceLocator.viewportHandler.onGameCreation(this.game);
}

InitState.prototype.update = function()
{
    if (this.loaded)
    {
        this.state.start('Menu');
    }
}

InitState.prototype.loadComplete = function()
{
    this.loaded = true;
}