class WalkToCombatTransition extends GameMode
{
    constructor(_game, _player)
    {
        super();
        this.game = _game;
        this.player = _player;
        this.coverSprite;
        this.enemies = [];
    }
    
    static preload(_game)
    {
        _game.load.image('treeHide', "img/tree_hide.png");
    }

    update()
    {
        this.iterations++;
        ServiceLocator.walkManager.fillEmpty();
        this.coverSprite.x -= 16;
        
        for (var ind in this.enemies)
        {
            if(this.enemies[ind].position.x > this.coverSprite.x + 400)
            {
                this.enemies[ind].setVisible(true);
            }
        }
    }
    
    isFinished()
    {
        return this.iterations > 110;
    }
    
    startMode(_enemies)
    {
        var padding = 220;
        this.iterations = 0;
        var renderArea = ServiceLocator.camera.getRenderArea();
        
        if (_enemies === undefined)
        {
            _enemies = ServiceLocator.difficultyManager.getEnemies();
        }
        
        var numberOfEnemies = _enemies.length;
        for (var ind in _enemies)
        {
            var type = _enemies[ind];
            var spec = ServiceLocator.difficultyManager.getEnemySpec(type.NAME);
            var pos = 350 + renderArea.bottomRight.x + padding * (ind - numberOfEnemies);
            var enemy = new type(this.game, spec, ind, new Phaser.Point(pos,0));
            enemy.create();
            enemy.setVisible(false);

            this.enemies[ind] = enemy;
        }

        this.coverSprite = this.game.add.sprite(renderArea.right, 0, "treeHide");
        ServiceLocator.renderer.addToScene(this.coverSprite);
    }
    
    finishMode()
    {
        this.player.finishWalk();
    }
    
    getNextModeArguments()
    {
        return this.enemies;
    }
}

WalkToCombatTransition.NAME = "WalkToCombatTransition";