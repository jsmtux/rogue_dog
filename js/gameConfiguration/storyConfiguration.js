class StoryConfiguration
{
    constructor(_mainState)
    {
        this.mainState = _mainState;
        this.waitCondition;
        this.iteration = 0;
        
        this.story = new inkjs.Story(storyContent);
        
        this.currentStoryStep = new EmptyStoryStep();
    }
        
    resetGameState(_mainState)
    {
        ServiceLocator.difficultyManager.setInitialValues(1, 0, 0);
        ServiceLocator.cardManager.lootDeck.addCards({SmMedkitCard:1});
        this.mainState = _mainState;
        this.setStoryStep(new DogEnteringStoryStep());
        
        ServiceLocator.cardManager.wildDeck.addCards({
            BeeEnemyCard:1,
            BasicEnemyCard:1
        });
    }
    
    setStoryStep(_step)
    {
        this.currentStoryStep.finish(this, this.mainState);
        this.currentStoryStep = _step;
        this.currentStoryStep.start(this, this.mainState);
    }
    
    getNextDialog()
    {
        if (!this.waitCondition || this.waitCondition())
        {
            this.waitCondition = undefined;
            var fullText;
            fullText = this.story.Continue();
            var options = [];
            if (fullText.substring(0,7) === "COMMAND")
            {
                this.readCommand(this.story.currentTags);
                return;
            }
            else
            {
                if (!this.story.canContinue)
                {
                    var options = this.story.currentChoices;
                }
                var tags = this.story.currentTags;
        
                return {fullText, options, tags};
            }
        }
    }
    
    chooseOptionIndex(_ind)
    {
        this.story.ChooseChoiceIndex(_ind);
    }
    
    readCommand(_commands)
    {
        for (var ind in _commands)
        {
            var command = _commands[ind];
            ServiceLocator.publish(new StoryCommandReceived(command));
            if(command === "GOTO WAIT_STICKS")
            {
                this.setStoryStep(new GatherSticksStoryStep());
            }
            else if (command === "GOTO DIG_DIRT")
            {
                this.setStoryStep(new DoFirstDig());
            }
            else if (command === "GOTO CLICK_CARD")
            {
                this.setStoryStep(new PickBadCard());
            }
            else if (command === "GOTO GAME_ENCOUNTER")
            {
                this.setStoryStep(new PlanFirstEncounter())
            }
            else if (command === "GOTO WAIT_COMBAT_FINISHED")
            {
                this.setStoryStep(new ContinueFirstEncounter());
            }
            else if (command === "GOTO WAIT_FOR_LOOT")
            {
                this.setStoryStep(new WaitForLoot())
            }
            else
            {
                console.log("Reached unknown command: " + command);
                continue;
            }
        }
    }
    
    storyCallback(_option)
    {
        if (!this.story.canContinue)
        {
            this.chooseOptionIndex(_option);
        }
        var nextDialog;
        while(nextDialog === undefined || nextDialog.fullText.startsWith("dog:"))
        {
            nextDialog = this.getNextDialog();
            if (!nextDialog)
            {
                return;
            }
        }
        ServiceLocator.dialogManager.setLine(nextDialog, this.storyCallback, this);
    }
    
    update(_curMode, _mainState)
    {
        this.currentStoryStep.update(this, _curMode, _mainState);
    }
    
    choosePathString(_name)
    {
        this.story.ChoosePathString(_name);
    }
    
    setStoryVariable(_name, _value)
    {
        this.story.variablesState[_name] = _value
    }
}

class EmptyStoryStep
{
    start(_storyConfiguration, _mainState) {}
    finish(_storyConfiguration, _mainState) {}
    update(_storyConfiguration, _curGameMode, _mainState) {}
    
    followDefaultRules(_curGameMode, _mainState)
    {
        var modeName = _curGameMode.getModeName();
        var nextModeArguments = _curGameMode.getNextModeArguments();
        if (modeName === "CombatLootMode")
            _mainState.setNextMode("WalkManager", nextModeArguments);
        if (modeName === "CombatManager")
        _mainState.setNextMode("CombatLootMode", nextModeArguments);
        if (modeName === "WalkManager")
        _mainState.setNextMode("CombatManager", nextModeArguments);
    }
}

class DialogStep extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        _mainState.setNextMode("DialogManager");
        _storyConfiguration.storyCallback();
    }
    
}

class DogEnteringStoryStep extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        _mainState.setNextMode("WalkManager");
        _storyConfiguration.story.ResetState();
        _storyConfiguration.choosePathString("Introduction");
    }

    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if(_curGameMode.isFinished())
        {
            _storyConfiguration.setStoryStep(new DialogStep());
        }
    }
}

class GatherSticksStoryStep extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        this.numSticks = 0;
        ServiceLocator.difficultyManager.setInitialValues(0, undefined, 0);
        _mainState.setNextMode("WalkManager");
        ServiceLocator.registerListener(this.stickRetrieved, this, "StickNumberUpdated");
        
        this.iterationsSinceSticksPicked;
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (this.iterationsSinceSticksPicked !== undefined)
        {
            this.iterationsSinceSticksPicked++;
            
            if (this.iterationsSinceSticksPicked >= 200 && _mainState.player.onGround())
            {
                _storyConfiguration.choosePathString("Introduction.got_sticks");
                _storyConfiguration.setStoryStep(new DialogStep());
            }
        }
        else if(this.numSticks == 5)
        {
            ServiceLocator.walkManager.endCurrentLevel();
            this.iterationsSinceSticksPicked = 0;
        }
    }
    
    finish(_storyConfiguration, _mainState)
    {
        ServiceLocator.removeListener(this.stickRetrieved, this, "StickNumberUpdated");
    }
    
    stickRetrieved()
    {
        console.log("Picked stick!");
        this.numSticks++;
    }
}

class DoFirstDig extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        _mainState.setNextMode("CombatManager");
        ServiceLocator.registerListener(this.cardPickedCb, this, "WildcardShown");
        this.cardPicked = false;
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (this.cardPicked)
        {
            _storyConfiguration.choosePathString("Introduction.found_bad_card");
            _mainState.setOverlayGameMode("DialogManager");
            _storyConfiguration.storyCallback();
            _storyConfiguration.setStoryStep(new EmptyStoryStep());
        }
    }
    
    cardPickedCb()
    {
        this.cardPicked = true;
    }
    
    finish(_storyConfiguration, _mainState)
    {
        ServiceLocator.removeListener(this.cardPickedCb, this, "WildcardShown");
    }
}


class PickBadCard extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        _mainState.resetOverlayGameMode();
        ServiceLocator.registerListener(this.cardPickedCb, this, "WildcardPicked");
        this.cardPicked = false;
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (this.cardPicked)
        {
            _storyConfiguration.choosePathString("Introduction.clicked_bad_card");
            _storyConfiguration.setStoryStep(new DialogStep());
        }
    }
    
    cardPickedCb()
    {
        this.cardPicked = true;
    }
    
    finish(_storyConfiguration, _mainState)
    {
        ServiceLocator.removeListener(this.cardPickedCb, this, "WildcardPicked");
    }
}

class PlanFirstEncounter extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        ServiceLocator.difficultyManager.setInitialValues(1, 3, 0);
        ServiceLocator.cardManager.lootDeck.addCards({
            SmMedkitCard:undefined,
            MagicianHatCard:1});
        _mainState.setNextMode("WalkManager");
        ServiceLocator.registerListener(this.enemiesInPlace, this, "EnemiesInPlaceMessage");
        this.enemiesArrived = false;
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (_curGameMode.isFinished())
        {
            this.followDefaultRules(_curGameMode, _mainState)
        }
        if (this.enemiesArrived)
        {
            _storyConfiguration.choosePathString("Introduction.first_encounter");
            _mainState.setOverlayGameMode("DialogManager");
            _storyConfiguration.storyCallback();
            this.enemiesArrived = false;
        }
    }
    
    enemiesInPlace()
    {
        ServiceLocator.removeListener(this.enemiesInPlace, this, "EnemiesInPlaceMessage");
        this.enemiesArrived = true;
    }
    
    finish(_storyConfiguration, _mainState)
    {
        _mainState.resetOverlayGameMode();
    }
}

class ContinueFirstEncounter extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        this.combatFinished = false;
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (_curGameMode.isFinished() && !this.combatFinished)
        {
            this.followDefaultRules(_curGameMode, _mainState)
        }
        if (!this.combatFinished && _curGameMode.getModeName() == "CombatLootMode")
        {
            this.combatFinished = true;
            _storyConfiguration.choosePathString("Introduction.combat_finished");
            _mainState.setOverlayGameMode("DialogManager");
            _storyConfiguration.storyCallback();
        }
    }
    
    finish(_storyConfiguration, _mainState)
    {
        
    }
}

class WaitForLoot extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        _mainState.resetOverlayGameMode();
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (_curGameMode.isFinished())
        {
            _storyConfiguration.choosePathString("Introduction.loot_finished");
            _storyConfiguration.setStoryStep(new DialogStep());
        }
    }
    
    finish(_storyConfiguration, _mainState)
    {
        
    }
}
