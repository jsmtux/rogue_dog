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
            if (!this.story.canContinue)
            {
                var options = this.story.currentChoices;
            }
    
            return {fullText, options};
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
            ServiceLocator.dialogManager.setLine(this.getNextDialog(), this.callback, this);
            return "DialogManager";
        }
    }
    
    callback(_option)
    {
        console.log("Chosen");
        var optionIndex = parseInt(_option.charAt(0));
        console.log(optionIndex);
        if (!this.story.canContinue)
        {
            this.chooseOptionIndex(optionIndex);
        }
        ServiceLocator.dialogManager.setLine(this.getNextDialog(), this.callback, this);
    }
    
    update()
    {
        
    }
}