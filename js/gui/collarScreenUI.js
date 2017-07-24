class CollarScreenUI extends GuiElement
{
    constructor(_mainState)
    {
        super();
        this.sourcePoint = new Phaser.Point(0, 0);
        this.rectangle = new Phaser.Rectangle(0, 0, 60, 60);
        this.targetPoint;
        this.mainState = _mainState;
    }
    
    drawBg(_rectangle, _source)
    {
        var borderWidth = 10;
        var arrowHalfWidth = 20;
        this.bmd.clear();
        
        this.bmd.beginFill(0xFFFFFF);
        this.bmd.lineStyle(4, 0x555555, 1.0);
        this.bmd.moveTo(_source.x, _source.y);
        this.bmd.lineTo(arrowHalfWidth, _rectangle.height);
        this.bmd.lineTo(borderWidth, _rectangle.height);
        this.bmd.quadraticCurveTo(_rectangle.x, _rectangle.bottomRight.y, _rectangle.x, _rectangle.bottomRight.y - borderWidth);
        this.bmd.lineTo(_rectangle.x, _rectangle.y + borderWidth);
        this.bmd.quadraticCurveTo(_rectangle.x, _rectangle.y, _rectangle.x + borderWidth, _rectangle.y);
        this.bmd.lineTo(_rectangle.bottomRight.x - borderWidth, _rectangle.y);
        this.bmd.quadraticCurveTo(_rectangle.bottomRight.x, _rectangle.y, _rectangle.bottomRight.x, _rectangle.y + borderWidth);
        this.bmd.lineTo(_rectangle.bottomRight.x, _rectangle.bottomRight.y - borderWidth);
        this.bmd.quadraticCurveTo(_rectangle.bottomRight.x, _rectangle.bottomRight.y, _rectangle.bottomRight.x - borderWidth, _rectangle.bottomRight.y);
        this.bmd.lineTo(_rectangle.x + 2 * arrowHalfWidth, _rectangle.bottomRight.y);
        this.bmd.lineTo(_source.x, _source.y);
        
        this.bmd.endFill();
    }
    
    create(_slickUI, _game, _customBmd)
    {
        this.mainState.updateSignal.add(this.update, this);

        this.group = _game.add.group();
        ServiceLocator.renderer.addToUI(this.group);
        
        this.bmd = _game.add.graphics();
        this.group.add(this.bmd);
        
        this.faceText = _game.add.bitmapText(5, 5, 'noto_emoji', getCodeForEmoji(":smile:"), 50);
        this.group.add(this.faceText);
        
        this.screenFilter = _game.add.filter('Screen');
        
        this.bmd.filters = [this.screenFilter];
        
        ServiceLocator.registerListener(this.dialogSourceUpdated, this, "DialogSourceUpdated");
    }
    
    update()
    {
        var groupTargetPos = this.targetPoint.clone().subtract(50, 100);
        if (!this.group.x === 0 && this.group.y === 0)
        {
            this.group.x = groupTargetPos.x;
            this.group.y = groupTargetPos.y;
        }
        else
        {
            var current = new Phaser.Point(this.group.x, this.group.y);
            var dist = current.distance(groupTargetPos) * 0.1;
            var vector = current.subtract(groupTargetPos.x, groupTargetPos.y);
            vector.normalize();
            vector.multiply(dist,dist);
            this.group.x -= vector.x;
            this.group.y -= vector.y;
        }
        this.sourcePoint = this.targetPoint.clone().subtract(this.group.x, this.group.y);
        
        this.screenFilter.time = performance.now() / 1000;
        this.screenFilter.height = this.group.y;
        this.drawBg(this.rectangle, this.sourcePoint);
    }
    
    dialogSourceUpdated(_msg)
    {
        this.targetPoint = _msg.getPosition();
    }
    
    setFace(_charName)
    {
        this.faceText.text = getCodeForEmoji(_charName);
    }
}
