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
    }
}