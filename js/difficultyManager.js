function DifficultyManager()
{
}

DifficultyManager.prototype.getSpikeNumber = function()
{
    return 15;
}

DifficultyManager.prototype.getNextSpikeSeparation = function()
{
    return randomInt(0, 2) * 30 + 60;
}

DifficultyManager.prototype.getBasicEnemyTimeout = function()
{
    return 1200;
}

DifficultyManager.prototype.getBeeBulletSpeed = function()
{
    return 4;
}

DifficultyManager.prototype.getLineTimeAlive = function()
{
    return 600;
}