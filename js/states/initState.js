function InitState(_game)
{
    this.game = _game;
}

InitState.prototype.preload = function()
{
    this.game.load.image('menu_bg', './img/ui/menu_dog.png');
    GUIManager.preload(this.game);
    this.game.load.onLoadComplete.add(this.loadComplete, this);
    
    this.loaded = false;
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
