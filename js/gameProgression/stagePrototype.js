
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
        for (curRule in this.rules)
        {
            accum += this.rules[curRule];
            if (accum >= _value)
            {
                break;
            }
        }
        return parseInt(curRule);
    }
}

PrototypeRules.ruleTypes = {
    GRASS: 0,
    HOLE: 1,
    OBSTACLE: 2,
    DOUBLE_OBSTACLE: 3,
    TRIPLE_OBSTACLE: 4,
    TALL_OBSTACLE: 5,
    TUTORIAL_OBSTACLE: 6,
    PLATFORM: 7,
    RULES_SIZE: 8
}

class StagePrototype
{
    constructor (_prototypeRules, _numberObstacles)
    {
        this.obstaclesPlaced = 0;

        this.itemsToPlaceQeue = [];
        
        this.obstacleNumber = _numberObstacles;
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
                case PrototypeRules.ruleTypes.TALL_OBSTACLE:
                    ret = StagePrototype.cellType.TALL_OBSTACLE;
                    numberEmptyFollowing = 4;
                    this.obstaclesPlaced++;
                    break;
                case PrototypeRules.ruleTypes.TUTORIAL_OBSTACLE:
                    ret = StagePrototype.cellType.TUTORIAL_OBSTACLE;
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
                case PrototypeRules.ruleTypes.PLATFORM:
                    ret = StagePrototype.cellType.PLATFORM;
                    this.itemsToPlaceQeue.push(StagePrototype.cellType.PLATFORM);
                    this.itemsToPlaceQeue.push(StagePrototype.cellType.PLATFORM);
                    numberEmptyFollowing = 4;
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
        return this.obstacleNumber !== undefined && this.obstaclesPlaced >= this.obstacleNumber && this.itemsToPlaceQeue.length == 0;
    }
}

StagePrototype.cellType = {
    GRASS: 0,
    HOLE: 1,
    OBSTACLE: 2,
    TALL_OBSTACLE: 3,
    TUTORIAL_OBSTACLE: 4,
    PLATFORM: 5
}
