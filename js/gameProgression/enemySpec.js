class BasicEnemySpec
{
    constructor(_level)
    {
        switch(_level)
        {
            case 0:
                this.setValues(1000, 1, 15);
                break;
            case 1:
                this.setValues(700, 2, 20);
                break;
            case 2:
                this.setValues(600, 3, 30);
                break;
        }
        
    }
    
    setValues(_timeout, _retries, _health)
    {
        this.timeout = _timeout;
        this.retries = _retries;
        this.health = _health;
        this.bulletSpeed = 4;
    }
}

class BeeEnemySpec
{
    constructor(_level)
    {
        switch(_level)
        {
            case 0:
                this.health = 10;
                this.bulletSpeed = 3;
                break;
            case 1:
                this.health = 10;
                this.bulletSpeed = 5;
                break;
            case 2:
                this.health = 10;
                this.bulletSpeed = 7;
                break;
        }
    }
}