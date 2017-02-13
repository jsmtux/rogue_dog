function Services()
{
    this.difficultyManager = {};
    this.infoManager = {};
    this.combatManager = {};
    this.walkManager = {};
    this.guiManager = {};
    this.inputManager = {};
    this.background = {};
    Object.preventExtensions(this)
}

Services.prototype.initialize = function(_name, object)
{
    if (!this.checkVariableExists(_name))
    {
        console.error("Initializing undefined element " + _name);
    }
    this[_name] = object;
}

Services.prototype.checkVariableExists = function(_name)
{
    var values = Object.keys(this);
    return values.indexOf(_name) >= 0;
}

Services.prototype.getElement = function(_name)
{
    if (!this.checkVariableExists(_name))
    {
        console.error("Initializing undefined element " + _name);
    }
    return this[_name];
}

var ServiceLocator = new Services();