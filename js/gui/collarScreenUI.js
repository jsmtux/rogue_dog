class CollarScreenUI extends GuiElement
{
    constructor()
    {
        super();
        this.sourcePoint = new Phaser.Point(0, 0);
        this.targetPoint;
        
        this.minSize = new Phaser.Point(60, 20);
        this.rectangle = new Phaser.Rectangle(0, 0, this.minSize.x, this.minSize.y);
        this.arrowHeight = 50;
        this.arrowHalfWidth = 20;
        
        this.lines = [];
        
        this.widgetList = [];
    }
    
    drawBg(_rectangle, _source)
    {
        var borderWidth = 10;
        this.bmd.clear();
        
        this.bmd.beginFill(0xFFFFFF);
        this.bmd.lineStyle(4, 0x555555, 1.0);
        this.bmd.moveTo(_source.x, _source.y);
        this.bmd.lineTo(this.arrowHalfWidth, _rectangle.height);
        this.bmd.lineTo(borderWidth, _rectangle.height);
        this.bmd.quadraticCurveTo(_rectangle.x, _rectangle.bottomRight.y, _rectangle.x, _rectangle.bottomRight.y - borderWidth);
        this.bmd.lineTo(_rectangle.x, _rectangle.y + borderWidth);
        this.bmd.quadraticCurveTo(_rectangle.x, _rectangle.y, _rectangle.x + borderWidth, _rectangle.y);
        this.bmd.lineTo(_rectangle.bottomRight.x - borderWidth, _rectangle.y);
        this.bmd.quadraticCurveTo(_rectangle.bottomRight.x, _rectangle.y, _rectangle.bottomRight.x, _rectangle.y + borderWidth);
        this.bmd.lineTo(_rectangle.bottomRight.x, _rectangle.bottomRight.y - borderWidth);
        this.bmd.quadraticCurveTo(_rectangle.bottomRight.x, _rectangle.bottomRight.y, _rectangle.bottomRight.x - borderWidth, _rectangle.bottomRight.y);
        this.bmd.lineTo(_rectangle.x + 2 * this.arrowHalfWidth, _rectangle.bottomRight.y);
        this.bmd.lineTo(_source.x, _source.y);
        
        this.bmd.endFill();
    }
    
    create(_game, _group)
    {
        this.group = _group;
        
        this.bmd = _game.add.graphics();
        this.group.add(this.bmd);
        
        this.screenFilter = _game.add.filter('Screen');
        this.bmd.filters = [this.screenFilter];

        ServiceLocator.registerListener(this.dialogSourceUpdated, this, "DialogSourceUpdated");
        
        this.game = _game;
    }
    
    update()
    {
        if (!this.targetPoint)
        {
            return;
        }
        var groupTargetPos = this.targetPoint.clone().subtract(50, this.arrowHeight + this.rectangle.height);
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
    
    pushWidget(_widget)
    {
        var last = this.widgetList[this.widgetList.length - 1]
        if (last)
        {
            last.setVisible(false);
        }

        this.widgetList.push(_widget);

        _widget.create(this.game);
        
        _widget.addToScreenGroup(this.group, CollarScreenUI.padding, CollarScreenUI.padding);
        this.rectangle.width = _widget.width + CollarScreenUI.padding * 2;
        this.rectangle.height = _widget.height + CollarScreenUI.padding * 2;
    }
    
    popWidget()
    {
        var widget = this.widgetList.pop();
        
        if (widget)
        {
            widget.destroy();
        }
        
        var last = this.widgetList[this.widgetList.length - 1]
        if (last)
        {
            last.setVisible(true);
            this.rectangle.width = last.width + CollarScreenUI.padding * 2;
            this.rectangle.height = last.height + CollarScreenUI.padding * 2;
        }
    }
    
    dialogSourceUpdated(_msg)
    {
        this.targetPoint = _msg.getPosition();
    }
}

CollarScreenUI.padding = 5;

class ScreenWidget
{
    constructor(_width, _height)
    {
        this.width = _width;
        this.height = _height;
    }
    
    addToScreenGroup(_group, _x, _y)
    {
        console.err("Destroy not properly implemented on addToScreenGroup");
    }
    
    destroy()
    {
        console.err("Destroy not properly implemented on ScreenWidget");
    }
    
    setVisible(_visible)
    {
        console.err("setVisible not properly implemented on ScreenWidget");
    }
}

class FaceScreenWidget extends ScreenWidget
{
    constructor()
    {
        super(50, 50);
    }
    
    create(_game)
    {
        this.faceText = _game.add.bitmapText(5, 5, 'noto_emoji', getCodeForEmoji(":smile:"), 50);
    }
    
    addToScreenGroup(_group, _x, _y)
    {
        _group.add(this.faceText);
        this.faceText.x = _x;
        this.faceText.y = _y;
    }
    
    setFace(_charName)
    {
        this.faceText.text = getCodeForEmoji(_charName);
    }
    
    destroy()
    {
        this.faceText.destroy();
    }
    
    setVisible(_visible)
    {
        this.faceText.visible = _visible;
    }
}

class ImageScreenWidget extends ScreenWidget
{
    constructor(_imgName)
    {
        super();
        this.imgName = _imgName;
    }
    
    create(_game)
    {
        this.logo = _game.add.sprite(0, 0, this.imgName);
        this.width = this.logo.width;
        this.height = this.logo.height;
    }
    
    addToScreenGroup(_group, _x, _y)
    {
        _group.add(this.logo);
        this.logo.x = _x;
        this.logo.y = _y;
    }
    
    destroy()
    {
        this.logo.destroy();
    }
    
    setVisible(_visible)
    {
        this.logo.visible = _visible;
    }
}

class TextScreenWidget extends ScreenWidget
{
    constructor(_text)
    {
        super();
        this.textValue = _text;
    }
    
    create(_game)
    {
        this.text = _game.add.bitmapText(0, 0, 'collar', this.textValue, 20);
        this.width = this.text.width;
        this.height = this.text.height;
    }
    
    addToScreenGroup(_group, _x, _y)
    {
        _group.add(this.text);
        this.text.x = _x;
        this.text.y = _y;
    }
    
    destroy()
    {
        this.text.destroy();
    }
    
    setVisible(_visible)
    {
        this.text.visible = _visible;
    }
}

class MarginsScreenWidget extends ScreenWidget
{
    constructor(_widget, _xMargin, _yMargin)
    {
        super();
        this.widget = _widget;
        this.xMargin = _xMargin;
        this.yMargin = _yMargin;
    }
    
    create(_game)
    {
        this.widget.create(_game);
        this.width = this.widget.width + this.xMargin * 2;
        this.height = this.widget.height + this.yMargin * 2;
    }
    
    addToScreenGroup(_group, _x, _y)
    {
        this.widget.addToScreenGroup(_group, _x + this.xMargin, _y + this.yMargin);
    }
    
    destroy()
    {
        this.widget.destroy();
    }
    
    setVisible(_visible)
    {
        this.widget.visible = _visible;
    }
}

class HGroupScreenWidget extends ScreenWidget
{
    constructor(_widgetList)
    {
        super();
        this.widgetList = _widgetList;
    }
    
    create(_game)
    {
        var size = new Phaser.Point(0, 0);
        for(var ind in this.widgetList)
        {
            var curWidget = this.widgetList[ind];
            curWidget.create(_game);
            if (size.y < curWidget.height)
            {
                size.y = curWidget.height;
            }
            size.x += CollarScreenUI.padding + curWidget.width;
        }
        this.width = size.x;
        this.height = size.y;
    }
    
    addToScreenGroup(_group, _x, _y)
    {
        var x = _x;
        for(var ind in this.widgetList)
        {
            this.widgetList[ind].addToScreenGroup(_group, x, _y);
            x += CollarScreenUI.padding + this.widgetList[ind].width;
        }
    }
    
    destroy()
    {
        for(var ind in this.widgetList)
        {
            this.widgetList[ind].destroy();
        }
    }
    
    setVisible(_visible)
    {
        for(var ind in this.widgetList)
        {
            this.widgetList[ind].setVisible(_visible);
        }
    }
}

class VGroupScreenWidget extends ScreenWidget
{
    constructor(_widgetList)
    {
        super();
        this.widgetList = _widgetList;
    }
    
    create(_game)
    {
        var size = new Phaser.Point(0, 0);
        for(var ind in this.widgetList)
        {
            var curWidget = this.widgetList[ind];
            curWidget.create(_game);
            if (size.x < curWidget.width)
            {
                size.x = curWidget.width;
            }
            size.y += CollarScreenUI.padding + curWidget.height;
        }
        this.width = size.x;
        this.height = size.y;
    }
    
    addToScreenGroup(_group, _x, _y)
    {
        var y = _y;
        for(var ind in this.widgetList)
        {
            this.widgetList[ind].addToScreenGroup(_group, _x, y);
            y += CollarScreenUI.padding + this.widgetList[ind].height;
        }
    }
    
    destroy()
    {
        for(var ind in this.widgetList)
        {
            this.widgetList[ind].destroy();
        }
    }
    
    setVisible(_visible)
    {
        for(var ind in this.widgetList)
        {
            this.widgetList[ind].setVisible(_visible);
        }
    }
}

class SeparatorScreenWidget extends ScreenWidget
{
    constructor(_hSeparation, _vSeparation)
    {
        super();
        this.hSeparation = _hSeparation;
        this.vSeparation = _vSeparation;
    }
    
    create()
    {
        this.width = this.hSeparation;
        this.height = this.vSeparation;
    }
    
    addToScreenGroup(_group, _x, _y)
    {
        
    }
    
    destroy()
    {
        
    }
    
    setVisible(_visible)
    {
    }
}