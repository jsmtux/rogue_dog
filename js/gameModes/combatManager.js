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
        this.projectiles = [];
        
        this.cardsDisappearing = 0;
    }
    
    static preload(_game)
    {
        _game.load.image('card_loot', './img/card_loot.png');
    }
    
    create()
    {
    }
    
    update()
    {
        for (var ind in this.enemies)
        {
            this.enemies[ind].update(this);
        }
        for (var ind in this.dyingEnemies)
        {
            if(this.dyingEnemies[ind].isDead())
            {
                this.dyingEnemies[ind].destroy();
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
        else if (this.state === CombatManager.State.ATTACK)
        {
            if (this.getNumberOfDyingEnemies() === 0 && this.cardsDisappearing === 0)
            {
                if (this.getNumberOfEnemies() === 0)
                {
                    this.finishCombat();
                }
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
        ServiceLocator.inputManager.playerDirectionGesture.remove(this.fire, this);
    }
    
    startAttack()
    {
        this.state = CombatManager.State.ATTACK;
        ServiceLocator.publish(new NewGameModeMessage(GameMode.visibleTypes.ATTACK));
     
        if (this.player.canAttack())
        {
            ServiceLocator.inputManager.playerDirectionGesture.add(this.fire, this);
            ServiceLocator.inputManager.playerDirectionGesture.updateSettings(true, this.player.position, new Phaser.Point(0, 0), new Phaser.Point(0, -0.3), 15);
        }
    }
    
    fire(_angle)
    {
        this.player.updateStickNumber(this.player.stickNumber - 1);
        var angle = Math.radians(_angle);
        var projectile = new AttackStick(this.game, this.player.position, undefined, new Phaser.Point(15 * Math.cos(angle), 15 * Math.sin(angle)), new Phaser.Point(0, -0.3), this);
        this.projectiles.push(projectile)
    }
    
    cardFlipped(_card)
    {
        _card.setHandler(() =>{
            _card.apply({'player':this.player});
            _card.destroy();
            this.state = CombatManager.State.FINISH_ATTACK;
            ServiceLocator.publish(new WildcardPicked());
        });
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
    
    getEnemyBodies()
    {
        var ret = [];
        for (var ind in this.enemies)
        {
            ret.push({"enemy": this.enemies[ind], "body":this.enemies[ind].getCollisionBody()});
        }
        return ret;
    }
    
    projectileHit(_projectile, _enemy, _power)
    {
        _enemy.takeHit(this, Enemy.AttackOutcome.HIT, _power);
    }
}

CombatManager.State = {
    WAITING_MONSTERS : 1,
    ATTACK_NEXT: 2,
    ATTACK : 3,
    FINISHED: 4
}

CombatManager.NAME = "CombatManager";

class AttackStick
{
    constructor(_game, _initPosition, _callback, _speed, _acceleration, _combatManager)
    {
        this.game = _game;
        this.position = _initPosition.clone();
        this.callback = _callback;
        this.speed = _speed;
        this.acceleration = _acceleration;
        
        this.sprite = _game.add.sprite(_initPosition.x, _initPosition.y, 'stick');
        ServiceLocator.renderer.addToScene(this.sprite);
        ServiceLocator.physics.addToWorld(this.sprite);
        
        this.hitStickAudio = this.game.add.audio('hitStickAudio');
        
        this.combatManager = _combatManager;
        ServiceLocator.updateSignal.add(this.update, this);
    }
    
    static preload(_game)
    {
        _game.load.audio('hitStickAudio', 'sounds/hit_stick.wav');
    }
    
    update()
    {
        var finished = false;
        if (finished)
        {
            this.hitStickAudio.play();
            this.destroy();
            this.callback();
        }
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.speed.x -= this.acceleration.x;
        this.speed.y -= this.acceleration.y;
        this.sprite.position = this.position;
        
        var collision = this.collides(this.combatManager.getEnemyBodies());
        if (collision !== undefined)
        {
            this.combatManager.projectileHit(this, collision, 4);
            this.destroy();
        }
        if (collision !== undefined || this.position.y > GROUND_LEVEL)
        {
            this.destroy();
        }
    }
    
    collides(_collisionArray)
    {
        for (var ind in _collisionArray)
        {
            if (ServiceLocator.physics.isCollidingWith(this.sprite, _collisionArray[ind].body))
            {
                return _collisionArray[ind].enemy;
            }
        }
        return undefined;
    }
    
    destroy()
    {
        this.sprite.destroy();
        ServiceLocator.updateSignal.remove(this.update, this);
    }
}
