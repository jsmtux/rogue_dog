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
        
        this.cardsDisappearing = 0;
    }
    
    static preload(_game)
    {
        _game.load.image('card_loot', './img/card_loot.png');
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
        
        if (this.state === CombatManager.State.WAITING_MONSTERS)
        {
            if(this.enemiesInPlace())
            {
                ServiceLocator.publish(new EnemiesInPlaceMessage());
                this.state = CombatManager.State.ATTACK_NEXT
            }
        }
        else if (this.state === CombatManager.State.ATTACK_NEXT)
        {
            this.startAttack();
        }
        else if (this.state === CombatManager.State.FINISH_ATTACK)
        {
            if (this.getNumberOfDyingEnemies() === 0 && this.cardsDisappearing === 0)
            {
                ServiceLocator.publish(new NewBannerMessage(NewBannerMessage.Types.Defend));
                this.state = CombatManager.State.DEFEND;
            }
        }
        else if (this.state === CombatManager.State.DEFEND)
        {
            for (ind in this.enemies)
            {
                if (this.enemies[ind].state === Enemy.States.ATTACKING)
                {
                    return;
                }
                if (this.enemies[ind].state === Enemy.States.WAITING)
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
            else if (this.getNumberOfDyingEnemies() === 0)
            {
                this.finishCombat();
            }
        }
    }
    
    startCombat(_enemyTypes)
    {
        var renderArea = ServiceLocator.camera.getRenderArea();
        var visibleArea = ServiceLocator.camera.getVisibleArea();
        var padding = 220;
        var numberOfEnemies = _enemyTypes.length;
        this.state = CombatManager.State.WAITING_MONSTERS;
        for (var ind in _enemyTypes)
        {
            var type = _enemyTypes[ind];
            var spec = ServiceLocator.difficultyManager.getEnemySpec(type.NAME);
            var enemy = new type(this.game, spec, ind);
            enemy.create();

            var initPos = visibleArea.bottomRight.x + 120 + padding * ind;
            var endPos = renderArea.bottomRight.x + padding * (ind - numberOfEnemies) - 120;
            
            
            enemy.setWalkPath(initPos, endPos);

            this.enemies[ind] = enemy;
        }
    }
    
    finishCombat()
    {
        this.state = CombatManager.State.FINISHED;     
    }
    
    startAttack()
    {
        this.state = CombatManager.State.ATTACK;
        ServiceLocator.publish(new NewBannerMessage(NewBannerMessage.Types.Attack));
        for (var ind in this.enemies)
        {
            this.enemies[ind].showCrosshair();
        }
        ServiceLocator.registerListener(this.enemyTargeted, this, "EnemyTargeted");
    }
    
    enemyTargeted(_message)
    {
        this.state = CombatManager.State.DEFEND;
        ServiceLocator.removeListener(this.enemyTargeted, this, "EnemyTargeted");
        for (var ind in this.enemies)
        {
            this.enemies[ind].hideCrosshair();
        }
        this.state = CombatManager.State.FINISH_ATTACK;
        this.player.doAttack(_message.getHitType(), _message.getEnemy());
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
    
    killEnemy(_index){
        this.dyingEnemies.push(this.enemies[_index]);
        var droppedCards = this.enemies[_index].getDroppedCards();
        this.cardsToLoot = this.cardsToLoot.concat(droppedCards);
        this.showCardDrop(this.enemies[_index].position);
        delete this.enemies[_index];
    }
    
    showCardDrop(_initialPos)
    {
        this.cardsDisappearing++;
        var card_loot = this.game.add.sprite(_initialPos.x, _initialPos.y, 'card_loot');
        card_loot.alpha = 0.0;
        var alpha_tween = this.game.add.tween(card_loot).to({ alpha: 1.0 }, 500, Phaser.Easing.Cubic.Out, true);
        var fall_tween = this.game.add.tween(card_loot).to({ y: GROUND_LEVEL - 125 }, 1000, Phaser.Easing.Bounce.Out);
        var leave_tween = this.game.add.tween(card_loot).to({ x: card_loot.x - 1000, y: - 50 }, 500, Phaser.Easing.Cubic.Out);
        
        alpha_tween.onComplete.add(() =>{fall_tween.start()});
        fall_tween.onComplete.add(() =>{leave_tween.start()});
        leave_tween.onComplete.add(() =>{
            card_loot.destroy();
            this.cardsDisappearing--;
        });
    }
    
    isFinished()
    {
        return this.state == CombatManager.State.FINISHED;
    }
    
    getNextModeArguments()
    {
        return this.cardsToLoot;
    }
    
    startMode(_enemies)
    {
        if (_enemies === undefined)
        {
            _enemies = ServiceLocator.difficultyManager.getEnemies();
        }
        ServiceLocator.combatManager.startCombat(_enemies);
        this.cardsToLoot = [];
    }
}

CombatManager.State = {
    WAITING_MONSTERS : 1,
    ATTACK_NEXT: 2,
    ATTACK : 3,
    FINISH_ATTACK: 4,
    DEFEND : 5,
    FINISHED: 6
}

CombatManager.NAME = "CombatManager";