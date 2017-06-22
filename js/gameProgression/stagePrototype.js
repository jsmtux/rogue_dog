class PrototypeRules
{
    constructor()
    {
        this.rules = [];
        this.computedValues;
    }
    
    setRuleProbability(_piece, _probability)
    {
        this.rules.push({"piece":_piece, "probability": _probability});
    }
    
    getRuleForValue(_value)
    {
        var accum = 0;
        var curRule = GrassStagePiece;
        for (var ind in this.rules)
        {
            accum += this.rules[ind].probability;
            if (accum >= _value)
            {
                curRule = this.rules[ind].piece;
                break;
            }
        }
        return curRule;
    }
}

class StageCell {
    constructor(_obstacle, _item, _walkLevels = [0])
    {
        this.obstacle = _obstacle;
        this.item = _item;
        this.walkLevels = _walkLevels;
    }
    
    clone()
    {
        return new StageCell(this.obstacle, this.item, this.walkLevels);
    }
}

class GrassStageCell extends StageCell {
    constructor()
    {
        super();
    }
}

class HoleStageCell extends StageCell {
    constructor()
    {
        super(undefined, undefined, []);
    }
}

class TutorialObstacleStageCell extends StageCell {
    constructor()
    {
        super(EnemyObstacle, undefined, []);
    }
}

class ObstacleStageCell extends StageCell {
    constructor()
    {
        super(Obstacle);
    }
}

class TallObstacleStageCell extends StageCell {
    constructor()
    {
        super(TallObstacle);
    }
}

class PlatformStageCell extends StageCell {
    constructor()
    {
        super(undefined, undefined, [0, -170]);
    }
}

class CardPieceStageCell extends StageCell {
    constructor()
    {
        super(undefined, CardPiece);
    }
}

class StickStageCell extends StageCell {
    constructor()
    {
        super(undefined, Stick);
    }
}

class StagePiece {
    constructor(_cellList, _emptyFollowing = 0, _obstacleNumber = 0)
    {
        this.cellList = _cellList;
        for (var i = 0; i < _emptyFollowing; i++)
        {
            this.cellList.push(new GrassStageCell());
        }
        
        this.obstacleNumber = _obstacleNumber;
    }
}

class GrassStagePiece extends StagePiece {
    constructor()
    {
        super([], 1);
    }
}

class HoleStagePiece extends StagePiece {
    constructor()
    {
        super([new HoleStageCell(), new HoleStageCell(), new HoleStageCell(), new HoleStageCell()], 4);
    }
}

class HoleObstacleStagePiece extends StagePiece {
    constructor()
    {
        super([new HoleStageCell(), new HoleStageCell(), new StageCell(CeilingObstacle, undefined, [-600]), new HoleStageCell(), new HoleStageCell()], 4);
    }
}

class ObstacleStagePiece extends StagePiece {
    constructor()
    {
        super([new ObstacleStageCell()], 6, 1);
    }
}

class DoubleObstacleStagePiece extends StagePiece {
    constructor()
    {
        super([new ObstacleStageCell(), new ObstacleStageCell()], 7, 2);
    }
}

class TripleObstacleStagePiece extends StagePiece {
    constructor()
    {
        super([new ObstacleStageCell(), new ObstacleStageCell(), new ObstacleStageCell()], 8, 3);
    }
}

class TallObstacleStagePiece extends StagePiece {
    constructor()
    {
        super([new TallObstacleStageCell()], 4, 1);
    }
}

class TutorialObstacleStagePiece extends StagePiece {
    constructor()
    {
        super([new TutorialObstacleStageCell()], 6, 1);
    }
}

class PlatformStagePiece extends StagePiece {
    constructor()
    {
        super([new PlatformStageCell(), new PlatformStageCell(), new PlatformStageCell()], 4);
    }
}

class Bonus1StagePiece extends StagePiece {
    constructor()
    {
        var itemPosition = randomInt(1,5);
        var list = [new ObstacleStageCell()];
        for(var i = 0; i < 6; i++)
        {
            if (itemPosition == i)
            {
                list.push(new StickStageCell())
            }
            else
            {
                list.push(new GrassStageCell());
            }
        }
        super(list, 0, 1);
    }
}

class StagePrototype
{
    constructor (_prototypeRules, _numberObstacles)
    {
        this.obstaclesPlaced = 0;

        this.itemsToPlaceQueue = [];
        
        this.obstacleNumber = _numberObstacles;
        this.rules = _prototypeRules;
    }
    
    getNextCell()
    {
        var ret = [];
        
        if (!this.rules)
        {
            return GrassStageCell;
        }
        
        if (this.itemsToPlaceQueue.length > 0)
        {
            ret = this.itemsToPlaceQueue.shift();
        }
        else
        {
            var pieceType = this.rules.getRuleForValue(Math.random());
            var piece = new pieceType();
            this.obstaclesPlaced += piece.obstacleNumber;
            ret = piece.cellList.shift();
            this.itemsToPlaceQueue = piece.cellList;
        }
        
        return ret;
    }
    
    isStageFinished()
    {
        return this.obstacleNumber !== undefined && this.obstaclesPlaced >= this.obstacleNumber && this.itemsToPlaceQueue.length == 0;
    }
}
