class EndlessConfiguration
{
    constructor()
    {
    }
    
    resetGameState(_mainState)
    {
        ServiceLocator.difficultyManager.setInitialValues(1, 1, 3, 0);
        
        ServiceLocator.cardManager.setDeckNumbers({SmMedkitCard:undefined,
            SmEnergyCard:undefined,
            MedEnergyCard:undefined,
            BigEnergyCard:undefined,
            NewEnemyCard:1,
            StrongerBasicEnemyCard:2,
            StrongerBeeEnemyCard:2,
            NewObstacleCard:3,
            MoreObstaclesCard:undefined,
            TwoEnemiesCard:1,
            ThreeEnemiesCard:1});
        
        _mainState.setNextMode("WalkManager");
    }
        
    update(_curMode, _mainState)
    {
        if (!_curMode)
        {
            _mainState.setNextMode("WalkManager");
        }
        else if (_curMode.isFinished())
        {
            var modeName = _curMode.getModeName();
            var nextModeArguments = _curMode.getNextModeArguments();
            if (modeName === "CombatLootMode")
                _mainState.setNextMode("WalkManager", nextModeArguments);
            if (modeName === "CombatManager")
            _mainState.setNextMode("CombatLootMode", nextModeArguments);
            if (modeName === "WalkManager")
            _mainState.setNextMode("CombatManager", nextModeArguments);
        }
    }
}