function MenuState(_game)
{
    this.game = _game;
    this.bgSprite;
}

MenuState.prototype.preload = function()
{
    ServiceLocator.initialize('guiManager', new GUIManager());
    ServiceLocator.initialize('difficultyManager', new DifficultyManager());
    
    ServiceLocator.guiManager.mainMenuUI.show();
}

MenuState.prototype.update = function()
{
    if (!this.bgSprite || !this.bgSprite.alive)
    {
        this.bgSprite = this.game.add.sprite(-400, 200, 'menu_bg');
        ServiceLocator.guiManager.mainMenuUI.addCallback('playButton', 'click', 'playButtonClicked');
        ServiceLocator.guiManager.mainMenuUI.addCallback('endlessButton', 'click', 'endlessButtonClicked');
        ServiceLocator.guiManager.mainMenuUI.registerCbReceiver(this.menuHandler, this);
    }
}

MenuState.prototype.create = function ()
{
    ServiceLocator.difficultyManager.create(); 
}

MenuState.prototype.menuHandler = function(_name, _event)
{
    if(_name === "playButtonClicked")
    {
        MenuState.gameConfiguration = new StoryConfiguration();
    }
    if(_name === "endlessButtonClicked")
    {
        MenuState.gameConfiguration = new EndlessConfiguration();
    }

    this.state.start('Load');
    ServiceLocator.guiManager.mainMenuUI.hide();
}

MenuState.gameConfiguration;
