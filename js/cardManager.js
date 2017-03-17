class CardManager
{
    constructor(_game)
    {
        this.game = _game;
    }
    
    static preload(_game)
    {
        _game.load.image('cardBack', './img/card/back.png');
        CardManager.addNewCard(SmMedkitCard);
        CardManager.addNewCard(WoodShieldCard);
        CardManager.addNewCard(SmEnergyCard);
        CardManager.addNewCard(MedEnergyCard);
        CardManager.addNewCard(BigEnergyCard);
        CardManager.addNewCard(NewEnemyCard);
        CardManager.addNewCard(StrongerEnemyCard);
        CardManager.addNewCard(NewObstacleCard);
        CardManager.addNewCard(MoreObstaclesCard);
        CardManager.addNewCard(TwoEnemiesCard);
        CardManager.addNewCard(ThreeEnemiesCard);
        
        for(var ind in CardManager.existingCards)
        {
            CardManager.existingCards[ind].preload(_game);
        }
    };
    
    static addNewCard(cardClass)
    {
        CardManager.existingCards[cardClass.ID] = new cardClass();
    }
    
    getCardImage(_card)
    {
        var img = CardManager.drawnCards[_card.getID()];
        if(!img)
        {
            img = _card.buildImage(this.game);
            CardManager.drawnCards[_card.getID()] = img;
        }
        return img;
    }
    
    getCardNames()
    {
        return Object.keys(CardManager.existingCards);
    }
}

CardManager.existingCards = {}
CardManager.drawnCards = {}