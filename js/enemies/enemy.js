class Enemy extends GameObject
{
    constructor(_game, _spec, _index)
    {
        super();
        this.game = _game;
        this.dead = false;
        this.player = _game.player;
        this.health = _spec.health;
        
        this.cardProbabilities = _spec.cardProbabilities;
        
        this.index = _index;
        this.state = Enemy.States.WAITING;
        
        this.endPos = undefined;
        
        this.position = new Phaser.Point(0, 0);
        this.spriteOffset = new Phaser.Point(0, 0);
        
        this.crosshair;
        
        this.collisionbody;
    }
    
    static preload(_game)
    {
        _game.load.image('hit', './img/hit.png');
        _game.load.image('hit_miss', './img/hit_miss.png');
        _game.load.image('hit_critical', './img/hit_critical.png');
    }
    
    setSprite(_sprite)
    {
        ServiceLocator.renderer.addToScene(_sprite);
        GameObject.prototype.create.call(this, _sprite, true);
    }
    
    setWalkPath(_initX, _endX)
    {
        this.position.x = _initX;
        this.endPos = _endX;
    }
    
    inPlace()
    {
        var ret = false;
        if (this.endPos !== undefined)
        {
            ret = this.position.x < this.endPos;
        }
        return ret;
    }

    takeHit(_combatManager, _skillCheck, _hitPoints)
    {
        if (_skillCheck != Enemy.AttackOutcome.MISS)
        {
            ServiceLocator.camera.shake(0.02, 200);
            this.health -= _hitPoints;
            if (_skillCheck == Enemy.AttackOutcome.CRITICAL)
            {
                this.health -= _hitPoints * 1.5;
            }
            if (this.health <= 0)
            {
                ServiceLocator.combatManager.killEnemy(this.index);
                this.startDeath();
            }
        }
        
        switch(_skillCheck)
        {
            case Enemy.AttackOutcome.MISS:
                this.hit = this.game.add.sprite(this.position.x, this.position.y, 'hit_miss');
                break;
            case Enemy.AttackOutcome.HIT:
                this.hit = this.game.add.sprite(this.position.x, this.position.y, 'hit');
                break;
            case Enemy.AttackOutcome.CRITICAL:
                this.hit = this.game.add.sprite(this.position.x, this.position.y, 'hit_critical');
                break;
        }
        ServiceLocator.renderer.addToOverlay(this.hit);
        setTimeout(() => {this.hit.destroy();}, 500);
        this.hit.anchor.x = 0.5;
        this.hit.anchor.y = 0.5;
        
        this.hit.scale.x = 0.5;
        this.hit.scale.y = 0.5;
        this.hit.alpha = 0.0;
        this.game.add.tween(this.hit).to({ alpha: 1.0 }, 500, Phaser.Easing.Cubic.Out, true);
        this.game.add.tween(this.hit.scale).to({ x: 1.0, y: 1.0}, 500, Phaser.Easing.Elastic.Out, true);
    }
    
    isDead()
    {
        return this.dead;
    }
    
    getDroppedCards()
    {
        return ServiceLocator.cardManager.lootDeck.getRandomCard();
    }
    
    startAttack(_player)
    {
        console.error("Trying to start undefined attack");
    }
    
    getName()
    {
        return this.constructor.NAME;
    }
    
    update(_combatManager)
    {
        this.sprite.x = this.position.x + this.spriteOffset.x;
        this.sprite.y = this.position.y + this.spriteOffset.y;
        
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
            if (inside)
            {
                ServiceLocator.publish(new AttackDefendedMessage());
            }
            if (inside || this.bullet.isFinished())
            {
                this.state = Enemy.States.FINISHED;
                ServiceLocator.inputManager.drawGesture.remove(this.receivePolygonPoints, this);
                this.bullet.destroy();
                this.bullet = undefined;
            }
        }
        else if (this.inPlace())
        {
            this.shoot(_combatManager.player);
        }
    }
    
    shoot(_player)
    {
        ServiceLocator.inputManager.drawGesture.add(this.receivePolygonPoints, this);
        this.bullet = new EnemyBullet(this.game, _player, this.spec.bulletSpeed);
        this.bullet.create(this.position.x, this.position.y);
    }
    
    getCollisionBody()
    {
        return this.collisionbody;
    }
}

Enemy.States = {
    WAITING : 0,
    ATTACKING : 1,
    FINISHED: 2
}

Enemy.AttackOutcome = {
    MISS: 0,
    HIT: 1,
    CRITICAL: 2
}


class EnemyBullet
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
