function LoadState(_game)
{
    this.game = _game;
    this.bgSprite;
    this.menuGUI;
    this.loaded = false;
    this.imageArray = [];
}

LoadState.prototype.preload = function()
{
    ServiceLocator.initialize('guiManager', new GUIManager());
    ServiceLocator.initialize('difficultyManager', new DifficultyManager());
}

LoadState.prototype.update = function()
{
    if (this.loaded/* && (DebugMode || performance.now() - this.showTime > 3500)*/)
    {
        this.state.start('Main');
    }
}

LoadState.prototype.create = function ()
{
    ServiceLocator.difficultyManager.create(); 
    ServiceLocator.guiManager.create(this);

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
    
    CombatLootMode.preload(this.game);
    DialogManager.preload(this.game);
    CombatManager.preload(this.game);

    ParticleEmitter.preload(this.game);
    TopBarUI.preload(this.game);
    DigUI.preload(this.game);
    
    CollarCharacter.preload(this.game);

    this.game.load.onLoadComplete.add(this.loadComplete, this);
    this.game.load.start();
    
    this.showLogo();
}

LoadState.prototype.showLogo = function()
{
    
    var bmd = game.make.bitmapData(100, 100);
	bmd.draw('company_logo', 0, 0);
	bmd.update();
	
	this.group = this.game.add.spriteBatch();
	
	var logoPos = new Phaser.Point(50, 450);

    var colorValues = [];

	for (var i = 0; i < 100; i++)
	{
	    for (var j = 0; j < 100; j++)
	    {
	        var value = bmd.getPixel32(i, j);
	        if (value == 4278191308)
	        {
	            value = 4278190284;
	        }
	        if (value !== 0)
	        {
	            var newSprite = this.game.add.sprite(i + logoPos.x, -300, 'logo_pallete');
	            newSprite.width = 1;
	            newSprite.height = 100;
	            this.group.add(newSprite);
	            
	            var ind = colorValues.indexOf(value);
	            if (ind < 0)
	            {
	                colorValues.push(value);
	                ind = colorValues.length - 1;
	            }
	            newSprite.frame = ind;
	            
	            var time = 500 + Math.random() * 500;
	            var inTween = this.game.add.tween(newSprite);
                inTween.to({ y:  j + logoPos.y}, time, Phaser.Easing.Circular.Out, true, Math.random() * 200 + j * 10);
                inTween.start();
	            inTween = this.game.add.tween(newSprite);
                inTween.to({height: 1}, time, Phaser.Easing.Linear.None, true, Math.random() * 200 + j * 10);
                inTween.start();
	        }
	    }
	}
	bmd.destroy();
}

LoadState.prototype.loadComplete = function()
{
    this.loaded = true;
}