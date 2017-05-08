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

    takeHit(_combatManager, _hitPoints)
    {
        ServiceLocator.camera.shake(0.02, 200);
        var posX = this.position.x;
        var posY = this.position.y;
        this.hit = game.add.sprite(posX, posY, 'hit');
        ServiceLocator.renderer.addToOverlay(this.hit);
        var self = this;
        setTimeout(function() {self.hit.destroy();}, 500);
        this.health -= _hitPoints;
        console.log("HP is now " + this.health + " after it of " + _hitPoints);
        if (this.health <= 0)
        {
            ServiceLocator.combatManager.killEnemy(this.index);
        }
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
