class BasicEnemy extends Enemy
{
    constructor(_game, _spec, _index)
    {
        super(_game, _spec, _index);
        
        this.spec = _spec;
        
        this.iterationNumber = 0;
        this.isIdle = false;
    }
    
    static preload(_game)
    {
        var path = "anim/"
        _game.load.atlas("basicEnemyAtlas", path + "basicEnemy.png", path + "basicEnemy.json");
        _game.load.json("basicEnemyJSON", path + "basicEnemy.scon");
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
        this.sprite.scale.set(0.3, 0.3);
        this.sprite.y = 460;
        this.sprite.animations.play('walk');
        
        ServiceLocator.infoManager.register("BasicEnemy", this.sprite);
        
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
            this.sprite.x -= 1.3;
        }
        else
        {
            if (!this.isIdle)
            {
                this.sprite.animations.play('idle');
                this.isIdle = true;
            }
        }
    }
    
    startAttack(_player)
    {
        this.state = Enemy.States.ATTACKING;
        setTimeout(() => {this.startNewCommand()}, 500);
    }
    
    startNewCommand()
    {
        this.attackOption = BasicEnemy.attackOptions[randomInt(0,3)];
        this.arrow = this.game.add.sprite(this.sprite.x, this.sprite.y - 50, this.attackOption.image);
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
                this.player.monsterHit();
            }
            this.iterationNumber = 0;
            var resultSprite = this.game.add.sprite(this.sprite.x, this.sprite.y - 50, _result);
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