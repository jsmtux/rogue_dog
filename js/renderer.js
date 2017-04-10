class Renderer
{
    constructor(_game)
    {
        this.game = _game;
    }
    
    static preload(_game)
    {
        _game.load.script('gray', 'filters/gray.js');
    }
    
    create(_game)
    {
        this.diffuseRenderTexture = this.game.add.renderTexture(resolution.x, resolution.y, 'diffuseRT');
        this.outputSprite = this.game.add.sprite(0, 0, this.diffuseRenderTexture);
        
        this.sceneGroup = this.game.add.group();
        this.sceneGroup.visible = false;
        this.overlay = this.game.add.group();
        
        this.maskRenderTexture = this.game.add.renderTexture(resolution.x, resolution.y, 'maskRT');
        this.maskGroup = this.game.add.group();
        this.maskGroup.visible = false;
        
        this.UIGroup = _game.add.group();
        this.UIGroup.fixedToCamera = true;
        
        this.outputSprite.fixedToCamera = true;
        
        this.grayFilter = _game.add.filter('Gray'/*, {mask: { type: 'sampler2D', value: this.maskRenderTexture }}*/);
        this.grayFilter.gray = 0.5;
        this.grayFilter.mask = this.maskRenderTexture;
        this.outputSprite.filters = [this.grayFilter];
        
        this.graphics = _game.add.graphics(0, 0);
        this.addToMask(this.graphics);
    }

    render()
    {
        var cameraPos = ServiceLocator.camera.getPosition();
        
        ServiceLocator.lighting.draw(this.graphics);

        this.maskGroup.visible = true;
        this.maskRenderTexture.renderXY(this.maskGroup, -cameraPos.x, -cameraPos.y, true);
        this.maskGroup.visible = false;
        
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
    
    addToMask(_element)
    {
        this.maskGroup.add(_element);
    }
    
    addToUI(_sprite)
    {
        this.UIGroup.add(_sprite);
    }
}