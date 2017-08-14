class EndlessConfiguration
{
    constructor()
    {
    }
    
    resetGameState(_mainState)
    {
        ServiceLocator.difficultyManager.setInitialValues(1, 0, 0);
        
        var lootDeck = ServiceLocator.cardManager.lootDeck;
        var wildDeck = ServiceLocator.cardManager.wildDeck;
        lootDeck.addCard("SmMedkitCard", undefined);
        //lootDeck.addCard("MagicianHatCard", 1);

        wildDeck.addCard("BeeEnemyCard", 1);
        wildDeck.addCard("BasicEnemyCard", 1);
        
        _mainState.setNextMode("WalkManager");
        
        _mainState.topBarUI.visible(true);
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
            {
                if (nextModeArguments.length === 0)
                {
                    _mainState.setNextMode("WalkManager", nextModeArguments);
                }
                else
                {
                    _mainState.setNextMode("CombatLootMode", nextModeArguments);
                }
            }
            if (modeName === "WalkManager")
            {
                _mainState.setNextMode("CombatManager", nextModeArguments);
            }
        }
    }
}