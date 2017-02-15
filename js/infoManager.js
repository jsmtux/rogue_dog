function InfoManager(_game)
{
    this.game = _game;
    this.showing = false;
    this.infoElements = {};
    this.beeHelp = new BeeHelp(_game);
    this.playerHelp = new PlayerMenu(_game);
}

InfoManager.preload = function(_game)
{
    _game.load.image('question_icon', './img/question_icon.png');
    PopUpMenu.preload(_game);
    BeeHelp.preload(_game);
    PlayerMenu.preload(_game);
}

InfoManager.prototype.create = function()
{
    this.infoIcon = this.game.add.sprite(resolution.x - 50, 25, 'question_icon');
    this.infoIcon.inputEnabled = true;
    this.infoIcon.input.priorityID = 1;
    this.infoIcon.events.onInputDown.add(this.show, this);
}

InfoManager.prototype.show = function()
{
    this.graphics = this.game.add.graphics(0,0);
    this.graphics.beginFill(0x000000, 0.5);
    this.graphics.lineTo(resolution.x, 0);
    this.graphics.lineTo(resolution.x, resolution.y)
    this.graphics.lineTo(0, resolution.y);
    this.graphics.endFill();
    this.showing = true;
    
    //this.graphics.inputEnabled = true
    //this.graphics.input.priorityID = 1;
    //this.graphics.events.onInputDown.add(this.hide, this);
    
    var self = this;
    
    for(var elementName in this.infoElements)
    {
        console.log("element name is " + elementName);
        var curSprite = this.infoElements[elementName];
        this.game.world.bringToTop(curSprite);
        curSprite.animations.stop();
        curSprite.inputEnabled = true;
        curSprite.input.priorityID = 2;
        curSprite.eventManager = function(_name){return function(){self.showHelp(_name)}}(elementName);
        curSprite.events.onInputDown.add(curSprite.eventManager);
    }
}

InfoManager.prototype.hide = function()
{
    this.graphics.events.onInputDown.remove(this.hide, this);
    this.graphics.destroy();
    this.showing = false;
    
    for(var elementName in this.infoElements)
    {
        var curSprite = this.infoElements[elementName];
        curSprite.animations.play();
        curSprite.events.onInputDown.remove(curSprite.eventManager);
        delete curSprite.eventManager;
    }
    
    this.beeHelp.hide();
    //this.playerHelp.hide();
}

InfoManager.prototype.shouldPause = function()
{
    return this.showing;
}

InfoManager.prototype.register = function(_infoName, _sprite)
{
    this.infoElements[_infoName] = _sprite;
}

InfoManager.prototype.unregister = function(_sprite)
{
    for(name in this.infoElements)
    {
        if (this.infoElements[name] == _sprite)
        {
            delete this.infoElements[name];
            break;
        }
    }
}

InfoManager.prototype.showHelp = function(_helpName)
{
    console.log("Help for " + _helpName);
    if (_helpName == "player")
    {
        this.playerHelp.show();
    }
    else
    {
        this.beeHelp.show();
    }
}

function PopUpMenu(_game)
{
    this.game = _game;
    this.shown = false;
    this.sprite;
}

PopUpMenu.preload = function(_game)
{
    _game.load.image('ui_backgound', './img/ui/ui_background.png');
}

PopUpMenu.prototype.show = function(_title)
{
    this.sprite = this.game.add.sprite(25, 25, 'ui_backgound');
    this.sprite.x = resolution.x / 2 - this.sprite.width / 2;
    this.sprite.y = resolution.y / 2 - this.sprite.height / 2;
    
    this.title = this.game.add.text(resolution.x / 2, this.sprite.y + 15, _title, {
        font: "65px Arial",
        fill: "#000000",
        align: "center"
    });
    this.title.anchor.setTo(0.5, 0.0);
    this.shown = true;
}

PopUpMenu.prototype.hide = function()
{
    if (this.shown)
    {
        this.sprite.destroy();
        this.title.destroy();
        this.shown = false;
    }
}

function BeeHelp(_game)
{
    PopUpMenu.prototype.constructor.call(this, _game);
    this.videoSprite;
}

BeeHelp.prototype = Object.create(PopUpMenu.prototype);
BeeHelp.prototype.constructor = BeeHelp;

BeeHelp.preload = function(_game)
{
    _game.load.video('bee_defend', './video/bee_defend.mp4');
}

BeeHelp.prototype.show = function()
{
    PopUpMenu.prototype.show.call(this, "Bee help:");
    /*
    this.video = this.game.add.video('bee_defend');
    this.videoSprite = this.video.addToWorld(50, 50);
    this.video.play();*/
}

BeeHelp.prototype.hide = function()
{
    PopUpMenu.prototype.hide.call(this);
    if (this.shown)
    {
        /*this.videoSprite.destroy();
        this.video.destroy();*/
    }
}

function PlayerMenu(_game)
{
    this.game = _game;
    this.shown = false;
}

PlayerMenu.prototype = Object.create(PopUpMenu.prototype);
PlayerMenu.prototype.constructor = PlayerMenu;

PlayerMenu.preload = function(_game)
{
    // we should be preloading the spriter json and the dog atlas
    // but is already loaded in player.js
}

PlayerMenu.prototype.show = function()
{
    this.ui = ServiceLocator.guiManager.createUI(PlayerMenuUI, this.uiCallback, this);
    this.ui.addCallback('btn1', 'click', 'hat');
    this.ui.addCallback('btn2', 'click', 'back');
    
    this.spriterGroup = loadSpriter(this.game, "dogJSON", "dogAnimAtlas", "entity_000");
    this.spriterGroup.position.setTo(150, 140);
    
    this.spriterGroup.scale.set(0.2, 0.2);
    this.spriterGroup.animations.play("idle");
    
    EZGUI.Compatibility.GUIDisplayObjectContainer.globalPhaserGroup.addChild(this.spriterGroup);
    this.shown = true;
}

PlayerMenu.prototype.uiCallback = function(_name, _event)
{
    console.log("Received event with name " + _name);
    if (_name == "hat")
    {
        this.spriterGroup.pushCharMap("hat");
    }
    if (_name == "back")
    {
        this.hide();
    }
}

PlayerMenu.prototype.hide = function()
{
    if (this.shown)
    {
        this.spriterGroup.destroy(true);
        this.ui.destroy();
        ServiceLocator.infoManager.hide();
    }
    this.shown = false;
}