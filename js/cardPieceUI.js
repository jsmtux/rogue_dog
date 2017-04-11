class CardPieceUI
{
    constructor()
    {
        this.currentPieceNumber = 0;
        this.cardGroup;
    }
    
    static preload(_game)
    {
        _game.load.image("piecesUI0", "img/card/piecesUI/pieces_ui_0.png");
        _game.load.image("piecesUI1", "img/card/piecesUI/pieces_ui_1.png");
        _game.load.image("piecesUI2", "img/card/piecesUI/pieces_ui_2.png");
        _game.load.image("piecesUI3", "img/card/piecesUI/pieces_ui_3.png");
        _game.load.image("piecesUI4", "img/card/piecesUI/pieces_ui_4.png");
        _game.load.image("piecesUI5", "img/card/piecesUI/pieces_ui_5.png");
        _game.load.image("piecesUI6", "img/card/piecesUI/pieces_ui_6.png");
        _game.load.image("piecesUI7", "img/card/piecesUI/pieces_ui_7.png");
    }
    
    create(_game)
    {
        this.cardGroup = _game.add.group();
        ServiceLocator.renderer.addToUI(this.cardGroup);
        this.cardGroup.x = resolution.x - 100;
        this.cardGroup.y = 25;
        this.setNumberOfPieces(0);
    }
    
    setNumberOfPieces(_number)
    {
        this.cardGroup.removeAll(true);
        this.baseSprite = this.cardGroup.create(0, 0, "piecesUI0");
        
        if (_number > 7)
        {
            console.error("CardPieceUI can only display up to 7 pieces")
            _number = 7;
        }
        
        this.currentPieceNumber = _number;
        
        for(var i = 1; i <= _number; i++)
        {
            this.baseSprite = this.cardGroup.create(0, 0, "piecesUI" + i);
        }
    }
    
    addPiece()
    {
        this.setNumberOfPieces(this.currentPieceNumber + 1);
    }
}