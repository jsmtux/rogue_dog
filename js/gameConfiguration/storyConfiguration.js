class StoryConfiguration
{
    constructor(_mainState)
    {
        this.mainState = _mainState;
        this.waitCondition;
        this.iteration = 0;
        
        this.story = new inkjs.Story(storyContent);
    }
        
    resetGameState(_mainState)
    {
        ServiceLocator.difficultyManager.setInitialValues(0, 0, 0, DifficultyManager.ObstacleLevelsName.STORY_BEGIN);
        ServiceLocator.cardManager.setDeckNumbers({SmMedkitCard:1});
        this.mainState = _mainState;
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
    
    getNextMode(_curMode)
    {
        if (!_curMode)
        {
            return "WalkManager";
        }
        if (_curMode.isFinished())
        {
            this.storyCallback();
            return "DialogManager";
        }
    }
    
    readCommand(commandArray)
    {
        console.log(commandArray);
    }
    
    storyCallback(_option)
    {
        if (!this.story.canContinue)
        {
            var optionIndex = parseInt(_option.charAt(0));
            this.chooseOptionIndex(optionIndex);
        }
        var nextDialog = this.getNextDialog();
        if (nextDialog)
        {
            ServiceLocator.dialogManager.setLine(nextDialog, this.storyCallback, this);
        }
    }
    
    update()
    {
        
    }
}