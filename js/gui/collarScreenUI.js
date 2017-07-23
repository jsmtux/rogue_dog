class CollarScreenUI extends GuiElement
{
    constructor()
    {
        super();
    }
    
    create(_slickUI, _game, _customBmd)
    {
        _slickUI.add(this.panel = new SlickUI.Element.Panel(150, 250, 70, 70));
        this.panel.add(this.faceText = new SlickUI.Element.Text(5, 5, getCodeForEmoji(":smile:"), 50, "noto_emoji"));        
    }
    
    setFace(_charName)
    {
        this.faceText.value = getCodeForEmoji(_charName);
    }
}
