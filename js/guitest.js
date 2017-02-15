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
                { id:'btnn',component: 'Button', position: 'center', width: 180, height: 80 },
                { component: 'Button', position: 'center', width: 180, height: 80 },
                { component: 'Button', position: 'center', width: 180, height: 80 },
                { component: 'Button', position: 'center', width: 180, height: 80 },
                { component: 'Button', position: 'center', width: 180, height: 80 },
                { component: 'Button', position: 'center', width: 180, height: 80 },
                { component: 'Button', position: 'center', width: 180, height: 80 },
                { component: 'Button', position: 'center', width: 180, height: 80 },
                { component: 'Button', position: 'center', width: 180, height: 80 },
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

GUIManager.prototype.createUI = function(_uiObj, _callback, _callbackEnv)
{
    var guiContainer = EZGUI.create(_uiObj, 'metalworks');

    return new GUIElement(guiContainer, _callback, _callbackEnv);
}

function GUIElement(_container, _cb, _cbEnv)
{
    this.guiContainer = _container;
    this.cb = _cb;
    this.cbEnv = _cbEnv;
}

GUIElement.prototype.addCallback = function(_element, _event, _name)
{
    var self = this;
    EZGUI.components[_element].on(_event, function(event){self.cb.call(self.cbEnv, _name, event)});
}

GUIElement.prototype.destroy = function()
{
    this.guiContainer.destroy();
}