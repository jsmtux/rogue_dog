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
    }
    
    setSprite(_sprite)
    {
        ServiceLocator.renderer.addToScene(_sprite);
        GameObject.prototype.create.call(this, _sprite, true);
    }
    
    setWalkPath(_initX, _endX)
    {
        this.sprite.x = _initX;
        this.endPos = _endX;
    }
    
    inPlace()
    {
        var ret = false;
        if (this.endPos !== undefined)
        {
            ret = this.sprite.x < this.endPos;
        }
        return ret;
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
