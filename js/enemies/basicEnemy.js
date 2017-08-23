class BasicEnemy extends Enemy
{
    constructor(_game, _spec, _index, _position)
    {
        super(_game, _spec, _index, new Phaser.Point(_position.x, 320));
        
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
        this.sprite.animations.play('idle');
        
        
        for(var ind in this.sprite.children)
        {
            var spriteChild = this.sprite.children[ind];
            if (spriteChild.name == "head")
            {
                spriteChild.scale.set(this.curScale, this.curScale);
                ServiceLocator.physics.addToWorld(spriteChild);
                this.collisionbody = spriteChild;
            }
        }
        
        this.overlaySprite = this.game.add.sprite(0, 0, "basicEnemyHornsOverlay");
        this.overlaySprite.scale.set(this.curScale, this.curScale);
        ServiceLocator.renderer.addToScene(this.overlaySprite);
        
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
        
        ServiceLocator.renderSignal.add(this.updateRender, this);
    }
    
    startAttack(_player)
    {
        this.state = Enemy.States.ATTACKING;
        setTimeout(() => {this.startNewCommand()}, 500);
    }
    
    update(_combatManager)
    {
        if (!this.isIdle)
        {
            this.sprite.animations.play('idle');
            this.isIdle = true;
        }
        super.update(_combatManager);
    }
    
    updateRender()
    {
        if (this.faceAnchor)
        {
            this.overlaySprite.x = this.faceAnchor.x + this.position.x;
            this.overlaySprite.y = this.faceAnchor.y + this.position.y;
        }
    }
    
    setVisible(_visible)
    {
        this.overlaySprite.visible = _visible;
        super.setVisible(_visible);
    }
    
    updateItemHandlePoints(spriter, pointObj)
    {
        switch(pointObj.name)
        {
            case "face_anchor":
                this.faceAnchor = new Phaser.Point(pointObj.transformed.x, pointObj.transformed.y);
                this.faceAnchor.multiply(this.curScale, this.curScale);
                this.faceAnchor.add(100, -80);
                break;
            default:
                console.error("Invalid point handler in dog BasicEnemy.");
        }
    }
    
    startDeath()
    {
        this.dying = true;
        this.overlaySprite.destroy();
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
        
    shoot(_player)
    {
        var bullet = new EnemyBullet(this.game, _player, this.spec.bulletSpeed);
        bullet.create(this.position.x, this.position.y + 50);
        
        this.sprite.animations.play('attack');
        var changeAnimationOnEnd = () => {
            this.sprite.onLoop.remove(changeAnimationOnEnd);
            this.sprite.animations.play('idle');
        }
        this.sprite.onLoop.add(changeAnimationOnEnd);
    }
};

BasicEnemy.NAME = "BasicEnemy"
