
class BeeEnemy extends Enemy
{
    constructor(_game, _spec, _index)
    {
        super(_game, _spec, _index);

        this.height = 320;
        this.moveRadius = 10;
        this.rotationCounter = 0;
        
        this.spec = _spec;
    }

    static preload(_game)
    {
        loadSpriterFiles(_game, "bee");
        BeeBullet.Preload(_game);
        this.sprite;
    }
    
    create()
    {
        var sprite = loadSpriter(this.game, "beeJSON", "beeAtlas", "Bee");
        this.setSprite(sprite);
        this.position.y = this.height + 150;
        this.sprite.animations.play('Idle');
        this.sprite.scale.setTo(-0.5, 0.5);
    }
    
    showCrosshair()
    {
        this.crosshair = new Crosshair(this.game, this, this.position, new Phaser.Point(0, 0));
    }
    
    takeHit(_combatManager, _skillCheck, _hitPoints)
    {
        super.takeHit(_combatManager, _skillCheck, _hitPoints)
        
        this.sprite.animations.play('Hurt');

        var changeAnimationOnEnd = () => {
            this.sprite.onFinish.remove(changeAnimationOnEnd);
            this.sprite.animations.play('Idle');
        }
        this.sprite.onLoop.add(changeAnimationOnEnd);
    }
    
    update()
    {
        if (this.bullet)
        {
            this.bullet.update();
            var inside = false;
            if (this.polygonPoints)
            {
                var camPos = ServiceLocator.camera.getPosition();
                var relativeBulletPosition = new Phaser.Point(this.bullet.sprite.x, this.bullet.sprite.y).subtract(camPos.x, camPos.y);
                var bulletWidth = this.bullet.sprite.width;
                var bulletHeight = this.bullet.sprite.height;
                //Check different hit points
                inside = this.polygonPoints.contains(relativeBulletPosition.x, relativeBulletPosition.y);
                inside |= this.polygonPoints.contains(relativeBulletPosition.x + bulletWidth/2, relativeBulletPosition.y + bulletHeight/2);
                inside |= this.polygonPoints.contains(relativeBulletPosition.x + bulletWidth, relativeBulletPosition.y + bulletHeight);
                //
                this.polygonPoints = undefined;
            }
            if (inside || this.bullet.isFinished())
            {
                this.state = Enemy.States.FINISHED;
                ServiceLocator.inputManager.drawGesture.remove(this.receivePolygonPoints, this);
                this.bullet.destroy();
                this.bullet = undefined;
            }
        }
    
        if (!this.inPlace())
        {
            //this.sprite.animations.play('idle', 10, true);
            this.position.x -= 1.5;
        }
    
        //this.position.y = this.height + Math.sin(this.rotationCounter++ / 10.0) * this.moveRadius;
        
        super.update();
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
                this.sprite.onFinish.remove(changeAnimationOnEnd);
                this.sprite.animations.play('Idle');
            }
            this.sprite.onLoop.add(changeAnimationOnEnd);
            
            ServiceLocator.inputManager.drawGesture.add(this.receivePolygonPoints, this);
            this.bullet = new BeeBullet(this.game, _player, this.spec.bulletSpeed);
            this.bullet.create(this.position.x, this.position.y);
        }, 500);
    }
}

BeeEnemy.NAME = "BeeEnemy";

class BeeBullet
{
    constructor(_game, _player, _speed)
    {
        this.sprite;
        this.game = _game;
        this.player = _player;
        this.speed = _speed;
    }
    
    static Preload(_game)
    {
        _game.load.image('beeBullet', './img/beeBullet.png');
        _game.load.spritesheet('beeBulletExplosion', './img/bullet_explosion.png', 77, 73);
    }
    
    create(_x, _y)
    {
        this.sprite = this.game.add.sprite(_x - 20, _y - 80, 'beeBullet', 5);
        ServiceLocator.renderer.addToScene(this.sprite);
    }
    
    update()
    {
        this.sprite.x -= this.speed;
    }
    
    isFinished()
    {
        var finished = this.sprite.x < this.player.getFeetArea()[1];
        if (finished)
        {
            this.player.monsterHit();
        }
        return finished;
    }
    
    destroy()
    {
        var explosion = this.game.add.sprite(this.sprite.x, this.sprite.y, 'beeBulletExplosion');
        ServiceLocator.renderer.addToScene(explosion);
        var explodingAnimation = explosion.animations.add('explode');
        explosion.play('explode', 10);
        explodingAnimation.onComplete.add(function () {explosion.destroy();});
        this.sprite.destroy();
        
    }
}
