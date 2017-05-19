class BasicEnemySpec
{
    constructor(_level)
    {
        this.cardProbabilities = {}
        this.cardProbabilities["NewEnemyCard"] = Enemy.cardProbability.VERY_HIGH;
        this.cardProbabilities["StrongerBasicEnemyCard"] = Enemy.cardProbability.LOW;
        this.cardProbabilities["TwoEnemiesCard"] = Enemy.cardProbability.VERY_HIGH;
        this.cardProbabilities["SmEnergyCard"] = Enemy.cardProbability.LOW;
        this.cardProbabilities["SmMedkitCard"] = Enemy.cardProbability.LOW;
        if (_level > 0)
        {
            this.cardProbabilities["MoreObstaclesCard"] = Enemy.cardProbability.LOW;
            this.cardProbabilities["NewObstacleCard"] = Enemy.cardProbability.LOW;
        }
        switch(_level)
        {
            case 0:
                this.setValues(1000, 1, 5);
                break;
            case 1:
                this.setValues(700, 2, 10);
                break;
            case 2:
                this.setValues(600, 3, 10);
                break;
        }
        
    }
    
    setValues(_timeout, _retries, _health)
    {
        this.timeout = _timeout;
        this.retries = _retries;
        this.health = _health;
    }
}

class BeeEnemySpec
{
    constructor(_level)
    {
        switch(_level)
        {
            case 0:
                this.health = 5;
                this.bulletSpeed = 3;
                break;
            case 1:
                this.health = 5;
                this.bulletSpeed = 5;
                break;
            case 2:
                this.health = 5;
                this.bulletSpeed = 7;
                break;
        }
        
        this.cardProbabilities = {}
        this.cardProbabilities["MoreObstaclesCard"] = Enemy.cardProbability.LOW;
        this.cardProbabilities["SmEnergyCard"] = Enemy.cardProbability.LOW;
        this.cardProbabilities["StrongerBeeEnemyCard"] = Enemy.cardProbability.LOW;
        this.cardProbabilities["SmMedkitCard"] = Enemy.cardProbability.LOW;
        this.cardProbabilities["NewObstacleCard"] = Enemy.cardProbability.LOW;
    }
}