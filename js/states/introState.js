function IntroState(_game)
{
    this.game = _game;
    this.bgSprite;
    this.menuGUI;
}

IntroState.prototype.preload = function()
{
    ServiceLocator.initialize('guiManager', new GUIManager());
    ServiceLocator.initialize('difficultyManager', new DifficultyManager());
    
    ServiceLocator.guiManager.addToState(this.game);
}

IntroState.prototype.update = function()
{
    if (performance.now() - this.showTime > 2000)
    {
        this.state.start('Load');
    }
}

IntroState.prototype.create = function ()
{
    ServiceLocator.difficultyManager.create(); 
    ServiceLocator.guiManager.create(this);
    this.bgSprite = this.game.add.sprite(500, 200, 'company_logo');

    this.showTime = performance.now();
}
