function DifficultyManager()
{
}

DifficultyManager.prototype.getSpikeNumber = function()
{
    return 1;
}

DifficultyManager.prototype.getSpikeVarSeparation = function()
{
    return Math.random() * 180;
}

DifficultyManager.prototype.getBasicEnemyTimeout = function()
{
    return 1200;
}

DifficultyManager.prototype.getBeeBulletSpeed = function()
{
    return 4;
}