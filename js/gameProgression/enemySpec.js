class BasicEnemySpec
{
    constructor(_level)
    {
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
        
        this.cardProbabilities = {}
        this.cardProbabilities["NewEnemyCard"] = Enemy.cardProbability.LOW;
        this.cardProbabilities["StrongerBasicEnemyCard"] = Enemy.cardProbability.LOW;
        this.cardProbabilities["MoreObstaclesCard"] = Enemy.cardProbability.LOW;
        this.cardProbabilities["TwoEnemiesCard"] = Enemy.cardProbability.LOW;
        this.cardProbabilities["SmEnergyCard"] = Enemy.cardProbability.LOW;
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
                this.bulletSpeed = 7;
                break;
            case 1:
                this.health = 5;
                this.bulletSpeed = 6;
                break;
            case 2:
                this.health = 5;
                this.bulletSpeed = 4;
                break;
        }
        
        this.cardProbabilities = {}
        this.cardProbabilities["MoreObstaclesCard"] = Enemy.cardProbability.LOW;
        this.cardProbabilities["SmEnergyCard"] = Enemy.cardProbability.MED;
        this.cardProbabilities["StrongerBeeEnemyCard"] = Enemy.cardProbability.LOW;
    }
}