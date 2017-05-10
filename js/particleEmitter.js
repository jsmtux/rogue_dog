class ParticleEmitter
{
    constructor(_game)
    {
        this.game = _game;
        ServiceLocator.registerListener(this.emmitParticle, this, "EmmitParticle");
    }
    
    static preload(_game)
    {
        _game.load.image('grass_leaf_particle', './img/particles/grass_leaf.png');
    }
    
    create()
    {
        this.grassemitter = game.add.emitter(0, 0, 100);

        this.grassemitter.makeParticles('grass_leaf_particle');
        this.grassemitter.setRotation(10,200);
        this.grassemitter.setXSpeed(-0.3,0.3);
        this.grassemitter.setYSpeed(-30,-100);
        this.grassemitter.setAlpha(1.0, 0.0, 1000)
        this.grassemitter.width = 150;
    }
    
    emmitParticle(_msg)
    {
        var position = _msg.getPosition();
        this.grassemitter.x = position.x;
        this.grassemitter.y = position.y;
        
        //all at once, die after 2000ms, ignored, number of particles
        this.grassemitter.start(true, 1000, null, 10);
    }
}