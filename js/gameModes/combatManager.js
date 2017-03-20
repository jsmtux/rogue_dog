class CombatManager extends GameMode
{
    constructor(_game, _player)
    {
        super();
        this.game = _game;
        this.state = CombatManager.State.FINISHED;
        this.player = _player;
        this.enemies = {};
        this.dyingEnemies = [];
        this.cardsToLoot = [];
    }
    
    update()
    {
        for (var ind in this.enemies)
        {
            this.enemies[ind].update();
        }
        for (var ind in this.dyingEnemies)
        {
            if(this.dyingEnemies[ind].updateDeath())
            {
                this.dyingEnemies.splice(ind,1);
            }
        }
        
        if (this.state == CombatManager.State.WAITING_MONSTERS)
        {
            if(this.enemiesInPlace())
            {
                this.startAttack();
            }
        }
        else if (this.state == CombatManager.State.ATTACK)
        {
            if (this.player.isAttackFinished())
            {
                this.state = CombatManager.State.DEFEND;
                var defendSprite = this.game.add.sprite(100,100,'defend');
                ServiceLocator.guiManager.addToUI(defendSprite);
                setTimeout(function() {defendSprite.destroy();}, 1000);
            }
        }
        else if (this.state == CombatManager.State.DEFEND)
        {
            for (ind in this.enemies)
            {
                if (this.enemies[ind].state == Enemy.States.ATTACKING)
                {
                    return;
                }
                if (this.enemies[ind].state == Enemy.States.WAITING)
                {
                    this.enemies[ind].startAttack(this.player);
                    return;
                }
            }
            for (ind in this.enemies)
            {
                this.enemies[ind].state = Enemy.States.WAITING;
            }
            if (this.getNumberOfEnemies() > 0)
            {
                this.startAttack();
            }
            else if (this.getNumberOfDyingEnemies() == 0)
            {
                this.state = CombatManager.State.FINISHED;
            }
        }
    }
    
    startCombat(enemyTypes)
    {
        this.state = CombatManager.State.WAITING_MONSTERS;
        for (var ind in enemyTypes)
        {
            this.addEnemy(enemyTypes[ind]);
        }
    }
    
    startAttack()
    {
        this.state = CombatManager.State.ATTACK;
        var attackSprite = this.game.add.sprite(100,100,'attack');
        ServiceLocator.guiManager.addToUI(attackSprite);
        setTimeout(function() {attackSprite.destroy();}, 1000);
        this.player.startAttack(this);
    }
    
    hitFirstEnemy()
    {
        for (var ind in this.enemies)
        {
            this.enemies[ind].takeHit(this);
            break;
        }
    }
    
    enemiesInPlace() {
        var ret = true;
        for (var ind in this.enemies)
        {
            if (!this.enemies[ind].inPlace())
            {
                ret = false;
                break;
            }
        }
        return ret;
    }
    
    getNumberOfEnemies()
    {
        function countProperties(obj) {
            var count = 0;
        
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    ++count;
            }
        
            return count;
        }
        return countProperties(this.enemies);
    }
    
    getNumberOfDyingEnemies()
    {
        return this.dyingEnemies.length;
    }
    
    addEnemy(_definition)
    {
        var index = this.getNumberOfEnemies();
        var enemy = new _definition(this.game, index);
        enemy.create();
        this.enemies[index] = enemy;
    }
    
    killEnemy(_index){
        this.dyingEnemies.push(this.enemies[_index]);
        var droppedCards = this.enemies[_index].getDroppedCards();
        this.cardsToLoot = this.cardsToLoot.concat(droppedCards);
        delete this.enemies[_index];
    }
    
    getNextMode()
    {
        var ret;
        if (this.state == CombatManager.State.FINISHED)
        {
            ret = "CombatLootMode";
        }
        return ret;
    }
    
    getNextModeArguments()
    {
        return this.cardsToLoot;
    }
    
    startMode()
    {
        ServiceLocator.combatManager.startCombat(ServiceLocator.difficultyManager.getEnemies());
        this.cardsToLoot = [];
    }
}

CombatManager.State = {
    WAITING_MONSTERS : 1,
    ATTACK : 2,
    DEFEND : 3,
    FINISHED: 4
}

CombatManager.NAME = "CombatManager";