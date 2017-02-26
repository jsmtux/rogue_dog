class DifficultyManager
{
    getSpikeNumber()
    {
        return 15;
    }
    
    getNextSpikeSeparation()
    {
        return randomInt(0, 2) * 30 + 60;
    }
    
    getBasicEnemyTimeout()
    {
        return 1200;
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
