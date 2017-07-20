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
        CardManager.addNewCard(TwoEnemiesCard,1);
        CardManager.addNewCard(ThreeEnemiesCard,1);
        CardManager.addNewCard(MagicianHatCard);
        CardManager.addNewCard(BasicEnemyCard,1);
        CardManager.addNewCard(BeeEnemyCard,1);
        CardManager.addNewCard(OneStickCard);
        CardManager.addNewCard(ThreeSticksCard);
        
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
        this.cards = {};
        this.cardManager = _cardManager;
    }
    
    addCard(_name, _numberOfCopies, _probability = CardDeck.cardProbability.LOW)
    {
        if (!(_name in this.cards))
        {
            this.cards[_name] = {
                "copiesLeft":0,
                "probability":_probability,
                "totalCopiesAdded":0
            };
        }

        var copiesInGame = this.cardManager.getMaxCardNumberFromID(_name) - this.cards[_name].totalCopiesAdded;
        if (copiesInGame < _numberOfCopies)
        {
            _numberOfCopies = copiesInGame;
        }

        if (_numberOfCopies === undefined)
        {
            this.cards[_name].copiesLeft = undefined;
            this.cards[_name].totalCopiesAdded = undefined;
        }
        else
        {
            this.cards[_name].copiesLeft += _numberOfCopies;
            this.cards[_name].totalCopiesAdded += _numberOfCopies;
        }
    }
    
    stillInDeck(_cardName)
    {
        return this.cards[_cardName] && (this.cards[_cardName].copiesLeft > 0 || this.cards[_cardName].copiesLeft === undefined);
    }
    
    removeOneCard(_cardName)
    {
        if (_cardName in this.cards)
        {
            if(this.cards[_cardName].copiesLeft === undefined)
            {
                return;
            }
            if (this.cards[_cardName].copiesLeft > 0)
            {
                this.cards[_cardName].copiesLeft --;
                return;
            }
        }
        
        console.error("Drawn too many cards of type " + _cardName);
    }
    
    getRandomCard(removeFromDeck = true)
    {        
        var totalProbability = 0;
        var cardPosition = {};
        for (var cardName in this.cards)
        {
            if (this.stillInDeck(cardName))
            {
                var probabilities = this.cards[cardName].probability;
                totalProbability += probabilities;
                cardPosition[totalProbability] = cardName;
            }
        }
        
        var roll = randomInt(1, totalProbability);
        
        var cardName;
        for (var ind in cardPosition)
        {
            ind = parseInt(ind);
            if (ind >= roll)
            {
                cardName = cardPosition[ind];
                if (removeFromDeck)
                {
                    this.removeOneCard(cardName);
                }
                break;
            }
        }
        
        var ret;
        if (cardName)
        {
            ret = this.cardManager.getCardClassFromID(cardName);
        }
        return ret;
    }
    
    restoreCardsToDeck(_cardList)
    {
        for(var ind in _cardList)
        {
            this.cards[_cardList[ind].ID].copiesLeft ++;
        }
    }
}

CardDeck.cardProbability = {
    LOW: 1,
    MED: 3,
    HIGH: 9,
    VERY_HIGH: 20
}