class DifficultyManager
{
    constructor()
    {
    }
    
    create()
    {
    }
    
    setInitialValues(_enemyNumber, _combatEnemyNumber, _obstacleNumber, _obstacleLevel)
    {
        this.enemiesDifficulty = {};

        this.unlockedEnemies = [];
        for (var i = 0; i < _enemyNumber; i++)
        {
            this.unlockEnemy();
        }

        this.combatEnemyNumber = _combatEnemyNumber;

        this.obstacleNumber = _obstacleNumber;
        this.obstacleLevel = _obstacleLevel;
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
        switch(this.obstacleLevel)
        {
            case 0:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 0.4);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.HOLE, 0.2);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.OBSTACLE, 0.4);
                break;
            case 1:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 0.4);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.HOLE, 0.2);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.OBSTACLE, 0.2);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.DOUBLE_OBSTACLE, 0.2);
                break;
            case 2:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 0.4);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.HOLE, 0.2);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.DOUBLE_OBSTACLE, 0.3);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.TRIPLE_OBSTACLE, 0.1);
                break;
            case 3:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 0.4);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.HOLE, 0.2);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.DOUBLE_OBSTACLE, 0.2);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.TRIPLE_OBSTACLE, 0.2);
                break;
            case DifficultyManager.ObstacleLevelsName.STORY_BEGIN:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 1.0);
                break;
            case DifficultyManager.ObstacleLevelsName.STORY_TRIALS:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 0.5);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.OBSTACLE, 0.5);
                break;
            case DifficultyManager.ObstacleLevelsName.STORY_ENEMY_OBSTACLE:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 0.4);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.OBSTACLE, 0.55);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.TUTORIAL_OBSTACLE, 0.05);
                break;
            case DifficultyManager.ObstacleLevelsName.STORY_BEFORE_FIRST_COMBAT:
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 0.4);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.HOLE, 0.2);
                prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.OBSTACLE, 0.4);
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
        prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 0.8);
        prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.PLATFORM, 0.2);
        return new StagePrototype(prototypeRules);
    }
    
    getCardSpawnChance()
    {
        return 0.02;
    }
}

DifficultyManager.UnlockableEnemies = [BasicEnemy, BeeEnemy];
DifficultyManager.ObstacleLevelsName = {
    STORY_BEGIN : 4,
    STORY_TRIALS : 5,
    STORY_ENEMY_OBSTACLE: 6,
    STORY_BEFORE_FIRST_COMBAT: 7
}