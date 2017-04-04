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