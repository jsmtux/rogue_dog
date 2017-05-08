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
            else if (command === "GOTO WAITFORFIRSTENCOUNTER")
            {
                this.setStoryStep(new WaitForFirstEncounter());
            }
            else if (command === "GOTO PICKCARDFIRSTENCOUNTER")
            {
                this.setStoryStep(new PickFirstLootCard());
            }
            else if (command === "GOTO CONTINUEUNTILENERGYFINISHED")
            {
                this.setStoryStep(new WaitForEnergyComplete());            
            }
            else if (command === "GOTO CONTINUEUNTILPIECESPICKED")
            {
                this.setStoryStep(new WaitForPiecesPicked());
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

//TODO: find better solution for this
var storyObstacle;

class ExploreForestStoryStep extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        ServiceLocator.difficultyManager.setInitialValues(0, 0, 100, DifficultyManager.ObstacleLevelsName.STORY_ENEMY_OBSTACLE);
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
    
    obstacleFound(_message)
    {
        storyObstacle = _message.getObstacle();
        this.iterationsSinceObstacleFound = 0;
    }
}

class DefeatObstacleStoryStep extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        console.log("should fix problem if dog jumped right before");
        ServiceLocator.registerListener(this.skillCallback, this, "SkillSelectorResultMessage");
        _mainState.setNextMode("CombatManager");
        this.success;
    }
    
    skillCallback(_message)
    {
        this.success = _message.getHitPercentage() > 0.8;
        if(this.success)
        {
            storyObstacle.break();
        }
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (this.success !== undefined)
        {
            if(this.success)
            {
                storyObstacle.break();
                _storyConfiguration.choosePathString("Forest.obstacle_moved");
            }
            else
            {
                _storyConfiguration.choosePathString("Forest.failed_moving_obstacle");
            }
            _storyConfiguration.setStoryStep(new DialogStep());
        }
    }
    
    finish()
    {
        ServiceLocator.removeListener(this.skillCallback, this, "SkillSelectorResultMessage");
    }
}

class WaitForFirstEncounter extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        ServiceLocator.difficultyManager.setInitialValues(0, 0, 7, DifficultyManager.ObstacleLevelsName.STORY_BEFORE_FIRST_COMBAT);
        _mainState.setNextMode("WalkManager");
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if(_curGameMode.isFinished())
        {
            _storyConfiguration.setStoryStep(new FirstEncounter());
        }
    }
}

class FirstEncounter extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        ServiceLocator.difficultyManager.unlockEnemy();
        _mainState.setNextMode("CombatManager", [BasicEnemy]);
        ServiceLocator.registerListener(this.enemiesInPlace, this, "EnemiesInPlaceMessage");
        ServiceLocator.registerListener(this.finishedDialog, this, "StoryCommandReceived");
        this.enemiesAlreadyInPlace = false;
        this.commentShown = false;
        this.dialogFinished = false;
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (this.dialogFinished && _curGameMode.isFinished())
        {
            _storyConfiguration.choosePathString("Forest.enemy_encounter_defeated");
            _storyConfiguration.setStoryStep(new DialogStep());
        }
        if (this.dialogFinished)
        {
            _mainState.resetOverlayGameMode();
        }
        else if (this.commentShown)
        {
            
        }
        else if (this.enemiesAlreadyInPlace)
        {
            _storyConfiguration.choosePathString("Forest.enemy_encounter");
            _mainState.setOverlayGameMode("DialogManager");
            _storyConfiguration.storyCallback();
            this.commentShown = true;
        }
    }
    
    enemiesInPlace()
    {
        this.enemiesAlreadyInPlace = true;
    }
    
    finishedDialog()
    {
        this.dialogFinished = true;
    }
    
    finish()
    {
        ServiceLocator.removeListener(this.enemiesInPlace, this, "EnemiesInPlaceMessage");
        ServiceLocator.removeListener(this.finishedDialog, this, "StoryCommandReceived");
    }
}

class PickFirstLootCard extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        _mainState.setNextMode("CombatLootMode", [SmMedkitCard]);
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (_curGameMode.isFinished())
        {
            _storyConfiguration.choosePathString("Forest.enemy_encounter_finished");
            _storyConfiguration.setStoryStep(new DialogStep());
        }
    }
    
    finish()
    {
    }
}

class WaitForEnergyComplete extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        ServiceLocator.difficultyManager.setInitialValues(1, 1, 3, 0);
        _mainState.setNextMode("WalkManager");
        ServiceLocator.registerListener(this.cardPicked, this, "CardLootedMessage");
        
        this.energyLooted = 0;
        
        ServiceLocator.cardManager.setDeckNumbers({SmMedkitCard:undefined,
            SmEnergyCard:undefined,
            MedEnergyCard:undefined,
            BigEnergyCard:undefined,
            NewEnemyCard:0,
            StrongerBasicEnemyCard:2,
            NewObstacleCard:3,
            MoreObstaclesCard:undefined,
            TwoEnemiesCard:1});
    }
    
    cardPicked(_msg)
    {
        var card = _msg.getCard();
        
        if (card && card.getEnergyIncrease)
        {
            this.energyLooted += card.getEnergyIncrease();
        }
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (_curGameMode.isFinished())
        {
            if (this.energyLooted >= 4)
            {
                _storyConfiguration.choosePathString("Forest.found_energy");
                _storyConfiguration.setStoryStep(new DialogStep());
            }
            else
            {
                this.followDefaultRules(_curGameMode, _mainState);
            }
        }
    }
    
    finish()
    {
    }
}

class WaitForPiecesPicked extends EmptyStoryStep
{
    start(_storyConfiguration, _mainState)
    {
        ServiceLocator.difficultyManager.setInitialValues(1, 1, 3, 0);
        _mainState.setNextMode("WalkManager");
        ServiceLocator.registerListener(this.cardPicked, this, "GearCardCollectedMessage");
        
        this.taskFinished = false;
        
        ServiceLocator.cardManager.setDeckNumbers({SmMedkitCard:undefined,
            SmEnergyCard:undefined,
            MedEnergyCard:undefined,
            BigEnergyCard:undefined,
            NewEnemyCard:0,
            StrongerBasicEnemyCard:2,
            NewObstacleCard:3,
            MoreObstaclesCard:undefined,
            TwoEnemiesCard:1});
    }
    
    cardPicked(_msg)
    {
        this.taskFinished = true;
    }
    
    update(_storyConfiguration, _curGameMode, _mainState)
    {
        if (this.taskFinished)
        {
            _storyConfiguration.choosePathString("Forest.found_gear");
            _storyConfiguration.setStoryStep(new DialogStep());
        }
        if (_curGameMode.isFinished())
        {
            this.followDefaultRules(_curGameMode, _mainState);
        }
    }
    
    finish()
    {
    }
}