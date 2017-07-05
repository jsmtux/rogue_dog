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
        var nextDialog = this.getNextDialog();
        if (nextDialog)
        {
            ServiceLocator.dialogManager.setLine(nextDialog, this.storyCallback, this);
        }
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
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if(this.numSticks >= 5)
        {
            _storyConfiguration.choosePathString("Introduction.got_sticks");
            _storyConfiguration.setStoryStep(new DialogStep());
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
