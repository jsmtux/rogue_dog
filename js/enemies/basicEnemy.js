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
        
        this.iterationNumber = 0;
        this.player = _game.player;
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
        ServiceLocator.renderer.addToScene(this.sprite);
        
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
        ServiceLocator.renderer.addToOverlay(this.hit);
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
            this.player.enemyKilledNotification(this);
            return true;
        }
        
        return false;
    }
    
    getDroppedCards()
    {
        return [MoreObstaclesCard];
    }
    
    startAttack(_player)
    {
        this.state = BasicEnemy.States.ATTACKING;
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
            self.player.monsterHit();
        }, ServiceLocator.difficultyManager.getBasicEnemyTimeout());
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
        this.iterationNumber++;
        clearTimeout(this.endTimeout);
        ServiceLocator.inputManager.directionGesture.remove();
        this.arrow.destroy();
        if (_result == 'good' && this.iterationNumber < ServiceLocator.difficultyManager.getBasicEnemyRetries())
        {
            setTimeout(() => {this.startNewCommand();}, 100);
        }
        else
        {
            this.iterationNumber = 0;
            var resultSprite = this.game.add.sprite(this.sprite.x, this.sprite.y - 50, _result);
            ServiceLocator.renderer.addToOverlay(resultSprite);
            var self = this;
            setTimeout(function(){
                resultSprite.destroy();
                self.state = BasicEnemy.States.FINISHED;
            }, 500);
        }
    }
};

BasicEnemy.States = {
    WAITING : 0,
    ATTACKING : 1,
    FINISHED: 2
}
