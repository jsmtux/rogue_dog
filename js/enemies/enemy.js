class Enemy extends GameObject
{
    constructor(_game, _spec, _index, _position)
    {
        super();
        this.game = _game;
        this.dead = false;
        this.player = _game.player;
        this.health = _spec.health;
        
        this.cardProbabilities = _spec.cardProbabilities;
        
        this.index = _index;
        this.state = Enemy.States.WAITING;
        
        this.position = _position;
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
        super.create(_sprite, true);
        ServiceLocator.renderer.addToScene(_sprite);
        
        this.sprite.x = this.position.x + this.spriteOffset.x;
        this.sprite.y = this.position.y + this.spriteOffset.y;
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
        var hitSprite;
        switch(_skillCheck)
        {
            case Enemy.AttackOutcome.MISS:
                hitSprite = this.game.add.sprite(this.position.x, this.position.y, 'hit_miss');
                break;
            case Enemy.AttackOutcome.HIT:
                hitSprite = this.game.add.sprite(this.position.x, this.position.y, 'hit');
                break;
            case Enemy.AttackOutcome.CRITICAL:
                hitSprite = this.game.add.sprite(this.position.x, this.position.y, 'hit_critical');
                break;
        }
        ServiceLocator.renderer.addToOverlay(hitSprite);
        setTimeout(() => {hitSprite.destroy();}, 500);
        hitSprite.anchor.x = 0.5;
        hitSprite.anchor.y = 0.5;
        
        hitSprite.scale.x = 0.5;
        hitSprite.scale.y = 0.5;
        hitSprite.alpha = 0.0;
        this.game.add.tween(hitSprite).to({ alpha: 1.0 }, 500, Phaser.Easing.Cubic.Out, true);
        this.game.add.tween(hitSprite.scale).to({ x: 1.0, y: 1.0}, 500, Phaser.Easing.Elastic.Out, true);
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
        
        if(!this.lastShot)
        {
            this.lastShot = performance.now() - 2000;
        }
        
        if (this.lastShot + 3000 < performance.now())
        {
            this.shoot(_combatManager.player);
            this.lastShot = performance.now();
        }
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
        this.sprite = this.game.add.sprite(_x, _y, 'beeBullet', 5);
        ServiceLocator.renderer.addToScene(this.sprite);
        ServiceLocator.registerListener(this.checkPolygonCallback, this, "PolygonIntersectionDrawn");
        ServiceLocator.updateSignal.add(this.update, this);
        this.active = true;
    }

    update()
    {
        this.sprite.x -= this.speed;
        if (this.sprite.x < this.player.position.x)
        {
            this.player.monsterHit();
            this.destroy();
        }
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
        ServiceLocator.updateSignal.remove(this.update, this);
        ServiceLocator.removeListener(this.checkPolygonCallback, this, "PolygonIntersectionDrawn");
    }
    
    checkPolygonCallback(_msg)
    {
        if(!this.active)
        {
            return;
        }
        var polygonPoints = _msg.getPoints();
        var inside = false;
        if (polygonPoints)
        {
            var camPos = ServiceLocator.camera.getPosition();
            var relativeBulletPosition = new Phaser.Point(this.sprite.x, this.sprite.y).subtract(camPos.x, camPos.y);
            var bulletWidth = this.sprite.width;
            var bulletHeight = this.sprite.height;
            //Check different hit points
            inside = polygonPoints.contains(relativeBulletPosition.x, relativeBulletPosition.y);
            inside |= polygonPoints.contains(relativeBulletPosition.x + bulletWidth/2, relativeBulletPosition.y + bulletHeight/2);
            inside |= polygonPoints.contains(relativeBulletPosition.x + bulletWidth, relativeBulletPosition.y + bulletHeight);
        }
        if (inside)
        {
            this.state = Enemy.States.FINISHED;
            this.destroy();
            ServiceLocator.publish(new AttackDefendedMessage());
            this.active = false;
        }
    }
}
