MyGame.objects.PlayerShip = class extends MyGame.objects.Ship {
    constructor (momentum, orientation, maxSpeed, moveRate, rotateRate, center, size, imageSrc, maxMissiles, particleSystemManager, audioPlayer) {
        super(momentum, orientation, maxSpeed, moveRate, rotateRate, center, size, imageSrc, maxMissiles);
        this.hyperspaceStatus = 100;
        this.invincible = true;
        this.shipTimeSum = 0;
        this.hyperspaceTimeSum = 0;
        this.particleSystemManager = particleSystemManager;
        this.active = true;
        this.deadTimeSum = 0;
        this.audioPlayer = audioPlayer;
    }

    safeHyperspace(asteroids, width, height) {
        if(this.hyperspaceStatus >= 100) {
            let oldCenter = {x: this.center.x, y: this.center.y};
            this.particleSystemManager.createParticleSystem(oldCenter, "hyperspace");
            this.audioPlayer.playSound("hyperspace");
            this.hyperspaceStatus = 0;
            this.radius *= 2;
            this.hyperspace(asteroids, width, height);
            this.particleSystemManager.createParticleSystem(this.center, "hyperspace");
            this.radius /= 2;
            this.momentum.x = 0;
            this.momentum.y = 0;
        }
    }

    fire() {
        if(this.active && this.missiles.length < this.maxMissiles) {
            this.audioPlayer.restartSound("laser");
            this.audioPlayer.playSound("laser");
            let newCenter = {};
            Object.assign(newCenter, this.center);
            this.missiles.push(new MyGame.objects.Missile(this.orientation, .8, newCenter, "ship"));
        }

    };

    accelerateForward(elapsedTime) {
        if(this.active){
            this.particleSystemManager.createParticleSystem(this.center, "shipThrust");
            this.accelerateTimer += elapsedTime;
            if(this.accelerateTimer > 100) {
                this.accelerateTimer = 0;
                this.momentum.x += Math.cos(this.orientation);
                this.momentum.y += Math.sin(this.orientation);
                this.radius = Math.max(this.size.width, this.size.height)/2;
                this.started = true;
            }
        }
    };

    hyperspace(asteroids, width, height) {
        this.center.x = this.getRandomNum(this.size.width/2, width - this.size.width/2);
        this.center.y = this.getRandomNum(this.size.height/2, height - this.size.height/2);
        for (let i = 0; i < asteroids.length; i++) {
            if(this.collides(asteroids[i])) {
                this.hyperspace(asteroids, width, height);
            }
        }
    }

    getRandomNum(min, max) {
        return Math.floor((Math.random() * max) + min);
    }


    update(elapsedTime, canvasWidth, canvasHeight) {
        this.shipTimeSum += elapsedTime;
        this.hyperspaceTimeSum += elapsedTime;
        this.deadTimeSum += elapsedTime;
        if(this.hyperspaceTimeSum >= 100) { //Every 100 milliseconds, so every second you get 20% of hyperspace back and it takes 5 seconds to get 100%
            this.hyperspaceTimeSum = 0;
            if(this.hyperspaceStatus < 100) this.hyperspaceStatus += 2;
        }
        if(this.shipTimeSum >= 3000) {
            this.shipTimeSum = 0;
            this.invincible = false;
        }
        if(this.deadTimeSum >= 3000) {
            this.deadTimeSum = 0;
            if(!this.active) {
                this.invincible = true;
                this.shipTimeSum = 0;
            }
            this.active = true;
        }

        this.moveForward(elapsedTime);

        this.wrapMapEdges(canvasWidth, canvasHeight);

        for (var i = this.missiles.length; i--;) {
            let missileMove = this.missiles[i].update.bind(this.missiles[i]);
            let missileWrapEdges = this.missiles[i].wrapMapEdges.bind(this.missiles[i]);
            missileMove(elapsedTime);
            missileWrapEdges(canvasWidth, canvasHeight);
            if(this.missiles[i].distance > Math.max(canvasWidth/2, canvasHeight/2)) {
                this.missiles.splice(i, 1);
            }
        }
    }
}