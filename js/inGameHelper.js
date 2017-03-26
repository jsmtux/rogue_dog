class InGameHelper
{
    constructor(_game)
    {
        this.pointer;
        this.game = _game;
        
        this.showingJumpHelp = false;
        this.jumpHelpTimeout;
    }
    
    static preload(_game)
    {
        loadSpriterFiles(_game, "pointer");
    }
    
    create()
    {
        var sprite = loadSpriter(this.game, "pointerJSON", "pointerAtlas", "entity_000");
        this.pointer = sprite;
        this.pointer.visible = false;
        ServiceLocator.guiManager.addToUI(this.pointer);
    }
    
    showJumpHelp()
    {
        if (!this.showingJumpHelp)
        {
            this.showingJumpHelp = true;
            this.jumpHelpCallback();
        }
    }
    
    hideJumpHelp()
    {
        this.showingJumpHelp = false;
        this.pointer.visible = false;
        clearTimeout(this.jumpHelpTimeout);
    }
    
    jumpHelpCallback()
    {
        if (this.showingJumpHelp === true)
        {
            this.pointer.visible = true;
            this.pointer.x = 300;
            this.pointer.y = 400;
            this.pointer.animations.play('drag');
            var hidePointerOnEnd = () => {
                this.pointer.onFinish.remove(hidePointerOnEnd);
                this.pointer.visible = false;
                this.jumpHelpTimeout = setTimeout(() => {this.jumpHelpCallback()}, 1000);
            };
            this.pointer.onFinish.add(hidePointerOnEnd);
        }
    }
}