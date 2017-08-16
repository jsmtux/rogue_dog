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
    
    update()
    {
        this.sprite.x = this.position.x + this.spriteOffset.x;
        this.sprite.y = this.position.y + this.spriteOffset.y;
        
        if (this.crosshair)
        {
            this.crosshair.updatePosition(new Phaser.Point(this.sprite.x, this.sprite.y));
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
