class BasicEnemy extends Enemy
{
    constructor(_game, _spec, _index)
    {
        super(_game, _spec, _index);
        
        this.spec = _spec;
        
        this.iterationNumber = 0;
        this.isIdle = false;
        
        this.spriteOffset = new Phaser.Point(100, 120);
    }
    
    static preload(_game)
    {
        loadSpriterFiles(_game, "basicEnemy");
        _game.load.spritesheet('hit', './img/hit.png');
        _game.load.image('up', './img/arrowUp.png');
        _game.load.image('down', './img/arrowDown.png');
        _game.load.image('left', './img/arrowLeft.png');
        _game.load.image('right', './img/arrowRight.png');
        _game.load.image('good', './img/checkmark.png');
        _game.load.image('bad', './img/cross.png');
        this.sprite;
    }
    
    create()
    {
        var sprite = loadSpriter(this.game, "basicEnemyJSON", "basicEnemyAtlas", "entity_000");
        this.setSprite(sprite);
        this.sprite.scale.set(0.4, 0.4);
        this.position.y = 320;
        this.sprite.animations.play('walk');
        
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
        super.update();
    }
    
    startAttack(_player)
    {
        this.state = Enemy.States.ATTACKING;
        setTimeout(() => {this.startNewCommand()}, 500);
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