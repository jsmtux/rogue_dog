class CardManager
{
    constructor(_game)
    {
        this.game = _game;
        this.remainingCards = {};
        
        for(var ind in CardManager.cardDefinitions)
        {
            CardManager.cardDefinitions[ind].class.preload(_game);
            this.remainingCards[ind] = CardManager.cardDefinitions[ind].numberInDeck;
        }
    }
    
    static preload(_game)
    {
        _game.load.image('cardBack', './img/card/back.png');
        CardManager.addNewCard(SmMedkitCard);
        CardManager.addNewCard(SmEnergyCard);
        CardManager.addNewCard(MedEnergyCard);
        CardManager.addNewCard(BigEnergyCard);
        CardManager.addNewCard(NewEnemyCard, 2);
        CardManager.addNewCard(StrongerEnemyCard, 2);
        CardManager.addNewCard(NewObstacleCard, 0);
        CardManager.addNewCard(MoreObstaclesCard);
        CardManager.addNewCard(TwoEnemiesCard, 1);
        CardManager.addNewCard(ThreeEnemiesCard, 1);
        
        for(var ind in CardManager.cardDefinitions)
        {
            CardManager.cardDefinitions[ind].class.preload(_game);
        }
    };
    
    static addNewCard(_cardClass, _numberInDeck)
    {
        var newCardDefinition = {
            "class": new _cardClass(),
            "renderedImage":undefined,
            "numberInDeck":_numberInDeck
        };
        CardManager.cardDefinitions[_cardClass.ID] = newCardDefinition;        
    }
    
    getCardClassFromID(_id)
    {
        return CardManager.cardDefinitions[_id].class;
    }
    
    getCardImage(_card)
    {
        var img = CardManager.cardDefinitions[_card.getID()].renderedImage;
        if(!img)
        {
            img = _card.buildImage(this.game);
            CardManager.cardDefinitions[_card.getID()].renderedImage = img;
        }
        return img;
    }
    
    getCardNames()
    {
        return Object.keys(CardManager.cardDefinitions);
    }
    
    stillInDeck(_card)
    {
        var numberRemaining = this.remainingCards[_card.getID()];
        return numberRemaining === undefined || numberRemaining > 0;
    }
    
    drawCard(_card)
    {
        if (this.remainingCards[_card.getID()] !== undefined)
        {
            this.remainingCards[_card.getID()] --;
            if (this.remainingCards[_card.getID()] < 0)
            {
                this.remainingCards[_card.getID()] = 0;
                console.error("Drawn too many cards of type " + _card.getID());
            }
        }
    }
}

CardManager.cardDefinitions = {}