class Enemy extends GameObject
{
    constructor(_game, _spec, _index)
    {
        super();
        this.game = _game;
        this.dead = false;
        this.player = _game.player;
        this.health = _spec.health;
        
        this.cardProbabilities = _spec.cardProbabilities;
        
        this.index = _index;
        this.state = Enemy.States.WAITING;
        
        this.endPos = undefined;
        
        this.position = new Phaser.Point(0, 0);
        this.spriteOffset = new Phaser.Point(0, 0);
        
        this.crosshair;
    }
    
    static preload(_game)
    {
        _game.load.image('hit', './img/hit.png');
        _game.load.image('hit_miss', './img/hit_miss.png');
        _game.load.image('hit_critical', './img/hit_critical.png');
        
        CircleSelector.preload(_game);
        Crosshair.preload(_game);
        EscapeMeter.preload(_game);
    }
    
    setSprite(_sprite)
    {
        ServiceLocator.renderer.addToScene(_sprite);
        GameObject.prototype.create.call(this, _sprite, true);
    }
    
    setWalkPath(_initX, _endX)
    {
        this.position.x = _initX;
        this.endPos = _endX;
    }
    
    inPlace()
    {
        var ret = false;
        if (this.endPos !== undefined)
        {
            ret = this.position.x < this.endPos;
        }
        return ret;
    }

    takeHit(_combatManager, _skillCheck, _hitPoints)
    {
        if (_skillCheck != Enemy.AttackOutcome.MISS)
        {
            ServiceLocator.camera.shake(0.02, 200);
            this.health -= _hitPoints;
            if (_skillCheck == Enemy.AttackOutcome.CRITICAL)
            {
                this.health -= _hitPoints * 1.5;
            }
            if (this.health <= 0)
            {
                ServiceLocator.combatManager.killEnemy(this.index);
                this.startDeath();
            }
        }
        
        switch(_skillCheck)
        {
            case Enemy.AttackOutcome.MISS:
                this.hit = this.game.add.sprite(this.position.x, this.position.y, 'hit_miss');
                break;
            case Enemy.AttackOutcome.HIT:
                this.hit = this.game.add.sprite(this.position.x, this.position.y, 'hit');
                break;
            case Enemy.AttackOutcome.CRITICAL:
                this.hit = this.game.add.sprite(this.position.x, this.position.y, 'hit_critical');
                break;
        }
        ServiceLocator.renderer.addToOverlay(this.hit);
        setTimeout(() => {this.hit.destroy();}, 500);
        this.hit.anchor.x = 0.5;
        this.hit.anchor.y = 0.5;
        
        this.hit.scale.x = 0.5;
        this.hit.scale.y = 0.5;
        this.hit.alpha = 0.0;
        this.game.add.tween(this.hit).to({ alpha: 1.0 }, 500, Phaser.Easing.Cubic.Out, true);
        this.game.add.tween(this.hit.scale).to({ x: 1.0, y: 1.0}, 500, Phaser.Easing.Elastic.Out, true);
    }
    
    isDead()
    {
        return this.dead;
    }
    
    getDroppedCards()
    {
        return ServiceLocator.cardManager.lootDeck.getRandomCard();
    }
    
    startAttack(_player)
    {
        console.error("Trying to start undefined attack");
    }
    
    hideCrosshair()
    {
        if(this.crosshair)
        {
            this.crosshair.destroy();
            this.crosshair = undefined;
        }
    }
    
    getName()
    {
        return this.constructor.NAME;
    }
    
    update()
    {
        this.sprite.x = this.position.x + this.spriteOffset.x;
        this.sprite.y = this.position.y + this.spriteOffset.y;
        
        if (this.crosshair)
        {
            this.crosshair.updatePosition(new Phaser.Point(this.sprite.x, this.sprite.y));
        }
    }
}

Enemy.States = {
    WAITING : 0,
    ATTACKING : 1,
    FINISHED: 2
}

Enemy.AttackOutcome = {
    MISS: 0,
    HIT: 1,
    CRITICAL: 2
}

class CircleSelector
{
    constructor(_game, _enemy, _position, _offset, _bgSprite)
    {
        this.game = _game;
        this.enemy = _enemy;
        this.sprite = this.game.add.sprite(0, 0, 'crosshair');
        this.sprite_bg = _bgSprite;
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite_bg.anchor.x = 0.5;
        this.sprite_bg.anchor.y = 0.5;
        ServiceLocator.renderer.addToOverlay(this.sprite_bg);
        ServiceLocator.renderer.addToOverlay(this.sprite);
        this.offset = _offset;

        this.sprite.inputEnabled = true;
        this.updatePosition(_position);
    }
    
    static preload(_game)
    {
        _game.load.image('crosshair', './img/circle_skill_selector.png');
    }
    
    destroy()
    {
        this.sprite.destroy();
        this.sprite_bg.destroy();
    }
    
    updatePosition(_position)
    {
        this.sprite.x = _position.x + this.offset.x;
        this.sprite.y = _position.y + this.offset.y;
        this.sprite_bg.x = _position.x + this.offset.x;
        this.sprite_bg.y = _position.y + this.offset.y;
    }
}

class Crosshair extends CircleSelector
{
    constructor(_game, _enemy, _position, _offset)
    {
        super(_game, _enemy, _position, _offset, _game.add.sprite(0, 0, 'crosshair_bg'));
        this.sprite.events.onInputDown.add(this.sendSignal, this);
        this.movement = 0;
    }
    
    static preload(_game)
    {
        _game.load.image('crosshair_bg', './img/circle_skill_bg.png');
    }
    
    updatePosition(_position)
    {
        super.updatePosition(_position)
        
        this.movement += 0.1;
        this.sprite.angle = Math.sin(this.movement) * 68;
    }
    
    sendSignal()
    {
        var hitType = Enemy.AttackOutcome.MISS;
        if (Math.abs(this.sprite.angle) <= 35)
        {
            hitType = Enemy.AttackOutcome.HIT;
        }
        if (Math.abs(this.sprite.angle) <= 6)
        {
            hitType = Enemy.AttackOutcome.CRITICAL;
        }
        
        ServiceLocator.publish(new EnemyTargeted(this.enemy, hitType));
    }
}

class EscapeMeter extends CircleSelector
{
    constructor(_game, _enemy, _position, _offset)
    {
        super(_game, _enemy, _position, _offset, _game.add.sprite(0, 0, 'escape_bg'));
        this.sprite.events.onInputDown.add(this.handleTap, this);
        
        this.escapeMeter = 0;
    }
    
    static preload(_game)
    {
        _game.load.image('escape_bg', './img/circle_escape_bg.png');
    }
    
    updatePosition(_position)
    {
        super.updatePosition(_position)
        
        this.sprite.angle = this.escapeMeter * 136 - 68;
        if (this.escapeMeter > 0)
        {
            this.escapeMeter -= 0.003;
        }
    }
    
    handleTap()
    {
        if (this.escapeMeter < 1.0)
        this.escapeMeter += 0.1;
    }
    
    getSuccess()
    {
        return this.escapeMeter > 0.9;
    }
}