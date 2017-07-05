class CardManager
{
    constructor(_game)
    {
        this.game = _game;
        this.lootDeck = new CardDeck(this);
        this.wildDeck = new CardDeck(this);
    }
    
    static preload(_game)
    {
        _game.load.image('cardBack', './img/card/back.png');
        CardManager.addNewCard(SmMedkitCard);
        CardManager.addNewCard(StrongerBasicEnemyCard,2);
        CardManager.addNewCard(StrongerBeeEnemyCard,2);
        CardManager.addNewCard(NewObstacleCard,2);
        CardManager.addNewCard(MoreObstaclesCard);
        CardManager.addNewCard(TwoEnemiesCard,1);
        CardManager.addNewCard(ThreeEnemiesCard,1);
        CardManager.addNewCard(MagicianHatCard);
        CardManager.addNewCard(BasicEnemyCard,1);
        CardManager.addNewCard(BeeEnemyCard,1);
        CardManager.addNewCard(OneStickCard);
        
        for(var ind in CardManager.cardDefinitions)
        {
            var instance = new CardManager.cardDefinitions[ind].class();
            instance.preload(_game);
        }
    };
    
    static addNewCard(_cardClass, _maxCopies)
    {
        var newCardDefinition = {
            "class": _cardClass,
            "renderedImage":undefined,
            "maxCopies":_maxCopies
        };
        CardManager.cardDefinitions[_cardClass.ID] = newCardDefinition;        
    }
    
    getCardClassFromID(_id)
    {
        return CardManager.cardDefinitions[_id].class;
    }
    
    getMaxCardNumberFromID(_id)
    {
        return CardManager.cardDefinitions[_id].maxCopies;
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
}

CardManager.cardDefinitions = {}

class CardDeck
{
    constructor(_cardManager)
    {
        this.remainingCards = {};
        this.addedCards = {};
        this.cardManager = _cardManager;
    }
    
    addCards(_deckNumbers)
    {
        for(var ind in _deckNumbers)
        {
            var cardNumber = _deckNumbers[ind];
            if (!(ind in this.addedCards))
            {
                this.addedCards[ind] = 0;
            }
            else
            {
                var maxDeckRemaining = this.cardManager.getMaxCardNumberFromID(ind) - this.addedCards[ind];
                if (maxDeckRemaining < cardNumber)
                {
                    cardNumber = maxDeckRemaining;
                }
            }

            if (!(ind in this.remainingCards))
            {
                this.remainingCards[ind] = 0;
            }
            if (_deckNumbers[ind] === undefined)
            {
                this.remainingCards[ind] = undefined;
            }
            else
            {
                this.remainingCards[ind] += _deckNumbers[ind];
                this.addedCards[ind] += _deckNumbers[ind];
            }
        }
    }
    
    stillInDeck(_cardName)
    {
        return _cardName in this.remainingCards;
    }
    
    removeOneCard(_cardName)
    {
        if (_cardName in this.remainingCards)
        {
            if(this.remainingCards[_cardName] === undefined)
            {
                return;
            }
            this.remainingCards[_cardName] --;
            if (this.remainingCards[_cardName] <= 0)
            {
                delete this.remainingCards[_cardName];
            }
        }
        else
        {
            console.error("Drawn too many cards of type " + _cardName);
        }
    }
    
    getRandomCard()
    {
        var totalCards = Object.keys(this.remainingCards).length;
        if (totalCards === 0)
        {
            console.error("Deck is empty, cannot draw random card");
            return undefined;
        }
        var ind = randomInt(0, totalCards - 1);
        var name = Object.keys(this.remainingCards)[ind];
        this.removeOneCard(name);
        return this.cardManager.getCardClassFromID(name);
    }
    
    restoreCardsToDeck(_cardList)
    {
        for(var ind in _cardList)
        {
            this.remainingCards[_cardList[ind].ID] ++;
        }
    }
}