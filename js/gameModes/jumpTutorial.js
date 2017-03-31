class JumpTutorial extends GameMode
{
    constructor(_game, _player)
    {
        super();
        this.game = _game;
        this.player = _player;
    }
    
    static preload(_game)
    {
    }

    update()
    {
        this.updateTrajectoryImage();
    }
    
    updateTrajectoryImage()
    {
        var bmd = ServiceLocator.inputManager.getBmd();
        bmd.clear();
        var curAngle = ServiceLocator.inputManager.playerDirectionGesture.curAngle;
        if (curAngle !== undefined)
        {
            var playerPos = this.player.getPosition();
            var cameraPos = ServiceLocator.camera.getPosition();
            var relativePlayerPos = playerPos.subtract(cameraPos.x, cameraPos.y);
            var alpha = 1.0;
            
            bmd.moveTo(relativePlayerPos.x,relativePlayerPos.y);
            var curPos = relativePlayerPos.clone();
            var iterationAdvance = 1;
            var jumpAcceleration = new Phaser.Point();
            var jumpStrength = this.player.jumpStrenght;
            jumpAcceleration.y = jumpStrength * -Math.sin(Math.radians(curAngle));
            jumpAcceleration.x = jumpStrength * Math.cos(Math.radians(curAngle)) + this.player.curSpeed;
            while(relativePlayerPos.y >= curPos.y)
            {
                bmd.lineStyle(2, 0xffd900, alpha);
                alpha -= 0.03;
                curPos.x += iterationAdvance * jumpAcceleration.x;
                curPos.y -= iterationAdvance * jumpAcceleration.y;
                jumpAcceleration.y -= 0.3;
                bmd.lineTo(curPos.x, curPos.y);
            }
        }
    }
    
    directionHandler(_dir, _angle)
    {
    }
    
    isFinished()
    {
        return performance.now() > this.finishTime;
    }
    
    startMode()
    {
        ServiceLocator.inputManager.playerDirectionGesture.add(this.cb);
        this.finishTime = performance.now() + 5000;
    }
    
    finishMode()
    {
        ServiceLocator.inputManager.getBmd().clear();
        ServiceLocator.inputManager.playerDirectionGesture.remove(this.cb);
    }
    
    cb()
    {
        
    }
}

JumpTutorial.NAME = "JumpTutorial";