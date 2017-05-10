class ParticleEmitter
{
    constructor(_game)
    {
        this.game = _game;
        ServiceLocator.registerListener(this.emitParticle, this, "EmitParticle");
    }
    
    static preload(_game)
    {
        _game.load.image('grass_leaf_particle', './img/particles/grass_leaf.png');
        _game.load.image('health_particle', './img/particles/health_bubble.png');
        _game.load.image('energy_particle', './img/particles/energy_bubble.png');
    }
    
    create()
    {
        this.grassemitter = game.add.emitter(0, 0, 10);

        this.grassemitter.makeParticles('grass_leaf_particle');
        this.grassemitter.setRotation(10,200);
        this.grassemitter.setXSpeed(-0.3,0.3);
        this.grassemitter.setYSpeed(-30,-100);
        this.grassemitter.setAlpha(1.0, 0.0, 1000)
        this.grassemitter.width = 150;
        
        this.healthEmitter = game.add.emitter(40, 50, 25);
        this.healthEmitter.makeParticles('health_particle');
        this.healthEmitter.setXSpeed(130,70);
        this.healthEmitter.setYSpeed(0,0);
        this.healthEmitter.gravity = 0;
        this.healthEmitter.height = 30;
        this.healthEmitter.width = 100;
        this.healthEmitter.setAlpha(0.3, 0.9);
        ServiceLocator.renderer.addToUI(this.healthEmitter);
        
        this.energyEmitter = game.add.emitter(40, 110, 25);
        this.energyEmitter.makeParticles('energy_particle');
        this.energyEmitter.setXSpeed(130,70);
        this.energyEmitter.setYSpeed(0,0);
        this.energyEmitter.gravity = 0;
        this.energyEmitter.height = 30;
        this.energyEmitter.width = 100;
        this.energyEmitter.setAlpha(0.3, 0.9);
        ServiceLocator.renderer.addToUI(this.energyEmitter);
    }
    
    emitParticle(_msg)
    {
        var position = _msg.getPosition();
        
        var emitter;
        
        switch(_msg.getType())
        {
            case EmitParticle.Types.GrassLand:
                emitter = this.grassemitter;
                break;
            case EmitParticle.Types.HealthIncrease:
                emitter = this.healthEmitter;
                break;
            case EmitParticle.Types.EnergyIncrease:
                emitter = this.energyEmitter;
                break;
        }
        
        if (emitter)
        {
            if (position)
            {
                this.grassemitter.x = position.x;
                this.grassemitter.y = position.y;
            }
            emitter.start(true, 1000, null, 25);
        }
    }
}
