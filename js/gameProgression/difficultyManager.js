class DifficultyManager
{
    constructor()
    {
    }
    
    create()
    {
        this.enemiesDifficulty = {};

        this.unlockedEnemies = [];
        this.unlockEnemy();

        this.combatEnemyNumber = 1;

        this.obstacleNumber = 3;
        this.obstacleLevel = 0;
    }
    
    getEnemySpec(_name)
    {
        var level = this.enemiesDifficulty[_name];
        
        switch(_name)
        {
            case "BasicEnemy":
                return new BasicEnemySpec(level);
            case "BeeEnemy":
                return new BeeEnemySpec(level);
        }
    }
    
    increaseEnemyDifficulty(_enemyName)
    {
        this.enemiesDifficulty[_enemyName]++;
    }
    
    getLineTimeAlive()
    {
        return 600;
    }
    
    unlockEnemy()
    {
        var newEnemyType = DifficultyManager.UnlockableEnemies[this.unlockedEnemies.length];
        this.unlockedEnemies.push(newEnemyType);
        this.enemiesDifficulty[newEnemyType.NAME] = 0;
    }
    
    setNumberOfEnemies(_amount)
    {
        this.combatEnemyNumber = _amount;
    }
    
    getEnemies()
    {
        var ret = [];
        
        for (var i = 0; i < this.combatEnemyNumber; i++)
        {
            var enemy = this.unlockedEnemies[randomInt(1, this.unlockedEnemies.length) - 1];
            
            ret.push(enemy);
        }
        
        return ret;
    }
    
    increaseObstacleNumber()
    {
        this.obstacleNumber++;
    }
    
    getStagePrototype()
    {
        var prototypeRules = new PrototypeRules();
        prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 0.4);
        prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.HOLE, 0.2);
        switch(this.obstacleLevel)
        {
            case 0:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.OBSTACLE, 0.4);
                break;
            case 1:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.OBSTACLE, 0.2);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.DOUBLE_OBSTACLE, 0.2);
                break;
            case 2:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.DOUBLE_OBSTACLE, 0.3);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.TRIPLE_OBSTACLE, 0.1);
                break;
            case 3:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.DOUBLE_OBSTACLE, 0.2);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.TRIPLE_OBSTACLE, 0.2);
                break;
        }
        return new StagePrototype(prototypeRules, this.obstacleNumber);
    }
    
    increaseObstacleLevel()
    {
        this.obstacleLevel++;
    }
    
    getUndergroundStagePrototype()
    {
        var prototypeRules = new PrototypeRules();
        prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 1.0);
        return new StagePrototype();
    }
}

DifficultyManager.UnlockableEnemies = [BasicEnemy, BeeEnemy];
