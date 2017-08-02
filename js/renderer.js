class Renderer
{
    constructor(_game)
    {
        this.game = _game;
    }
    
    static preload(_game)
    {
        _game.load.script('gray', 'filters/gray.js');
        _game.load.script('sepia', 'filters/sepia.js');
        _game.load.script('screen', 'filters/screen.js');
    }
    
    create(_game)
    {
        var nativeResolution = ServiceLocator.viewportHandler.nativeResolution;
        var resolution = ServiceLocator.viewportHandler.resolution;
        this.diffuseRenderTexture = this.game.add.renderTexture(nativeResolution.x, nativeResolution.y, 'diffuseRT');
        
        var offset = ServiceLocator.viewportHandler.getSceneOffset();
        
        this.outputSprite = this.game.add.sprite(-offset.x, -offset.y, this.diffuseRenderTexture);
        
        this.sceneGroup = this.game.add.group();
        this.sceneGroup.visible = false;
        this.overlay = this.game.add.group();
        this.overlay.x = -offset.x;
        this.overlay.y = -offset.y;
        
        this.UIGroup = _game.add.group();
        this.UIGroup.fixedToCamera = true;
        
        this.outputSprite.fixedToCamera = true;
        
        //setting up proper debug canvas
        var debug = this.game.game.debug;
        var phaserGame = this.game.game;
        
        debug.bmd.resize(nativeResolution.x, nativeResolution.y);
        debug.canvas.width = nativeResolution.x;
        debug.canvas.height = nativeResolution.y;
        
        debug.sprite.destroy();
        debug.sprite = phaserGame.make.image(0, 0, debug.bmd);
        
        phaserGame.stage.addChild(debug.sprite);
        
        debug.sprite.width = nativeResolution.x;
        debug.sprite.height = -nativeResolution.y;
        debug.sprite.position.y = nativeResolution.y - offset.y;
        debug.sprite.position.x = -offset.x;
    }

    render()
    {
        var cameraPos = ServiceLocator.camera.getPosition();
        
        this.sceneGroup.visible = true;
        this.diffuseRenderTexture.renderXY(this.sceneGroup, -cameraPos.x, -cameraPos.y, true);
        this.sceneGroup.visible = false;
        
        this.game.world.bringToTop(this.overlay);
        this.game.world.bringToTop(this.UIGroup);
    }
    
    addToScene(_element)
    {
        this.sceneGroup.add(_element);
    }
    
    addToOverlay(_element)
    {
        this.overlay.add(_element);
    }
    
    addToUI(_sprite)
    {
        this.UIGroup.add(_sprite);
    }
    
    addFilterToScene(_filter)
    {
        this.outputSprite.filters = [_filter];
    }
    
    removeFilterFromScene(_filter)
    {
        this.outputSprite.filters = [];        
    }
}