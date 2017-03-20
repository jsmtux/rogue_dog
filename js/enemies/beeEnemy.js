
class BeeEnemy extends Enemy
{
    constructor(_game, _index)
    {
        super(_game, _index, 5);

        this.height = 320;
        this.moveRadius = 10;
        this.rotationCounter = 0;
    }

    static preload(_game)
    {
        _game.load.spritesheet('bee', './img/monster2.png', 205, 155);
        BeeBullet.Preload(_game);
        this.sprite;
    }
    
    create()
    {
        this.setSprite(this.game.add.sprite(0, this.height, 'bee', 5));
        this.sprite.animations.add('walk');
        
        ServiceLocator.infoManager.register("BeeEnemy", this.sprite);
    }
    
    update()
    {
        if (this.bullet)
        {
            this.bullet.update();
            var inside = false;
            if (this.polygonPoints)
            {
                var camPos = ServiceLocator.camera.getPosition();
                var relativeBulletPosition = new Phaser.Point(this.bullet.sprite.x, this.bullet.sprite.y).subtract(camPos.x, camPos.y);
                var bulletWidth = this.bullet.sprite.width;
                var bulletHeight = this.bullet.sprite.height;
                //Check different hit points
                inside = this.polygonPoints.contains(relativeBulletPosition.x, relativeBulletPosition.y);
                inside |= this.polygonPoints.contains(relativeBulletPosition.x + bulletWidth/2, relativeBulletPosition.y + bulletHeight/2);
                inside |= this.polygonPoints.contains(relativeBulletPosition.x + bulletWidth, relativeBulletPosition.y + bulletHeight);
                //
                this.polygonPoints = undefined;
            }
            if (inside || this.bullet.isFinished())
            {
                this.state = Enemy.States.FINISHED;
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
    
    receivePolygonPoints(_points)
    {
        this.polygonPoints = _points;
    }
    
    startAttack(_player)
    {
        if (!this.bullet)
        {
            ServiceLocator.inputManager.drawGesture.add(this.receivePolygonPoints, this);
            this.bullet = new BeeBullet(this.game, _player, ServiceLocator.difficultyManager.getBeeBulletSpeed());
            this.bullet.create(this.sprite.x, this.sprite.y);
        }
    }

}

class BeeBullet
{
    constructor(_game, _player, _speed)
    {
        this.sprite;
        this.game = _game;
        this.player = _player;
        this.speed = _speed;
    }
    
    static Preload(_game)
    {
        _game.load.image('beeBullet', './img/beeBullet.png');
        _game.load.spritesheet('beeBulletExplosion', './img/bullet_explosion.png', 77, 73);
    }
    
    create(_x, _y)
    {
        this.sprite = this.game.add.sprite(_x, _y + 90, 'beeBullet', 5);
        ServiceLocator.renderer.addToScene(this.sprite);
    }
    
    update()
    {
        this.sprite.x -= this.speed;
    }
    
    isFinished()
    {
        var finished = this.sprite.x < this.player.getFeetArea()[1];
        if (finished)
        {
            this.player.monsterHit();
        }
        return finished;
    }
    
    destroy()
    {
        var explosion = this.game.add.sprite(this.sprite.x, this.sprite.y, 'beeBulletExplosion');
        ServiceLocator.renderer.addToScene(explosion);
        var explodingAnimation = explosion.animations.add('explode');
        explosion.play('explode', 10);
        explodingAnimation.onComplete.add(function () {explosion.destroy();});
        this.sprite.destroy();
        
    }
}
