class TapGesture
{
    constructor(_game, _inputManager)
    {
        this.game = _game;
        this.inputManager = _inputManager;
        this.tapNumber = 0;
        this.energyBar = new EnergyBar();
        this.created = false;
        this.percentage = 0;
    }
    
    static preload(_game)
    {
        EnergyBar.preload(_game);
    }
    
    add()
    {
        this.percentage = 0;
        if (!this.created)
        {
            this.energyBar.create();
            this.created = true;
        }
        else
        {
            this.energyBar.setPercentage(this.percentage);
            this.energyBar.setVisible(true);
        }

        this.inputManager.leftButton.onDown.add(this.handleTap, this);
        this.game.updateSignal.add(this.update, this);
    }
    
    remove()
    {
        this.energyBar.setVisible(false);
        this.tapNumber = 0;
        this.inputManager.leftButton.onDown.remove(this.handleTap, this);
        this.game.updateSignal.remove(this.update, this);
    }
    
    update()
    {
        if (this.percentage > 0)
        {
            this.percentage -= 0.001;
            this.energyBar.setPercentage(this.percentage);
        }
    }
    
    handleTap()
    {
        this.tapNumber++;
        this.percentage += 0.1;
        this.energyBar.setPercentage(this.percentage);
    }
    
    getSuccess()
    {
        return this.percentage >= 0.9;
    }
}
