class GUIElement
{
    constructor(_container)
    {
        this.guiContainer = EZGUI.create(_container, 'metalworks');
        this.guiContainer.visible = false;
    }
    
    destroy()
    {
        this.guiContainer.destroy();
    }
    
    setPosition(_position)
    {
        this.guiContainer.phaserGroup.x = _position.x;
        this.guiContainer.phaserGroup.y = _position.y;
    }
    
    addCallback(_element, _event, _name)
    {
        var self = this;
        EZGUI.components[_element].on(_event, function(event){self.cbHandler(_name, event)});
    }
    
    registerCbReceiver(_cb, _cbEnv)
    {
        this.cb = _cb;
        this.cbEnv = _cbEnv;
    }
    
    cbHandler(_name, _event)
    {
        if (this.cb)
        {
            this.cb.call(this.cbEnv, _name, _event);
        }
    }
    
    show()
    {
        this.guiContainer.visible = true;
    }
    
    
    hide()
    {
        this.guiContainer.visible = false;
    }
}