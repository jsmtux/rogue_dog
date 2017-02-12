var guiObj = {
    id: 'main',
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
                      id: 'btn1',
                      text: 'btn',
                      font: {
                          size: '42px',
                          family: 'Skranji',
                          color: 'red'
                      },
                      component: 'Button',
                      position: 'center',
                      width: 190,
                      height: 80
                  },
                  {
                      component: 'Layout',
                      position: { x: 0, y: 0 },
                      width: 250,
                      height: 150,
                      layout: [1, 4],
                      children: [
                          { id: 'radio1', text: 'choice 1', component: 'Radio', group: 1, position: 'center', width: 30, height: 30 },
                          { id: 'radio2', text: 'choice 2', component: 'Radio', group: 1, position: 'center', width: 30, height: 30 },
                          { id: 'radio3', text: 'choice 3', component: 'Radio', group: 1, position: 'center', width: 30, height: 30 },
                          { id: 'radio4', text: 'choice 4', component: 'Radio', group: 1, position: 'center', width: 30, height: 30 }
                      ]
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
          component: 'Checkbox',

          position: 'center',
          text: 'Checkbox',
          width: 30,
          height: 30

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

GUIManager.prototype.showUI = function(_uiObj)
{
    var guiContainer = EZGUI.create(guiObj, 'metalworks');

    EZGUI.components.btn1.on('click', function (event) {
        console.log('clicked', event);
    });
}