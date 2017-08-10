class BasicEnemy extends Enemy
{
    constructor(_game, _spec, _index)
    {
        super(_game, _spec, _index);
        
        this.spec = _spec;
        
        this.iterationNumber = 0;
        this.isIdle = false;
        
        this.spriteOffset = new Phaser.Point(100, 120);
        
        this.dying = false;
        
        this.faceAnchor;
        
        this.curScale = 0.4;
    }
    
    static preload(_game)
    {
        loadSpriterFiles(_game, "basicEnemy");
        _game.load.image('basicEnemyHornsOverlay', './img/objects/basicEnemy_horns_overlay.png');
        _game.load.image('up', './img/arrowUp.png');
        _game.load.image('down', './img/arrowDown.png');
        _game.load.image('left', './img/arrowLeft.png');
        _game.load.image('right', './img/arrowRight.png');
        _game.load.image('good', './img/checkmark.png');
        _game.load.image('bad', './img/cross.png');
        _game.load.audio('basicEnemyStepAudio', 'sounds/basicEnemy_step.wav');
        _game.load.audio('basicEnemyHitAudio', 'sounds/basicEnemy_hit.wav');
        this.sprite;
    }
    
    create()
    {
        var sprite = loadSpriter(this.game, "basicEnemyJSON", "basicEnemyAtlas", "entity_000");
        this.setSprite(sprite);
        this.sprite.onPointUpdated.add(this.updateItemHandlePoints, this);
        this.sprite.scale.set(this.curScale, this.curScale);
        this.position.y = 320;
        this.sprite.animations.play('walk');
        this.sprite.onEvent.add(this.playStepSound, this);
        
        this.overlaySprite = this.game.add.sprite(0, 0, "basicEnemyHornsOverlay");
        this.overlaySprite.scale.set(this.curScale, this.curScale);
        
        this.stepAudio = this.game.add.audio('basicEnemyStepAudio');
        this.hitAudio = this.game.add.audio('basicEnemyHitAudio');
        
        if (BasicEnemy.attackOptions == undefined)
        {
            BasicEnemy.attackOptions = [
                    {image: 'up', key: ServiceLocator.inputManager.up},
                    {image: 'left', key: ServiceLocator.inputManager.left},
                    {image: 'right', key: ServiceLocator.inputManager.right},
                    {image: 'down', key: ServiceLocator.inputManager.down}
                ];
        }
    }
    
    startAttack(_player)
    {
        this.state = Enemy.States.ATTACKING;
        setTimeout(() => {this.startNewCommand()}, 500);
    }
    
    showCrosshair()
    {
        this.crosshair = new Crosshair(this.game, this, this.position, new Phaser.Point(-40, -60));
    }
    
    showEscapeCheck()
    {
        this.crosshair = new EscapeMeter(this.game, this, this.position, new Phaser.Point(-40, -60));
    }
    
    update()
    {
        if (!this.inPlace())
        {
            this.position.x -= 1.0;
        }
        else
        {
            if (!this.isIdle)
            {
                this.sprite.animations.play('idle');
                this.isIdle = true;
            }
        }
        //This should be in the render update
        if (this.faceAnchor)
        {
            this.overlaySprite.x = this.faceAnchor.x + this.position.x;
            this.overlaySprite.y = this.faceAnchor.y + this.position.y;
        }
        super.update();
    }
    
    updateItemHandlePoints(spriter, pointObj)
    {
        switch(pointObj.name)
        {
            case "face_anchor":
                this.faceAnchor = new Phaser.Point(pointObj.transformed.x, pointObj.transformed.y);
                this.faceAnchor.multiply(this.curScale, this.curScale);
                this.faceAnchor.add(100, -130);
                break;
            default:
                console.error("Invalid point handler in dog BasicEnemy.");
        }
    }
    
    startDeath()
    {
        this.dying = true;
        this.sprite.animations.play('death');
        var changeAnimationOnEnd = () => {
            this.sprite.onFinish.remove(changeAnimationOnEnd);
            this.dead = true;
        }
        this.sprite.onFinish.add(changeAnimationOnEnd);
    }
    
    playStepSound()
    {
        this.stepAudio.play();
    }
    
    startNewCommand()
    {
        this.attackOption = BasicEnemy.attackOptions[randomInt(0,3)];
        this.arrow = this.game.add.sprite(this.position.x, this.position.y - 50, this.attackOption.image);
        ServiceLocator.renderer.addToScene(this.arrow);
        ServiceLocator.inputManager.directionGesture.add(this.directionGestureCb, this);
        
        var self = this;
        this.endTimeout = setTimeout(function(){
            self.showResultSprite('bad');
        }, this.spec.timeout);
    }
    
    directionGestureCb(_direction)
    {
        clearTimeout(this.endTimeout);
        if (this.attackOption.image === _direction)
        {
            this.showResultSprite('good');
            
            ServiceLocator.publish(new AttackDefendedMessage());
        }
        else
        {
            this.showResultSprite('bad');
        }
    }
    
    showResultSprite(_result)
    {
        this.iterationNumber++;
        clearTimeout(this.endTimeout);
        ServiceLocator.inputManager.directionGesture.remove();
        this.arrow.destroy();
        if (_result == 'good' && this.iterationNumber < this.spec.retries)
        {
            setTimeout(() => {this.startNewCommand();}, 100);
        }
        else
        {
            if (_result == 'bad')
            {
                this.sprite.animations.play('attack');
                this.hitAudio.play();
                
                var changeAnimationOnEnd = () => {
                    this.sprite.onLoop.remove(changeAnimationOnEnd);
                    this.sprite.animations.play('idle');
                }
                this.sprite.onLoop.add(changeAnimationOnEnd);
                setTimeout(() =>{
                    this.player.monsterHit();
                }, 200);
            }
            this.iterationNumber = 0;
            var resultSprite = this.game.add.sprite(this.position.x, this.position.y - 50, _result);
            ServiceLocator.renderer.addToOverlay(resultSprite);
            var self = this;
            setTimeout(function(){
                resultSprite.destroy();
                self.state = Enemy.States.FINISHED;
            }, 500);
        }
    }
};

BasicEnemy.NAME = "BasicEnemy"
