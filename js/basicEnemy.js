function BasicEnemy(_game, _index)
{
    this.game = _game;
    this.state = BasicEnemy.States.WAITING;
    this.health = 10;
    this.index = _index;
    this.padding = 220;
    this.dying = false;
}

BasicEnemy.States = {
    WAITING : 0,
    ATTACKING : 1,
    FINISHED: 2
}

BasicEnemy.preload = function(_game)
{
    _game.load.spritesheet('monster', './img/monster.png', 205, 200);
    _game.load.spritesheet('hit', './img/hit.png');
    _game.load.image('up', './img/arrowUp.png');
    _game.load.image('down', './img/arrowDown.png');
    _game.load.image('left', './img/arrowLeft.png');
    _game.load.image('right', './img/arrowRight.png');
    _game.load.image('good', './img/checkmark.png');
    _game.load.image('bad', './img/cross.png');
    this.sprite;
}

BasicEnemy.prototype.create = function()
{
    this.sprite = this.game.add.sprite(resolution.x + 20 + this.padding * this.index, 320, 'monster', 10);
    this.sprite.animations.add('walk');
    this.sprite.animations.add('idle', [0]);
    
    ServiceLocator.infoManager.register("BasicEnemy", this.sprite);
    
    if (BasicEnemy.attackOptions == undefined)
    {
        BasicEnemy.attackOptions = [
                {image: 'up', key: ServiceLocator.inputManager.up},
                {image: 'left', key: ServiceLocator.inputManager.left},
                {image: 'right', key: ServiceLocator.inputManager.right},
                {image: 'down', key: ServiceLocator.inputManager.down}
            ];
    }
}

BasicEnemy.prototype.update = function()
{
    if (!this.inPlace())
    {
        this.sprite.play('walk', 10, true);
        this.sprite.x -= 1.5;
    }
    else
    {
        this.sprite.play('idle');
    }
}

BasicEnemy.prototype.inPlace = function()
{
    return this.sprite.x < (300 + this.padding * this.index);
}

BasicEnemy.prototype.takeHit = function()
{
    var posX = this.sprite.x;
    var posY = this.sprite.y;
    this.hit = game.add.sprite(posX, posY, 'hit');
    var self = this;
    setTimeout(function() {self.hit.destroy();}, 500);
    this.health -= 5;
    if (this.health <= 0)
    {
        ServiceLocator.combatManager.killEnemy(this.index);
        ServiceLocator.infoManager.unregister(this.sprite);
    }
}

BasicEnemy.prototype.updateDeath = function()
{
    this.sprite.alpha -= 0.02;
    if (this.sprite.alpha <= 0)
    {
        this.sprite.destroy();
        return true;
    }
    
    return false;
}

BasicEnemy.prototype.startAttack = function(_player)
{
    console.log("Starting attack");
    this.attackOption = BasicEnemy.attackOptions[randomInt(0,3)];
    this.state = BasicEnemy.States.ATTACKING;
    this.arrow;
    var initTimeout = 500 + Math.random() * 2000;
    var self = this;
    setTimeout(function(){
        self.attackOption.key.onDown.add(self.keyHandler, self);
        self.arrow = self.game.add.sprite(self.sprite.x, self.sprite.y - 50, self.attackOption.image);
        ServiceLocator.inputManager.directionGesture.add(self.directionGestureCb, self);
    }, initTimeout)
    this.endTimeout = setTimeout(function(){
        self.showResultSprite('bad');
        _player.monsterHit();
    }, initTimeout + ServiceLocator.difficultyManager.getBasicEnemyTimeout());
}

BasicEnemy.prototype.keyHandler = function()
{
    this.showResultSprite('good');
}

BasicEnemy.prototype.directionGestureCb = function(_direction)
{
    console.log(_direction);
    if (this.attackOption.image === _direction)
    {
        clearTimeout(this.endTimeout);
        this.showResultSprite('good');        
    }
}

BasicEnemy.prototype.showResultSprite = function(_result)
{
    clearTimeout(this.endTimeout);
    ServiceLocator.inputManager.directionGesture.remove();
    this.arrow.destroy();
    this.attackOption.key.onDown.remove(this.keyHandler, this);
    var resultSprite = this.game.add.sprite(this.sprite.x, this.sprite.y - 50, _result);
    var self = this;
    setTimeout(function(){
        resultSprite.destroy();
        self.state = BasicEnemy.States.FINISHED;
    }, 500);
}

function BeeEnemy(_game, _index)
{
    BasicEnemy.prototype.constructor.call(this, _game, _index);
    this.health = 5;
    this.height = 320;
    this.moveRadius = 10;
    this.rotationCounter = 0;
    this.game = _game;
}

BeeEnemy.prototype = new BasicEnemy();
BeeEnemy.prototype.constructor = BeeEnemy;

BeeEnemy.preload = function(_game)
{
    _game.load.spritesheet('bee', './img/monster2.png', 205, 155);
    BeeBullet.Preload(_game);
    this.sprite;
}

BeeEnemy.prototype.create = function()
{
    this.sprite = this.game.add.sprite(resolution.x + 20 + this.padding * this.index, this.height, 'bee', 5);
    this.sprite.animations.add('walk');
    
    ServiceLocator.infoManager.register("BeeEnemy", this.sprite);
}

BeeEnemy.prototype.update = function()
{
    if (this.bullet)
    {
        this.bullet.update();
        var inside = false;
        if (this.polygonPoints)
        {
            var bulletWidth = this.bullet.sprite.width;
            var bulletHeight = this.bullet.sprite.height;
            //Check different hit points
            inside = this.polygonPoints.contains(this.bullet.sprite.x, this.bullet.sprite.y);
            inside |= this.polygonPoints.contains(this.bullet.sprite.x + bulletWidth/2, this.bullet.sprite.y + bulletHeight/2);
            inside |= this.polygonPoints.contains(this.bullet.sprite.x + bulletWidth, this.bullet.sprite.y + bulletHeight);
            //
            this.polygonPoints = undefined;
        }
        if (inside || this.bullet.isFinished())
        {
            this.state = BasicEnemy.States.FINISHED;
            ServiceLocator.inputManager.drawGesture.remove(this.receivePolygonPoints, this);
            this.bullet.destroy();
            this.bullet = undefined;
        }
    }

    if (!this.inPlace())
    {
        this.sprite.play('walk', 10, true);
        this.sprite.x -= 1.5;
    }

    this.sprite.y = this.height + Math.sin(this.rotationCounter++ / 10.0) * this.moveRadius;
}

BeeEnemy.prototype.receivePolygonPoints = function(_points)
{
    this.polygonPoints = _points;
}

BeeEnemy.prototype.startAttack = function(_player)
{
    this.difficultyManager = _difficultyManager;
    if (!this.bullet)
    {
        ServiceLocator.inputManager.drawGesture.add(this.receivePolygonPoints, this);
        this.bullet = new BeeBullet(this.game, _player, ServiceLocator.difficultyManager.getBeeBulletSpeed());
        this.bullet.create(this.sprite.x, this.sprite.y);
    }
}

function BeeBullet(_game, _player, _speed)
{
    this.sprite;
    this.game = _game;
    this.player = _player;
    this.speed = _speed;
}

BeeBullet.Preload = function(_game)
{
    _game.load.image('beeBullet', './img/beeBullet.png');
    _game.load.spritesheet('beeBulletExplosion', './img/bullet_explosion.png', 77, 73);
}

BeeBullet.prototype.create = function(_x, _y)
{
    this.sprite = this.game.add.sprite(_x, _y + 90, 'beeBullet', 5);
}

BeeBullet.prototype.update = function()
{
    this.sprite.x -= this.speed;
}

BeeBullet.prototype.isFinished = function()
{
    var finished = this.sprite.x < this.player.getFeetArea()[1];
    if (finished)
    {
        this.player.monsterHit();
    }
    return finished;
}

BeeBullet.prototype.destroy = function()
{
    var explosion = this.game.add.sprite(this.sprite.x, this.sprite.y, 'beeBulletExplosion');
    var explodingAnimation = explosion.animations.add('explode');
    explosion.play('explode', 10);
    explodingAnimation.onComplete.add(function () {explosion.destroy();});
    this.sprite.destroy();
    
}

function BasicTrainer(_game, _index)
{
    BasicEnemy.prototype.constructor.call(this, _game, _index);
    this.health = 10;
    this.game = _game;
    this.height = 420;
    this.padding = 270;
}

BasicTrainer.prototype = new BasicEnemy();
BasicTrainer.prototype.constructor = BasicTrainer;

BasicTrainer.preload = function(_game)
{
    var path = "anim/"
    _game.load.atlas("trainerAnimAtlas", path + "trainer.png", path + "trainer.json");
    _game.load.json("trainerJSON", path + "trainer.scon");
}

BasicTrainer.prototype.create = function()
{
    this.sprite = loadSpriter(this.game, "trainerJSON", "trainerAnimAtlas", "entity_000");
    this.sprite.position.setTo(140, this.playerInitialY);
    this.sprite.scale.set(0.4, 0.4);
    this.sprite.x = resolution.x + 20 + this.padding * this.index;
    this.sprite.y = this.height;
    this.game.world.add(this.sprite);
    
    
    ServiceLocator.infoManager.register("MazeEnemy", this.sprite);
}

BasicTrainer.prototype.update = function()
{
    if (!this.inPlace())
    {
        //this.sprite.play('walk', 10, true);
        this.sprite.x -= 1.5;
    }
}

BasicTrainer.prototype.startAttack = function(_player)
{
    
}
