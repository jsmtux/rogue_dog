class EndlessConfiguration
{
    constructor()
    {
        this.nextModeArguments;
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
    }
    
    update()
    {
        
    }
    
    getNextMode(_curMode)
    {
        if (!_curMode)
        {
            return "WalkManager";
        }
        if (_curMode.isFinished())
        {
            var modeName = _curMode.getModeName();
            this.nextModeArguments = _curMode.getNextModeArguments();
            if (modeName === "CombatLootMode")
                return "WalkManager";
            if (modeName === "CombatManager")
                return "CombatLootMode";
            if (modeName === "WalkManager")
                return "CombatManager";
        }
    }
    
    getNextModeArguments()
    {
        return this.nextModeArguments;
    }
}