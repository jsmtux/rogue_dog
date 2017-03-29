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
            var paragraphText = this.story.Continue();
            var options = this.story.currentChoices;
    
            return {paragraphText, options};
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
            ServiceLocator.dialogManager.setLine(this.getNextDialog());
            return "DialogManager";
        }
    }
    
    update()
    {
        
    }
}