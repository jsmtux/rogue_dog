class SpriterAnimation
{
    constructor(_game, _spriterGroup)
    {
        this.spriterGroup = _spriterGroup;
        this.currentAnimation = -1;
        this.paused = true;
        _game.updateSignal.add(this.update, this);
    }
    
    play(_name)
    {
        this.spriterGroup.playAnimationByName(_name);
        this.paused = false;
    }
    
    stop()
    {
        this.paused = true;
    }
    
    update()
    {
        if (!this.paused)
        {
            this.spriterGroup.updateAnimation();
        }
    }
}

function SpriterInput(_spriterGroup)
{
    this.spriterGroup = _spriterGroup;
    Object.defineProperty(this, "inputEnabled", {
        set: function(newValue) { _spriterGroup.inputEnableChildren = newValue }
    });

    Object.defineProperty(this, "priorityID", {
        set: function(newValue) {
            _spriterGroup.forEach(function(item){
                item.inputEnabled = true;
                item.input.priorityID = newValue;
            });
        }
    });
}

function loadSpriterFiles(_game, _name)
{
    var path = "anim/";
    _game.load.atlas(_name + "Atlas", path + _name + ".png", path + _name + ".json");
    _game.load.json(_name + "JSON", path + _name + ".scon");
}

function loadSpriter(_game, _jsonSpriter, _atlas, _entityName)
{
    var spriterLoader = new Spriter.Loader();
    var spriterFile = new Spriter.SpriterJSON(_game.cache.getJSON(_jsonSpriter), { imageNameType: Spriter.eImageNameType.NAME_ONLY });
    var spriterData = spriterLoader.load(spriterFile);
    var spriterGroup = new Spriter.SpriterGroup(_game, spriterData, _atlas, _entityName, 0, 100);
    
    for (var ind in spriterGroup.children)
    {
        spriterGroup.children[ind].name = spriterGroup.children[ind]._frame.name;
    }
    
    spriterGroup.getSpriteByName = function(name)
    {
        for (var ind in spriterGroup.children)
        {
            if(spriterGroup.children[ind].name == name)
            {
                return spriterGroup.children[ind];
            }
        }
    }
    
    spriterGroup.animations = new SpriterAnimation(_game, spriterGroup);
    spriterGroup.input = new SpriterInput(spriterGroup);
    spriterGroup.destroy = (
        function(){
            var original_destroy = spriterGroup.destroy;
            return function(a, b){
                _game.updateSignal.remove(spriterGroup.animations.update, spriterGroup.animations);
                original_destroy.call(spriterGroup, a, b);
            }
        })();
    return spriterGroup;
}