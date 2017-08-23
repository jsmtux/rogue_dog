
class BeeEnemy extends Enemy
{
    constructor(_game, _spec, _index, _position)
    {
        var height = 320;
        super(_game, _spec, _index, new Phaser.Point(_position.x, height + 150));

        this.height = height;
        this.moveRadius = 10;
        this.rotationCounter = 0;
        
        this.spec = _spec;
        
        this.dying = false;
    }

    static preload(_game)
    {
        loadSpriterFiles(_game, "bee");
        EnemyBullet.Preload(_game);
        this.sprite;
    }
    
    create()
    {
        var sprite = loadSpriter(this.game, "beeJSON", "beeAtlas", "Bee");
        this.setSprite(sprite);
        this.sprite.animations.play('Idle');
        this.sprite.scale.setTo(-0.5, 0.5);
    }
    
    takeHit(_combatManager, _skillCheck, _hitPoints)
    {
        super.takeHit(_combatManager, _skillCheck, _hitPoints)
        
        this.sprite.animations.play('Hurt');

        var changeAnimationOnEnd = () => {
            //this.sprite.onFinish.remove(changeAnimationOnEnd);
            if (!this.dying)
            {
                this.sprite.animations.play('Idle');
            }
            else
            {
                this.sprite.animations.play('Smoke');
                
                var changeAnimationOnEnd = () => {
                    this.dead = true;
                }
                this.sprite.onLoop.add(changeAnimationOnEnd);
            }
        }
        this.sprite.onLoop.add(changeAnimationOnEnd);
    }
    
    update(_combatManager)
    {
        //this.position.y = this.height + Math.sin(this.rotationCounter++ / 10.0) * this.moveRadius;
        
        super.update(_combatManager);
    }
    
    startDeath()
    {
        this.dying = true;
    }
    
    receivePolygonPoints(_points)
    {
        this.polygonPoints = _points;
    }
    
    startAttack(_player)
    {
        this.state = Enemy.States.ATTACKING;
        setTimeout(() => {
            this.sprite.animations.play('Attack');
            
            var changeAnimationOnEnd = () => {
                this.sprite.onLoop.remove(changeAnimationOnEnd);
                this.sprite.animations.play('Idle');
            }
            this.sprite.onLoop.add(changeAnimationOnEnd);
            /*
            ServiceLocator.inputManager.drawGesture.add(this.receivePolygonPoints, this);
            this.bullet = new EnemyBullet(this.game, _player, this.spec.bulletSpeed);
            this.bullet.create(this.position.x, this.position.y);*/
        }, 500);
    }
}

BeeEnemy.NAME = "BeeEnemy";
