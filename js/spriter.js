
function SpriterAnimation(_game, _spriterGroup)
{
    this.spriterGroup = _spriterGroup;
    this.currentAnimation = -1;
    this.playing = false;
    _game.updateSignal.add(this.update, this);
}

SpriterAnimation.prototype.play = function(_name)
{
    this.spriterGroup.playAnimationByName(_name);
    this.playing = true;
}

SpriterAnimation.prototype.stop = function()
{
    this.playing = false;
}

SpriterAnimation.prototype.update = function()
{
    if (this.playing)
    {
        this.spriterGroup.updateAnimation();
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

function loadSpriter(_game, _jsonSpriter, _atlas, _entityName)
{
    var spriterLoader = new Spriter.Loader();
    var spriterFile = new Spriter.SpriterJSON(_game.cache.getJSON(_jsonSpriter), { imageNameType: Spriter.eImageNameType.NAME_ONLY });
    var spriterData = spriterLoader.load(spriterFile);
    var spriterGroup = new Spriter.SpriterGroup(_game, spriterData, _atlas, _entityName, 0, 100);
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