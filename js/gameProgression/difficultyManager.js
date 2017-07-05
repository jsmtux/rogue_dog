class DifficultyManager
{
    constructor()
    {
    }
    
    create()
    {
    }
    
    setInitialValues(_combatEnemyNumber, _obstacleNumber, _obstacleLevel)
    {
        this.enemiesDifficulty = {};

        this.unlockedEnemies = [];

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
    
    unlockEnemy(_enemyClass)
    {
        this.unlockedEnemies.push(_enemyClass);
        this.enemiesDifficulty[_enemyClass.NAME] = 0;
    }
    
    setNumberOfEnemies(_amount)
    {
        this.combatEnemyNumber = _amount;
    }
    
    getEnemies()
    {
        var ret = [];
        
        if (this.unlockedEnemies.length === 0)
        {
            return ret;
        }
        
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
                prototypeRules.setRuleProbability(GrassStagePiece, 0.4);
                prototypeRules.setRuleProbability(HoleStagePiece, 0.25);
                prototypeRules.setRuleProbability(Bonus1StagePiece, 0.35);
                break;
            case 1:
                prototypeRules.setRuleProbability(GrassStagePiece, 0.25);
                prototypeRules.setRuleProbability(HoleStagePiece, 0.1);
                prototypeRules.setRuleProbability(HoleObstacleStagePiece, 0.05);
                prototypeRules.setRuleProbability(Bonus1StagePiece, 0.3);
                prototypeRules.setRuleProbability(DoubleObstacleStagePiece, 0.1);
                prototypeRules.setRuleProbability(MultipleJumpsPiece, 0.1);
                prototypeRules.setRuleProbability(SmallJumpObstaclePiece, 0.1);
                break;
            case 2:
                prototypeRules.setRuleProbability(GrassStagePiece, 0.2);
                prototypeRules.setRuleProbability(HoleObstacleStagePiece, 0.1);
                prototypeRules.setRuleProbability(Bonus1StagePiece, 0.3);
                prototypeRules.setRuleProbability(DoubleObstacleStagePiece, 0.1);
                prototypeRules.setRuleProbability(SmallJumpObstaclePiece, 0.1);
                prototypeRules.setRuleProbability(MultipleJumpsPiece, 0.1);
                prototypeRules.setRuleProbability(TripleObstacleStagePiece, 0.1);
                break;
            case 3:
                prototypeRules.setRuleProbability(GrassStagePiece, 0.2);
                prototypeRules.setRuleProbability(HoleObstacleStagePiece, 0.1);
                prototypeRules.setRuleProbability(Bonus1StagePiece, 0.2);
                prototypeRules.setRuleProbability(DoubleObstacleStagePiece, 0.05);
                prototypeRules.setRuleProbability(SmallJumpObstaclePiece, 0.1);
                prototypeRules.setRuleProbability(MultipleJumpsPiece, 0.15);
                prototypeRules.setRuleProbability(TripleObstacleStagePiece, 0.2);
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
        prototypeRules.setRuleProbability(GrassStagePiece, 0.8);
        prototypeRules.setRuleProbability(PlatformStagePiece, 0.2);
        return new StagePrototype(prototypeRules);
    }
    
    getCardSpawnChance()
    {
        return 0.02;
    }
}
