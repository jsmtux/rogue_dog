class DifficultyManager
{
    getSpikeNumber()
    {
        return 9;
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
}