class CardManager
{
    constructor(_game)
    {
        this.game = _game;
        this.remainingCards = {};
    }
    
    static preload(_game)
    {
        _game.load.image('cardBack', './img/card/back.png');
        CardManager.addNewCard(SmMedkitCard);
        CardManager.addNewCard(NewEnemyCard);
        CardManager.addNewCard(StrongerBasicEnemyCard);
        CardManager.addNewCard(StrongerBeeEnemyCard);
        CardManager.addNewCard(NewObstacleCard);
        CardManager.addNewCard(MoreObstaclesCard);
        CardManager.addNewCard(TwoEnemiesCard);
        CardManager.addNewCard(ThreeEnemiesCard);
        CardManager.addNewCard(MagicianHatCard);
        
        for(var ind in CardManager.cardDefinitions)
        {
            CardManager.cardDefinitions[ind].instance.preload(_game);
        }
    };
    
    static addNewCard(_cardClass)
    {
        var newCardDefinition = {
            "class": _cardClass,
            "instance": new _cardClass(),
            "renderedImage":undefined,
            "numberInDeck":undefined
        };
        CardManager.cardDefinitions[_cardClass.ID] = newCardDefinition;        
    }
    
    setDeckNumbers(_deckNumbers, resetRemaining = true)
    {
        for(var ind in CardManager.cardDefinitions)
        {
            CardManager.cardDefinitions[ind].numberInDeck = 0;
        }
        
        for(var ind in _deckNumbers)
        {
            CardManager.cardDefinitions[ind].numberInDeck = _deckNumbers[ind];
        }
        
        if (resetRemaining)
        {
            for(var ind in CardManager.cardDefinitions)
            {
                this.remainingCards[ind] = CardManager.cardDefinitions[ind].numberInDeck;
            }
        }
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
    
    stillInDeck(_cardName)
    {
        var numberRemaining = this.remainingCards[_cardName];
        return numberRemaining === undefined || numberRemaining > 0;
    }
    
    drawCard(_cardName)
    {
        if (this.remainingCards[_cardName] !== undefined)
        {
            this.remainingCards[_cardName] --;
            if (this.remainingCards[_cardName] < 0)
            {
                this.remainingCards[_cardName] = 0;
                console.error("Drawn too many cards of type " + _cardName);
            }
        }
    }
    
    restoreCardsToDeck(_cardList)
    {
        for(var ind in _cardList)
        {
            this.remainingCards[_cardList[ind].ID] ++;
        }
    }
}

CardManager.cardDefinitions = {}