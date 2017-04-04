function MenuState(_game)
{
    this.game = _game;
    this.bgSprite;
    this.menuGUI;
}

MenuState.prototype.preload = function()
{
    ServiceLocator.initialize('guiManager', new GUIManager());
    ServiceLocator.initialize('difficultyManager', new DifficultyManager());
    
    ServiceLocator.guiManager.addToState(this.game);
}

MenuState.prototype.update = function()
{
}

MenuState.prototype.create = function ()
{
    ServiceLocator.difficultyManager.create(); 
    ServiceLocator.guiManager.create(this);
    this.bgSprite = this.game.add.sprite(-400, 200, 'menu_bg');
    
    this.menuGUI = new MenuGuiElement();
    ServiceLocator.guiManager.createUI(this.menuGUI);
    this.menuGUI.addListener(this.menuHandler, this);
}

MenuState.prototype.menuHandler = function(_name)
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
}

MenuState.gameConfiguration;
