class Services
{
    constructor()
    {
        this.difficultyManager = {};
        this.combatManager = {};
        this.walkManager = {};
        this.guiManager = {};
        this.inputManager = {};
        this.camera = {};
        this.animationManager = {};
        this.renderer = {};
        this.lighting = {};
        this.physics = {}
        this.cardManager = {};
        this.dialogManager = {};
        this.messageListeners = new Phaser.Signal();
        this.namedMessageListeners = {};
        this.viewportHandler = {};

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

    publish(_msg)
    {
        var receiver = this.messageListeners;
        
        if (_msg.name in this.namedMessageListeners)
        {
            receiver = this.namedMessageListeners[_msg.name];
        }
        
        receiver.dispatch(_msg);
    }
    
    resetMessageListeners()
    {
        this.namedMessageListeners = {};
    }
    
    registerListener(_callback, _callbackContext, _msgName)
    {
        if (_msgName)
        {
            this.namedMessageListeners[_msgName] = this.namedMessageListeners[_msgName] || new Phaser.Signal();
            this.namedMessageListeners[_msgName].add(_callback, _callbackContext);
        }
        else
        {
            this.messageListeners.add(_callback, _callbackContext);
        }
    }
    
    removeListener(_callback, _callbackContext, _msgName)
    {
        if (_msgName)
        {
            this.namedMessageListeners[_msgName].remove(_callback, _callbackContext);
        }
        else
        {
            this.messageListeners.remove(_callback, _callbackContext);
        }
    }
}

var ServiceLocator = new Services();
