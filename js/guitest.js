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
            layout: [2, 1],

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
                      id: 'btn1',
                      text: 'Hat!',
                      font: {
                          size: '42px',
                          family: 'Skranji',
                          color: 'red'
                      },
                      component: 'Button',
                      position: 'center',
                      width: 190,
                      height: 80
                  }
            ]
        },

    {
        id: 'hlist1',
        component: 'List',

        padding: 3,
        position: 'center',
        width: 400,
        height: 150,
        layout: [4, null],
        children: [
            { component: 'Button', position: 'center', width: 90, height: 120 },
            null,
            {  component: 'Button', position: 'center', width: 90, height: 120 },
            {  component: 'Button', position: 'center', width: 90, height: 120 },
            {  component: 'Button', position: 'center', width: 90, height: 120 },
            { component: 'Button', position: 'center', width: 90, height: 120 },
            { component: 'Button', position: 'center', width: 90, height: 120 },
            { component: 'Button', position: 'center', width: 90, height: 120 },
            { component: 'Button', position: 'center', width: 90, height: 120 },
            { component: 'Button', position: 'center', width: 90, height: 120 },
            { component: 'Button', position: 'center', width: 90, height: 120 },
        ]
    },
    {
        id: 'btn2',
        text: 'Back',
        font: {
          size: '42px',
          family: 'Skranji',
          color: 'red'
        },
        component: 'Button',
        position: 'center',
        width: 190,
        height: 80
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