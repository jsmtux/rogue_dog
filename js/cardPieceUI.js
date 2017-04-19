class CardPieceUI
{
    constructor()
    {
        this.currentPieceNumber = 0;
        this.cardGroup;
        this.maxPieces = 7;
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
        this.game = _game;
    }
    
    setNumberOfPieces(_number)
    {
        if (_number < this.currentPieceNumber)
        {
            this.cardGroup.removeAll(true);
        }
        
        if (this.baseSprite === undefined && _number > 0)
        {
            this.baseSprite = this.cardGroup.create(0, 0, "piecesUI0");
        }
        
        if (_number > this.maxPieces)
        {
            console.error("CardPieceUI can only display up to 7 pieces")
            _number = this.maxPieces;
        }
        
        this.currentPieceNumber = _number;
        
        for(var i = 1; i <= _number; i++)
        {
            var newPiece = this.cardGroup.create(0, 0, "piecesUI" + i);
            if (i == _number)
            {
                this.game.updateSignal.addOnce(() => {this.updateAddedPiece(newPiece, 2.0)}, this);
            }
        }
    }
    
    updateAddedPiece(_piece, _currentScale)
    {
        _piece.scale.setTo(_currentScale, _currentScale);
        if (_currentScale > 1.0)
        {
            this.game.updateSignal.addOnce(() => {this.updateAddedPiece(_piece, _currentScale - 0.05)}, this);
        }
    }
    
    addPiece()
    {
        this.setNumberOfPieces(this.currentPieceNumber + 1);
        if (this.currentPieceNumber === this.maxPieces)
        {
            ServiceLocator.publish(new GearCardCompletedMessage());
        }
    }
}