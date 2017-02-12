
function CombatManager(_game, _player, _difficultyManager, _infoManager)
{
    this.game = _game;
    this.state = CombatManager.State.FINISHED;
    this.player = _player;
    this.cards = [];
    this.enemies = {};
    this.dyingEnemies = [];
    this.difficultyManager = _difficultyManager;
    this.infoManager = _infoManager;
}

CombatManager.State = {
    WAITING_MONSTERS : 1,
    ATTACK : 2,
    DEFEND : 3,
    LOOT: 4,
    FINISHED: 5
}

CombatManager.prototype.update = function()
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
            setTimeout(function() {defendSprite.destroy();}, 1000);
        }
        else
        {
            this.player.updateAttack();
        }
    }
    else if (this.state == CombatManager.State.DEFEND)
    {
        for (ind in this.enemies)
        {
            if (this.enemies[ind].state == BasicEnemy.States.ATTACKING)
            {
                return;
            }
            if (this.enemies[ind].state == BasicEnemy.States.WAITING)
            {
                this.enemies[ind].startAttack(this.player, this.difficultyManager);
                return;
            }
        }
        for (ind in this.enemies)
        {
            this.enemies[ind].state = BasicEnemy.States.WAITING;
        }
        if (this.getNumberOfEnemies() > 0)
        {
            this.startAttack();
        }
        else if (this.getNumberOfDyingEnemies() == 0)
        {
            this.startLootChoose();
        }
    }
    else if (this.state == CombatManager.State.LOOT)
    {
        
    }
}

CombatManager.prototype.startCombat = function(enemyTypes)
{
    this.state = CombatManager.State.WAITING_MONSTERS;
    for (var ind in enemyTypes)
    {
        this.addEnemy(enemyTypes[ind]);
    }
}

CombatManager.prototype.startAttack = function()
{
    this.state = CombatManager.State.ATTACK;
    var attackSprite = this.game.add.sprite(100,100,'attack');
    setTimeout(function() {attackSprite.destroy();}, 1000);
    this.player.startAttack(this);
}

CombatManager.prototype.hitFirstEnemy = function()
{
    for (var ind in this.enemies)
    {
        this.enemies[ind].takeHit(this);
        break;
    }
}

CombatManager.prototype.enemiesInPlace = function() {
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

CombatManager.prototype.getNumberOfEnemies = function()
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

CombatManager.prototype.getNumberOfDyingEnemies = function()
{
    return this.dyingEnemies.length;
}

CombatManager.prototype.addEnemy = function(_definition)
{
    var index = this.getNumberOfEnemies();
    var enemy = new _definition(this.game, index);
    enemy.create(this.infoManager);
    this.enemies[index] = enemy;
}

CombatManager.prototype.killEnemy = function(_index){
    this.dyingEnemies.push(this.enemies[_index]);
    delete this.enemies[_index];
}

CombatManager.prototype.startLootChoose = function()
{
    this.state = CombatManager.State.LOOT;
    this.cards.push(new SmMedkitCard(this.player, this.game, this));
    this.cards.push(new WoodShieldCard(this.player, this.game, this));
    for (ind in this.cards)
    {
        this.cards[ind].show(ind);
    }
}

CombatManager.prototype.finishLootChoose = function()
{
    this.state = CombatManager.State.FINISHED;
    for (ind in this.cards)
    {
        this.cards[ind].hide();
    }
    this.cards = [];
}

CombatManager.prototype.isCombatFinished = function()
{
    return this.state == CombatManager.State.FINISHED;
}
