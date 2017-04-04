var lostGameUI = {
	id: 'lostGame',
	component: 'Window',
	header: { id: 'ttl', skin: 'blueheader', position: { x: 0, y: 0 }, height: 40, text: 'You lost!',font: {
		      size: '35px',
		      color: 'white'
		  }},
	
	padding: 4,
	position: { x: 40, y: 20 },
	width: 500,
	height: 300,
	layout:[2,1],
	children: [
    {
	  id: 'reloadButton',
	  text: 'Retry',
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
	  id: 'backMenuButton',
	  text: 'Main menu',
	  component: 'Button',
	  position: 'center',
	  font: {
	      size: '25px',
	      color: 'white'
	  },		  
	  width: 180,
	  height: 60
    }]
}
