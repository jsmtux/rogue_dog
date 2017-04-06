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
        ServiceLocator.difficultyManager.setInitialValues(0, 0, 0, DifficultyManager.ObstacleLevelsName.STORY_BEGIN);
        ServiceLocator.cardManager.setDeckNumbers({SmMedkitCard:1});
        this.mainState = _mainState;
        this.setStoryStep(new JumpFenceStoryStep());
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
            var fullText = [];
            fullText.push(this.story.Continue());
            var options = [];
            if (fullText[0].substring(0,7) === "COMMAND")
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
        
                return {fullText, options};
            }
        }
    }
    
    chooseOptionIndex(_ind)
    {
        this.story.ChooseChoiceIndex(_ind);
    }
    
    readCommand(commandArray)
    {
        var command = commandArray[0];
        if(command === "GOTO TRIALS")
        {
            this.setStoryStep(new JumpingTutorialStoryStep());
        }
        else if (command === "GOTO JUMP_TUTORIAL")
        {
            this.setStoryStep(new ShowJumpingInteractionStoryStep());
        }
        else if (command === "GOTO JUMPFENCE")
        {
            this.setStoryStep(new JumpFenceStoryStep());
        }
        else if (command === "GOTO EXPLOREFOREST")
        {
            this.setStoryStep(new ExploreForestStoryStep());
        }
        else if (command === "GOTO MOVEOBSTACLE")
        {
            this.setStoryStep(new DefeatObstacleStoryStep());
        }
        else
        {
            console.error("Reached unknown command: " + command);
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

class ShowJumpingInteractionStoryStep extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        _mainState.setNextMode("JumpTutorial");
        setTimeout(function() {_storyConfiguration.setStoryStep(new DialogStep())}, 3000);
    }
    
    finish(_storyConfiguration, _mainState)
    {
    }
}

class JumpingTutorialStoryStep extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        this.numTimesFailed = 0;
        ServiceLocator.difficultyManager.setInitialValues(0, 0, 5, DifficultyManager.ObstacleLevelsName.STORY_TRIALS);
        _mainState.setNextMode("WalkManager");
        ServiceLocator.registerListener(this.jumpFailed, this, "JumpFailedMessage");
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if(_curGameMode.isFinished())
        {
            if (this.numTimesFailed > 0)
            {
                _storyConfiguration.setStoryVariable("training_times_failed", this.numTimesFailed)
                _storyConfiguration.choosePathString("Training.trials_finished_retry");
            }
            else
            {
                _storyConfiguration.choosePathString("Training.trials_finished_ok");
            }
            _storyConfiguration.setStoryStep(new DialogStep());
        }        
    }
    
    finish(_storyConfiguration, _mainState)
    {
        ServiceLocator.removeListener(this.jumpFailed, this, "JumpFailedMessage");
    }
    
    jumpFailed()
    {
        this.numTimesFailed++;
    }
}

class JumpFenceStoryStep extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        ServiceLocator.difficultyManager.setInitialValues(0, 0, 1, DifficultyManager.ObstacleLevelsName.STORY_TRIALS);
        _mainState.setNextMode("WalkManager");
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if(_curGameMode.isFinished())
        {
            _storyConfiguration.choosePathString("Forest");
            _storyConfiguration.setStoryStep(new DialogStep());
        }        
    }
}

class ExploreForestStoryStep extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        ServiceLocator.difficultyManager.setInitialValues(0, 0, 1, DifficultyManager.ObstacleLevelsName.STORY_ENEMY_OBSTACLE);
        _mainState.setNextMode("WalkManager");
        ServiceLocator.registerListener(this.obstacleFound, this, "ObstacleShownMessge");
        this.iterationsSinceObstacleFound = -1;
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (this.iterationsSinceObstacleFound >= 0)
        {
            this.iterationsSinceObstacleFound++;
        }
        if (this.iterationsSinceObstacleFound > 40)
        {
            this.iterationsSinceObstacleFound = -1;
            
            _storyConfiguration.choosePathString("Forest.found_obstacle");
            _storyConfiguration.setStoryStep(new DialogStep());
        }
    }
    
    obstacleFound()
    {
        this.iterationsSinceObstacleFound = 0;
    }
}

class DefeatObstacleStoryStep extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        console.log("should set up fight with stupid obstacle");
        console.log("should fix problem if dog jumped right before");
    }
    
}