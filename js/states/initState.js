function InitState(_game)
{
    this.game = _game;
}

InitState.prototype.preload = function()
{
    GUIManager.preload(this.game);
    this.game.load.image('company_logo', './img/logos/guanaco_100.png');
    this.game.load.spritesheet('logo_pallete', './img/logos/logo_pallete.png',1 , 1);
    this.game.load.onLoadComplete.add(this.loadComplete, this);
    
    this.loaded = false;
}

InitState.prototype.create = function()
{
    ServiceLocator.viewportHandler.onGameCreation(this.game);
    this.game.world.setBounds(0, -65, 192000, 0);
}

InitState.prototype.update = function()
{
    if (this.loaded)
    {
        this.state.start('Load');
    }
}

InitState.prototype.loadComplete = function()
{
    this.loaded = true;
}
