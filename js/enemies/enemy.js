class Enemy extends GameObject
{
    constructor(_game, _spec, _index)
    {
        super();
        this.game = _game;
        this.dying = false;
        this.player = _game.player;
        this.health = _spec.health;
        
        this.cardProbabilities = _spec.cardProbabilities;
        
        this.index = _index;
        this.state = Enemy.States.WAITING;
        
        this.endPos = undefined;
        
        this.position = new Phaser.Point(0, 0);
        this.spriteOffset = new Phaser.Point(0, 0);
    }
    
    static preload(_game)
    {
        _game.load.spritesheet('hit', './img/hit.png');
        _game.load.spritesheet('hit_miss', './img/hit_miss.png');
        _game.load.spritesheet('hit_critical', './img/hit_critical.png');
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
        console.log("Evaluating attack of skill " + _skillCheck + " and str " + _hitPoints);
        var attackOutCome = Enemy.AttackOutcome.MISS;
        if (_skillCheck > 0.7)
        {
            attackOutCome = Enemy.AttackOutcome.HIT;
        }
        if (_skillCheck > 0.95)
        {
            attackOutCome = Enemy.AttackOutcome.CRITICAL;
        }
        
        if (attackOutCome != Enemy.AttackOutcome.MISS)
        {
            ServiceLocator.camera.shake(0.02, 200);
            this.health -= _hitPoints;
            if (attackOutCome == Enemy.AttackOutcome.CRITICAL)
            {
                this.health -= _hitPoints * 1.5;
            }
            if (this.health <= 0)
            {
                ServiceLocator.combatManager.killEnemy(this.index);
            }
        }
        
        var posX = this.position.x - 50;
        var posY = this.position.y - 50;
        switch(attackOutCome)
        {
            case Enemy.AttackOutcome.MISS:
                this.hit = game.add.sprite(posX, posY, 'hit_miss');
                break;
            case Enemy.AttackOutcome.HIT:
                this.hit = game.add.sprite(posX, posY, 'hit');
                break;
            case Enemy.AttackOutcome.CRITICAL:
                this.hit = game.add.sprite(posX, posY, 'hit_critical');
                break;
        }
        ServiceLocator.renderer.addToOverlay(this.hit);
        setTimeout(() => {this.hit.destroy();}, 500);
    }
    
    updateDeath()
    {
        this.sprite.alpha -= 0.02;
        if (this.sprite.alpha <= 0)
        {
            this.destroy();
            this.player.enemyKilledNotification(this);
            return true;
        }
        
        return false;
    }
    
    getDroppedCards()
    {
        var totalProbability = 0;
        var cardPosition = {};
        for (var cardName in this.cardProbabilities)
        {
            if (ServiceLocator.cardManager.stillInDeck(cardName))
            {
                var probabilities = this.cardProbabilities[cardName];
                totalProbability += probabilities;
                cardPosition[totalProbability] = cardName;
            }
        }
        
        var roll = randomInt(1, totalProbability);
        
        for (var ind in cardPosition)
        {
            ind = parseInt(ind);
            if (ind >= roll)
            {
                var cardName = cardPosition[ind];
                ServiceLocator.cardManager.drawCard(cardName);
                break
            }
        }
        
        return [ServiceLocator.cardManager.getCardClassFromID(cardName)];
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
    }
}

Enemy.States = {
    WAITING : 0,
    ATTACKING : 1,
    FINISHED: 2
}

Enemy.cardProbability = {
    LOW: 1,
    MED: 3,
    HIGH: 9
}

Enemy.AttackOutcome = {
    MISS: 0,
    HIT: 1,
    CRITICAL: 2
}