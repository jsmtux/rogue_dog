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
        this.background = {};
        this.camera = {};
        Object.preventExtensions(this)
    }
    
    initialize(_name, object)
    {
        if (!this.checkVariableExists(_name))
        {
            console.error("Initializing undefined element " + _name);
        }
        this[_name] = object;
    }
    
    checkVariableExists(_name)
    {
        var values = Object.keys(this);
        return values.indexOf(_name) >= 0;
    }
    
    getElement(_name)
    {
        if (!this.checkVariableExists(_name))
        {
            console.error("Initializing undefined element " + _name);
        }
        return this[_name];
    }
}

var ServiceLocator = new Services();