
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