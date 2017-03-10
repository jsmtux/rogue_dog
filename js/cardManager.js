class CardManager
{
    static preload(_game)
    {
        CardManager.addNewCard(SmMedkitCard);
        CardManager.addNewCard(WoodShieldCard);
        
        for(var ind in CardManager.existingCards)
        {
            CardManager.existingCards[ind].preload(_game);
        }
    }
    
    static addNewCard(cardClass)
    {
        CardManager.existingCards[cardClass.ID] = new cardClass();
    }
    
    getCard(_class)
    {
        return CardManager.existingCards[_class.ID];
    }
    
    getCardNames()
    {
        return Object.keys(CardManager.existingCards);
    }
    
    startLootChoose(_cardList, _cb, _cbCtxt)
    {
        var self = this;
        for (var ind in _cardList)
        {
            var curCard = this.getCard(_cardList[ind]);
            curCard.show();
            curCard.setPosition(new Phaser.Point(50 + 300 * ind,50));
            curCard.setHandler(function(_curCard){return function(){self.finishLootChoose(_cardList, _curCard, _cb, _cbCtxt);}}(curCard));
        }
    }
    
    finishLootChoose(_cardList, _card, _cb, _cbCtxt)
    {
        _card.apply();
        for (var ind in _cardList)
        {
            var curCard = this.getCard(_cardList[ind]);
            curCard.hide();
        }
        _cb.call(_cbCtxt);
    }
}

CardManager.existingCards = {}