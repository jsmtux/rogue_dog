class DifficultyManager
{
    getHoleProbability()
    {
        return 0.4;
    }
    
    getSpikeNumber()
    {
        return 15;
    }
    
    getTallSpikeProbability()
    {
        return 0.0;
    }
    
    getSpikeProbability()
    {
        return 0.6
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
    
    getEnemies()
    {
        return [BasicEnemy, BasicEnemy];
        var ret = [];
        
        for (var i = 0; i < 2; i++)
        {
            var enemy;
            
            if (Math.random() < 0.5)
            {
                enemy = BasicEnemy;
            }
            else
            {
                enemy = BeeEnemy;
            }
            
            ret.push(enemy);
        }
        
        return ret;
    }
}
