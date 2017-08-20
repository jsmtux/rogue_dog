class Physics
{
    constructor(_game, _debugEnabled = DebugMode)
    {
        this.game = _game
        this.debugEnabled = _debugEnabled;
        
        this.registeredSprites = [];
        
        ServiceLocator.updateSignal.add(this.update, this);
    }
    
    update()
    {
        for (var ind in this.registeredSprites)
        {
            if (this.debugEnabled)
            {
                this.game.game.debug.body(this.registeredSprites[ind]);
                //this.game.game.debug.spriteBounds(this.registeredSprites[ind], 'pink', false);
            }
        }
    }
    
    isColliding(_sprite)
    {
        var ret = false;
        for(var ind in this.registeredSprites)
        {
            if (this.registeredSprites[ind] != _sprite)
            {
                ret = this.game.game.physics.arcade.collide(this.registeredSprites[ind], _sprite);
            }
        }
        
        return ret;
    }
    
    isCollidingWith(_spriteA, _spriteB)
    {
        return this.game.game.physics.arcade.collide(_spriteA, _spriteB);
    }
    
    addToWorld(_sprite)
    {
        this.game.physics.enable(_sprite, Phaser.Physics.ARCADE);
        this.registeredSprites.push(_sprite);
        var body = _sprite.body;
        body.setSize(body.width, body.height, 0, -body.height);
    }
    
    removeFromWorld(_sprite)
    {
        this.registeredSprites.splice(this.registeredSprites.indexOf(_sprite), 1);
    }
}