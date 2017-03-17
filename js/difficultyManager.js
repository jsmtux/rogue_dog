class DifficultyManager
{
    constructor()
    {
    }
    
    create()
    {
        this.difficultyLevel = 0;
        this.unlockedEnemies = [];
        this.unlockEnemy();
        this.combatEnemyNumber = 1;
        this.obstacleNumber = 3;
    }
        
    getNextSpikeSeparation()
    {
        return randomInt(0, 2) * 30 + 60;
    }
    
    getBasicEnemyTimeout()
    {
        return 700;
    }
    
    getBasicEnemyRetries()
    {
        return 3;
    }
    
    getBeeBulletSpeed()
    {
        return 4;
    }
    
    getLineTimeAlive()
    {
        return 600;
    }
    
    unlockEnemy()
    {
        this.unlockedEnemies.push(DifficultyManager.UnlockableEnemies[this.unlockedEnemies.length]);
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
        prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.OBSTACLE, 0.1);
        prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.DOUBLE_OBSTACLE, 0.2);
        prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.TRIPLE_OBSTACLE, 0.1);
        return new StagePrototype(prototypeRules, this.obstacleNumber);
    }
    
    getUndergroundStagePrototype()
    {
        var prototypeRules = new PrototypeRules();
        prototypeRules.setRuleProbability(PrototypeRules.ruleTypes.GRASS, 1.0);
        return new StagePrototype();
    }
}

DifficultyManager.UnlockableEnemies = [BasicEnemy, BeeEnemy];

class PrototypeRules
{
    constructor()
    {
        this.rules = {};
        this.computedValues;
    }
    
    setRuleProbability(_type, _probability)
    {
        this.rules[_type] = _probability;
    }
    
    getRuleForValue(_value)
    {
        var accum = 0;
        var curRule = PrototypeRules.ruleTypes.GRASS;
        while (accum < _value)
        {
            accum += this.rules[curRule];
            curRule++;
        }
        return curRule - 1;
    }
}

PrototypeRules.ruleTypes = {
    GRASS: 0,
    HOLE: 1,
    OBSTACLE: 2,
    DOUBLE_OBSTACLE: 3,
    TRIPLE_OBSTACLE: 4,
    TALL_OBSTACLE: 5,
    RULES_SIZE: 6
}

class StagePrototype
{
    constructor (_prototypeRules, _numberObstacles)
    {
        this.obstaclesPlaced = 0;

        this.itemsToPlaceQeue = [];
        
        this.spikeNumber = _numberObstacles;
        this.rules = _prototypeRules;
    }
    
    getNextCellType()
    {
        var ret;
        
        if (!this.rules)
        {
            return StagePrototype.cellType.GRASS;
        }
        
        if (this.itemsToPlaceQeue.length > 0)
        {
            ret = this.itemsToPlaceQeue.shift();
        }
        else
        {
            var ruleToAdd = this.rules.getRuleForValue(Math.random());
            
            var numberEmptyFollowing = 0;

            switch(ruleToAdd)
            {
                case PrototypeRules.ruleTypes.GRASS:
                    break;
                case PrototypeRules.ruleTypes.HOLE:
                    ret = StagePrototype.cellType.HOLE;
                    this.itemsToPlaceQeue.push(StagePrototype.cellType.HOLE);
                    this.itemsToPlaceQeue.push(StagePrototype.cellType.HOLE);
                    this.itemsToPlaceQeue.push(StagePrototype.cellType.HOLE);

                    numberEmptyFollowing = 6;
                    break;
                case PrototypeRules.ruleTypes.OBSTACLE:
                    ret = StagePrototype.cellType.OBSTACLE;
                    numberEmptyFollowing = 6;
                    this.obstaclesPlaced++;
                    break;
                case PrototypeRules.ruleTypes.DOUBLE_OBSTACLE:
                    ret = StagePrototype.cellType.OBSTACLE;
                    this.itemsToPlaceQeue.push(StagePrototype.cellType.OBSTACLE);
                    numberEmptyFollowing = 7;
                    this.obstaclesPlaced += 2;
                    break;
                case PrototypeRules.ruleTypes.TRIPLE_OBSTACLE:
                    ret = StagePrototype.cellType.OBSTACLE;
                    this.itemsToPlaceQeue.push(StagePrototype.cellType.OBSTACLE);
                    this.itemsToPlaceQeue.push(StagePrototype.cellType.OBSTACLE);
                    numberEmptyFollowing = 8;
                    this.obstaclesPlaced += 3;
                    break;
            }

            for (var i = 0; i < numberEmptyFollowing; i++)
            {
                this.itemsToPlaceQeue.push(StagePrototype.cellType.GRASS);
            }
        }
        
        return ret;
    }
    
    isStageFinished()
    {
        return this.obstaclesPlaced >= this.spikeNumber;
    }
}

StagePrototype.cellType = {
    GRASS: 0,
    HOLE: 1,
    OBSTACLE: 2,
    TALL_OBSTACLE: 3
}