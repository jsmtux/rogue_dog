class BasicEnemy
{
    constructor(_game, _index)
    {
        this.game = _game;
        this.state = BasicEnemy.States.WAITING;
        this.health = 10;
        this.index = _index;
        this.padding = 220;
        this.dying = false;
    }
    
    static preload(_game)
    {
        _game.load.spritesheet('monster', './img/monster.png', 205, 200);
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
        var visibleArea = ServiceLocator.camera.getVisibleArea();
        this.sprite = this.game.add.sprite(visibleArea.bottomRight.x + 20 + this.padding * this.index, 320, 'monster', 10);
        this.endPos = visibleArea.bottomLeft.x +(350 + this.padding * this.index);
        this.sprite.animations.add('walk');
        this.sprite.animations.add('idle', [0]);
        
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
            this.sprite.play('walk', 10, true);
            this.sprite.x -= 1.5;
        }
        else
        {
            this.sprite.play('idle');
        }
    }
    
    inPlace()
    {
        return this.sprite.x < this.endPos;
    }
    
    takeHit()
    {
        ServiceLocator.camera.shake(0.02, 200);
        var posX = this.sprite.x;
        var posY = this.sprite.y;
        this.hit = game.add.sprite(posX, posY, 'hit');
        var self = this;
        setTimeout(function() {self.hit.destroy();}, 500);
        this.health -= 5;
        if (this.health <= 0)
        {
            ServiceLocator.combatManager.killEnemy(this.index);
            ServiceLocator.infoManager.unregister(this.sprite);
        }
    }
    
    updateDeath()
    {
        this.sprite.alpha -= 0.02;
        if (this.sprite.alpha <= 0)
        {
            this.sprite.destroy();
            return true;
        }
        
        return false;
    }
    
    startAttack(_player)
    {
        console.log("Starting attack");
        this.attackOption = BasicEnemy.attackOptions[randomInt(0,3)];
        this.state = BasicEnemy.States.ATTACKING;
        this.arrow;
        var initTimeout = 500 + Math.random() * 2000;
        var self = this;
        setTimeout(function(){
            self.attackOption.key.onDown.add(self.keyHandler, self);
            self.arrow = self.game.add.sprite(self.sprite.x, self.sprite.y - 50, self.attackOption.image);
            ServiceLocator.inputManager.directionGesture.add(self.directionGestureCb, self);
        }, initTimeout)
        this.endTimeout = setTimeout(function(){
            self.showResultSprite('bad');
            _player.monsterHit();
        }, initTimeout + ServiceLocator.difficultyManager.getBasicEnemyTimeout());
    }
    
    keyHandler()
    {
        this.showResultSprite('good');
    }
    
    directionGestureCb(_direction)
    {
        console.log(_direction);
        if (this.attackOption.image === _direction)
        {
            clearTimeout(this.endTimeout);
            this.showResultSprite('good');        
        }
    }
    
    showResultSprite(_result)
    {
        clearTimeout(this.endTimeout);
        ServiceLocator.inputManager.directionGesture.remove();
        this.arrow.destroy();
        this.attackOption.key.onDown.remove(this.keyHandler, this);
        var resultSprite = this.game.add.sprite(this.sprite.x, this.sprite.y - 50, _result);
        var self = this;
        setTimeout(function(){
            resultSprite.destroy();
            self.state = BasicEnemy.States.FINISHED;
        }, 500);
    }
};

BasicEnemy.States = {
    WAITING : 0,
    ATTACKING : 1,
    FINISHED: 2
}
