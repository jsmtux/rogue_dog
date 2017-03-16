var PlayerMenuUI = {
    id: 'playerMenu',
    component: 'Window',
    header: { position: { x: 0, y: 0 }, height: 40, text: 'Player menu' },
    draggable: true,
    padding: 4,
    position: { x: 20, y: 10 },
    width: 600,
    height: 550,


    layout: [1, 3],
    children: [
        {
            component: 'Layout',
            skin:'List',
            position: { x: 0, y: 5 },
            width: 590,
            height: 160,
            layout: [2, 2],

            children: [
                  {
                      component: 'Layout',
                      position: { x: 0, y: 0 },
                      width: 250,
                      height: 150,
                      layout: [1, 4],
                      children: []
                  },
                  {
                      component: 'Layout',
                      skin:'List',
                      position: { x: 0, y: 0 },
                      width: 250,
                      height: 150,
                      layout: [2, 4],
                      children: [{
                          id: 'btn1',
                          text: 'Head',
                          font: {
                              size: '24px',
                              family: 'Skranji',
                              color: 'red'
                          },
                          component: 'Label',
                          position: 'left',
                          width: 100,
                          height: 40
                      },
                      {
                          component: 'Layout',
                          position: { x: 0, y: 0 },
                          position: 'right',
                          width: 100,
                          height: 40,
                          children: []
                      },
                      {
                          id: 'neckBtn',
                          text: 'Neck',
                          font: {
                              size: '24px',
                              family: 'Skranji',
                              color: 'red'
                          },
                          component: 'Label',
                          position: 'left',
                          width: 100,
                          height: 40
                      },
                      {
                          component: 'Layout',
                          position: { x: 0, y: 0 },
                          position: 'right',
                          width: 100,
                          height: 40,
                          children: []
                      },
                      {
                          id: 'bodyBtn',
                          text: 'Body',
                          font: {
                              size: '24px',
                              family: 'Skranji',
                              color: 'red'
                          },
                          component: 'Label',
                          position: 'left',
                          width: 100,
                          height: 40
                      },
                      {
                          component: 'Layout',
                          position: { x: 0, y: 0 },
                          position: 'right',
                          width: 100,
                          height: 40,
                          children: []
                      },
                      {
                          id: 'feetBtn',
                          text: 'Feet',
                          font: {
                              size: '24px',
                              family: 'Skranji',
                              color: 'red'
                          },
                          component: 'Label',
                          position: 'left',
                          width: 100,
                          height: 40
                      },
                      {
                          component: 'Layout',
                          position: { x: 0, y: 0 },
                          position: 'right',
                          width: 100,
                          height: 40,
                          children: []
                      }]
                  }
            ]
        },
        {
            id: 'hlist1',
            component: 'List',
            width: 570,
            height: 240,
            layout: [3, 3],
            position: { x: 0, y: 5 },
            children: [
                { id:'accesoryGrid00', component: 'Button', text:'', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid01', component: 'Button', text:'', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid02', component: 'Button', text:'', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid10', component: 'Button', text:'', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid11', component: 'Button', text:'', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid12', component: 'Button', text:'', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid20', component: 'Button', text:'', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid21', component: 'Button', text:'', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid22', component: 'Button', text:'', position: 'center', width: 180, height: 80 },
            ]
        },
        {
            id: 'btn2',
            text: 'Back',
            font: {
              size: '24px',
              family: 'Skranji',
              color: 'red'
            },
            component: 'Button',
            position: { x: 205, y: 100 },
            width: 190,
            height: 40
        }
    ]
}

var lostGameUI = {
	id: 'lostGame',
	component: 'Window',
	
	padding: 4,
	position: { x: 40, y: 20 },
	width: 500,
	height: 300,
	layout:[1,3],
	children: [
		{
			component: 'Label',
			text : 'You Lost!',
		  font: {
		      size: '35px',
		      color: 'white'
		  },	
		  position: 'center',		  
		  width: 100,
		  height: 60			
		},
		null,
		{
		  id: 'reloadButton',
		  text: 'Retry',
		  component: 'Button',
		  position: 'center',
		  font: {
		      size: '25px',
		      color: 'orange'
		  },		  
		  width: 180,
		  height: 60
		}	
	]	
}

var cardUI = {
	id: 'cardUI',
	component: 'Window',
	
	padding: 0,
	position: { x: 0, y: 0 },
	width: 280,
	height: 400,
	image: 'cardbg',
	layout:[1,3],
	children: [
		{
		  component: 'Label',
		  text : 'Card title',
	      position: { x: 45, y: 40 },
		  font: {
		      size: '35px',
		      color: 'black'
		  },
		  width: 190,
		  height: 30,
		},
		{
		  component: 'Layout',
	      position: { x: 50, y: -45 },
		  width: 180,
		  height: 180,
	      image: 'heart_icon',
		},
		{
		  id: 'description',
		  wordWrapWidth: 200,
		  text: 'LONG TEXT LONG TEXT LONG TEX\nLONG TEXT LONG TEXT LONG TEX\nLONG TEXT LONG TEXT LONG TEX\nLONG TEXT LONG TEXT LONG TEX',
		  component: 'Label',
	      position: { x: 40, y: 20 },
		  font: {
		      size: '13px',
		      color: 'black',
              wordWrap: true,
              wordWrapWidth: 200
		  },		  
		  width: 210,
		  height: 80
		}	
	]	
}

class GUIManager
{
    constructor()
    {//EZgui does not like this to be done more than once
        this.playerMenuUI = new PlayerMenuGUIElement(PlayerMenuUI);
        this.lostUI = new GUIElement(lostGameUI);
    }
    static preload(_game)
    {
        EZGUI.renderer = _game.renderer;
        _game.load.EZGUITheme('metalworks', 'lib/ezgui_assets/metalworks-theme/metalworks-theme.json');
        _game.load.image('cardbg', 'img/card/card_bg.png');
    }
    
    create(_game)
    {        
        this.UIGroup = _game.add.group();
        this.UIGroup.fixedToCamera = true;
        
        this.game = _game;
        
        this.game.updateSignal.add(this.update, this);
    }
    
    update()
    {
        //this.game.world.bringToTop(this.UIGroup);
    }
    
    addToUI(_sprite)
    {
        this.UIGroup.add(_sprite);
    }

    getCardUI(_title, _text, _logoName)
    {
        var currentCardUI = cardUI;
        currentCardUI.children[0].text = _title;
        currentCardUI.children[1].image = _logoName;
        currentCardUI.children[2].text = _text;
        
        var cardGuiContainer = new GUIElement(cardUI);
        cardGuiContainer.visible = false;
        
        return cardGuiContainer;
    }
}

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

class PlayerMenuGUIElement extends GUIElement
{
    constructor(_container)
    {
        super( _container);
        this.gridName = "accesoryGrid";
        this.spriterGroup;
        
        for (var i = 0; i < 3; i++)
        {
            for (var j = 0; j < 3; j++)
            {
                var cellName = this.gridName + i + j;
                this.addCallback(cellName, 'click', cellName);
            }
        }
        
        this.itemsList = [];
        this.appliedItemsList = [];
    }
    
    setCharacterSpriteGroup(_spriterGroup)
    {
        if (this.spriterGroup)
        {
            EZGUI.Compatibility.GUIDisplayObjectContainer.globalPhaserGroup.removeChild(this.spriterGroup);
        }
        this.spriterGroup = _spriterGroup;
        EZGUI.Compatibility.GUIDisplayObjectContainer.globalPhaserGroup.addChild(_spriterGroup);
        
        this.spriterGroup.visible = this.guiContainer.visible;
    }
    
    setItemsList(_list)
    {
        this.itemsList = _list;
        var size = 3;
        for (var i = 0; i < size; i++)
        {
            for (var j = 0; j < size; j++)
            {
                var cellName = this.gridName + j + i;
                var cell = EZGUI.components[cellName];
                var index = i + j* size;
                if (index >= _list.length)
                {
                    cell.visible = false;
                }
                else
                {
                    cell.text = _list[index].getName();
                }
            }
        }
        
    }
    
    show()
    {
        this.guiContainer.visible = true;
        if (this.spriterGroup)
        {
            this.spriterGroup.visible = true;
        }
    }
    
    
    hide()
    {
        this.guiContainer.visible = false;
        if (this.spriterGroup)
        {
            this.spriterGroup.visible = false;
            GUIElement.prototype.cbHandler.call(this, 'appliedElements', this.appliedItemsList);
        }
    }
    
    cbHandler(_name, _event)
    {
        if (_name.startsWith(this.gridName))
        {
            var i = parseInt(_name.charAt(this.gridName.length));
            var j = parseInt(_name.charAt(this.gridName.length + 1));
            console.log(i, j);
            var chosenAccesory = this.itemsList[i * 3 + j];
            
            var chosenAccesoryRestrictions = chosenAccesory.getRestriction();
            if (chosenAccesoryRestrictions !== undefined)
            {
                for (var appliedAccesory in this.appliedItemsList)
                {
                    var curAccesory = this.appliedItemsList[appliedAccesory];
                    if (curAccesory.getRestriction() == chosenAccesoryRestrictions)
                    {
                        curAccesory.remove(this.spriterGroup);
                        this.appliedItemsList.splice(appliedAccesory);
                    }
                }
            }
            
            chosenAccesory.apply(this.spriterGroup);
            this.appliedItemsList.push(chosenAccesory);
        }
        else
        {
            GUIElement.prototype.cbHandler.call(this, _name, _event);
        }
    }
}
