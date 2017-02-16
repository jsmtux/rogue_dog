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
                { id:'accesoryGrid01', component: 'Button', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid02', component: 'Button', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid10', component: 'Button', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid11', component: 'Button', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid12', component: 'Button', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid20', component: 'Button', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid21', component: 'Button', position: 'center', width: 180, height: 80 },
                { id:'accesoryGrid22', component: 'Button', position: 'center', width: 180, height: 80 },
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

function GUIManager()
{
}

GUIManager.preload = function(_game)
{
    EZGUI.renderer = _game.renderer;
    _game.load.EZGUITheme('metalworks', 'js/lib/ezgui_assets/metalworks-theme/metalworks-theme.json');
}

GUIManager.prototype.create = function()
{
    this.playerMenuUI = new PlayerMenuGUIElement(PlayerMenuUI);
}

function GUIElement(_container)
{
    this.guiContainer = EZGUI.create(_container, 'metalworks');
    this.guiContainer.visible = false;
}

GUIElement.prototype.addCallback = function(_element, _event, _name)
{
    var self = this;
    EZGUI.components[_element].on(_event, function(event){self.cb.call(self.cbEnv, _name, event)});
}

GUIElement.prototype.registerCbReceiver = function(_cb, _cbEnv)
{
    this.cb = _cb;
    this.cbEnv = _cbEnv;
}

GUIElement.prototype.show = function()
{
    this.guiContainer.visible = true;
}


GUIElement.prototype.hide = function()
{
    this.guiContainer.visible = false;
}

function PlayerMenuGUIElement(_container)
{
    GUIElement.call(this, _container);
    this.spriterGroup;
}

PlayerMenuGUIElement.prototype = Object.create(GUIElement.prototype);
PlayerMenuGUIElement.prototype.constructor = PlayerMenuGUIElement;

PlayerMenuGUIElement.prototype.setCharacterSpriteGroup = function(_spriterGroup)
{
    if (this.spriterGroup)
    {
        EZGUI.Compatibility.GUIDisplayObjectContainer.globalPhaserGroup.removeChild(this.spriterGroup);
    }
    this.spriterGroup = _spriterGroup;
    EZGUI.Compatibility.GUIDisplayObjectContainer.globalPhaserGroup.addChild(_spriterGroup);
    
    this.spriterGroup.visible = this.guiContainer.visible;
}

PlayerMenuGUIElement.prototype.setItemsList = function(_list)
{
    var gridName = "accesoryGrid";
    var size = 3;
    for (var i = 0; i < size; i++)
    {
        for (var j = 0; j < size; j++)
        {
            var cellName = gridName + i + j;
                EZGUI.components[cellName].text = cellName;
            if (i + j * size > _list.length)
            {
                EZGUI.components[cellName].visible = false;
            }
        }
    }
    
}

PlayerMenuGUIElement.prototype.show = function()
{
    this.guiContainer.visible = true;
    if (this.spriterGroup)
    {
        this.spriterGroup.visible = true;
    }
}


PlayerMenuGUIElement.prototype.hide = function()
{
    this.guiContainer.visible = false;
    if (this.spriterGroup)
    {
        this.spriterGroup.visible = false;
    }
}
