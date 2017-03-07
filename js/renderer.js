class Renderer
{
    constructor(_game)
    {
        this.game = _game;
    }
    
    create(_game)
    {
        this.sceneGroup = this.game.add.group();
        this.sceneGroup.visible = false;
        this.overlay = this.game.add.group();
        this.uiGroup = this.game.add.group();
        
        this.diffuseRenderTexture = this.game.add.renderTexture(resolution.x, resolution.y, 'diffuseRT');
        this.outputSprite = this.game.add.sprite(0, 0, this.diffuseRenderTexture);
        
        this.outputSprite.fixedToCamera = true;
    }
    
    render()
    {
        var cameraPos = ServiceLocator.camera.getPosition();
        this.sceneGroup.visible = true;
        this.diffuseRenderTexture.renderXY(this.sceneGroup, -cameraPos.x, -cameraPos.y, true);
        this.sceneGroup.visible = false;
    }
    
    addToScene(_element)
    {
        this.sceneGroup.add(_element);
    }
    
    addToOverlay(_element)
    {
        this.overlay.add(_element);
    }
}