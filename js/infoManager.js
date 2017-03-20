class InfoManager
{
    constructor(_game)
    {
        this.game = _game;
        this.infoElements = {};
        this.beeHelp = new BeeHelp(_game);
        this.playerHelp = new PlayerMenu(_game);
    }
    
    static preload(_game)
    {
        _game.load.image('question_icon', './img/question_icon.png');
        PopUpMenu.preload(_game);
        BeeHelp.preload(_game);
        PlayerMenu.preload(_game);
    }
    
    create()
    {
        /*this.infoIcon = this.game.add.sprite(resolution.x - 50, 25, 'question_icon');
        ServiceLocator.guiManager.addToUI(this.infoIcon);
        this.infoIcon.inputEnabled = true;
        this.infoIcon.input.priorityID = 1;
        this.infoIcon.events.onInputDown.add(this.show, this);
    
        this.playerHelp.create();*/
    }
    
    show()
    {
        this.graphics = this.game.add.graphics(0,0);
        ServiceLocator.guiManager.addToUI(this.graphics);
        this.graphics.beginFill(0x000000, 0.5);
        this.graphics.lineTo(resolution.x, 0);
        this.graphics.lineTo(resolution.x, resolution.y)
        this.graphics.lineTo(0, resolution.y);
        this.graphics.endFill();
        
        
        this.game.setPaused(true);
        
        //this.graphics.inputEnabled = true
        //this.graphics.input.priorityID = 1;
        //this.graphics.events.onInputDown.add(this.hide, this);
        
        var self = this;
        
        for(var elementName in this.infoElements)
        {
            console.log("element name is " + elementName);
            var curSprite = this.infoElements[elementName];
            this.game.world.bringToTop(curSprite);
            curSprite.inputEnabled = true;
            curSprite.input.priorityID = 2;
            curSprite.eventManager = function(_name){return function(){self.showHelp(_name)}}(elementName);
            curSprite.events.onInputDown.add(curSprite.eventManager);
        }
    }
    
    hide()
    {
        this.graphics.events.onInputDown.remove(this.hide, this);
        this.graphics.destroy();
        this.game.setPaused(false);
        
        for(var elementName in this.infoElements)
        {
            var curSprite = this.infoElements[elementName];
            curSprite.animations.play();
            curSprite.events.onInputDown.remove(curSprite.eventManager);
            delete curSprite.eventManager;
        }
        
        this.beeHelp.hide();
        //this.playerHelp.hide();
        this.game.setPaused(false);
    }
    
    register(_infoName, _sprite)
    {
        this.infoElements[_infoName] = _sprite;
    }
    
    unregister(_sprite)
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
    
    showHelp(_helpName)
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
}

class PopUpMenu
{
    constructor(_game)
    {
        this.game = _game;
        this.shown = false;
        this.sprite;
    }
    
    static preload(_game)
    {
        _game.load.image('ui_backgound', './img/ui/ui_background.png');
    }
    
    show(_title)
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
    
    hide()
    {
        if (this.shown)
        {
            this.sprite.destroy();
            this.title.destroy();
            this.shown = false;
        }
    }
}

class BeeHelp extends PopUpMenu
{
    constructor(_game)
    {
        super(_game);
        this.videoSprite;
    }
    
    static preload(_game)
    {
        _game.load.video('bee_defend', './video/bee_defend.mp4');
    }
    
    show()
    {
        PopUpMenu.prototype.show.call(this, "Bee help:");
        /*
        this.video = this.game.add.video('bee_defend');
        this.videoSprite = this.video.addToWorld(50, 50);
        this.video.play();*/
    }
    
    hide()
    {
        PopUpMenu.prototype.hide.call(this);
        if (this.shown)
        {
            /*this.videoSprite.destroy();
            this.video.destroy();*/
        }
    }
}

class PlayerMenu extends PopUpMenu
{
    constructor(_game)
    {
        super();
        this.game = _game;
        this.shown = false;
    }
    
    static preload(_game)
    {
        // we should be preloading the spriter json and the dog atlas
        // but is already loaded in player.js
    }
    
    create()
    {
        this.spriterGroup = loadSpriter(this.game, "dogJSON", "dogAnimAtlas", "entity_000");
        this.spriterGroup.position.setTo(150, 140);
        this.spriterGroup.pushCharMap("NoWool");
        
        this.spriterGroup.scale.set(0.2, 0.2);
        this.spriterGroup.animations.play("idle");
    
        var ui = ServiceLocator.guiManager.playerMenuUI;
        
        ui.addCallback('btn1', 'click', 'hat');
        ui.addCallback('btn2', 'click', 'back');
        
        ui.setCharacterSpriteGroup(this.spriterGroup);
        ui.registerCbReceiver(this.uiCallback, this);
        ui.setItemsList(this.game.player.getItemsList());
    }
    
    show()
    {
        
        ServiceLocator.guiManager.playerMenuUI.show();
        
        this.shown = true;
    }
    
    uiCallback(_name, _event)
    {
        console.log("Received event with name " + _name);
        if (_name == "back")
        {
            this.hide();
        }
        if (_name == "appliedElements")
        {
            this.game.player.setAppliedItems(_event);
        }
    }
    
    hide()
    {
        if (this.shown)
        {
            ServiceLocator.guiManager.playerMenuUI.hide();
            ServiceLocator.infoManager.hide();
        }
        this.shown = false;
    }
}
