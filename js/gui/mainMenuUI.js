var mainMenuUI = {
	id: 'Main menu',
	component: 'Window',
	
	padding: 10,
	position: { x: 400, y: 100 },
	width: 300,
	height: 400,
	layout:[1,4],
	children: [
		{
			component: 'Label',
			text : 'ROGUE DOG',
		  font: {
		      size: '35px',
		      color: 'white'
		  },	
		  position: 'center',		  
		  width: 100,
		  height: 60			
		},
		{
		  id: 'playButton',
		  text: 'Story mode',
		  component: 'Button',
		  position: 'center',
		  font: {
		      size: '25px',
		      color: 'white'
		  },		  
		  width: 180,
		  height: 60
		},
		{
		  id: 'endlessButton',
		  text: 'Endless',
		  component: 'Button',
		  position: 'center',
		  font: {
		      size: '25px',
		      color: 'white'
		  },		  
		  width: 180,
		  height: 60
		},
		{
		  id: 'optionsButton',
		  text: 'Options',
		  component: 'Button',
		  position: 'center',
		  font: {
		      size: '25px',
		      color: 'white'
		  },		  
		  width: 180,
		  height: 60
		}
	]	
}