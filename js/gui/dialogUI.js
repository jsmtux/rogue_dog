var dialogUI =
{
	id: 'dialogUI',
	component: 'Window',
	
	padding: 0,
	position: { x: 50, y: 50 },
	width: 700,
	height: 350,
	layout:[1, 2],
	children: [
		{
		  component: 'Label',
		  text : 'Dialog thing',
		  position: 'center',
		  font: {
		      size: '20px',
		      color: 'black',
              wordWrap: true,
              wordWrapWidth: 700
		  },
		  width: 600,
		  height: 100,
		},
		{
		    component: 'Layout',
	        layout:[1, 3],
	        position: { x: 50, y: -50 },
		    width: 600,
		    height: 200,
		    children: [
		        {
        		  id: 'option1Button',
        		  text: 'option1',
        		  component: 'Button',
        		  position: 'center',
        		  font: {
        		      size: '25px',
        		      color: 'white'
        		  },		  
        		  width: 400,
        		  height: 50
        		},
        		{
        		  id: 'option2Button',
        		  text: 'option2',
        		  component: 'Button',
        		  position: 'center',
        		  font: {
        		      size: '25px',
        		      color: 'white'
        		  },		  
        		  width: 400,
        		  height: 50
        		},
        		{
        		  id: 'option3Button',
        		  text: 'option3',
        		  component: 'Button',
        		  position: 'center',
        		  font: {
        		      size: '25px',
        		      color: 'white'
        		  },		  
        		  width: 400,
        		  height: 50
        		}
    		]
		}
	]
}