class Services
{
    constructor()
    {
        this.difficultyManager = {};
        this.infoManager = {};
        this.combatManager = {};
        this.walkManager = {};
        this.guiManager = {};
        this.inputManager = {};
        this.camera = {};
        this.animationManager = {};
        this.renderer = {};
        this.lighting = {};
        this.cardManager = {};
        this.inGameHelper = {};
        this.dialogManager = {};

        Object.preventExtensions(this);
    }
    
    initialize(_name, object)
    {
        this[_name] = object;
    }
    
    getElement(_name)
    {
        return this[_name];
    }
}

var ServiceLocator = new Services();