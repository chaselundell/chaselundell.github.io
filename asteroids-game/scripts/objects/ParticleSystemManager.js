MyGame.objects.ParticleSystemManager = class {
    constructor (graphics, objects, renderer) {
        this.graphics = graphics;
        this.objects = objects;
        this.renderer = renderer;
        this.particleSystems = [];
    }

    createParticleSystem(center, type) {
        let lifetime = 500;
        let imgSrc1 = "images/particle_5.png";
        let imgSrc2 = "images/fire.png";

        let size1 = { mean: 15, stdev: 5 };
        let size2 = { mean: 4, stdev: 2 };

        let speed = { mean: 80, stdev: 35 };

        let particleLifetime = { mean: 4, stdev: 1};

        if(type === "shipThrust") {
            lifetime = 700;
            imgSrc1 = "images/green_glitter.png";
            imgSrc2 = "images/particle_5.png";
            size1 = { mean: 4, stdev: 4 };
            size2 = { mean: 2, stdev: 2 };
            speed = { mean: 45, stdev: 30 };
            particleLifetime = { mean: 0, stdev: 2};
        } else if(type === "ship") {
            lifetime = 1000;
            imgSrc1 = "images/red_glitter.png";
            imgSrc2 = "images/particle_5.png";
        } else if (type === "largeSaucer" || type === "smallSaucer") {
            lifetime = 1000;
            size1 = { mean: 4, stdev: 4 };
            size2 = { mean: 2, stdev: 2 };
            imgSrc1 = "images/blue_glitter.png";
            imgSrc2 = "images/smoke-2.png";
        } else if(type === "hyperspace") {
            lifetime = 1000;
            size1 = { mean: 4, stdev: 4 };
            size2 = { mean: 2, stdev: 2 };
            imgSrc1 = "images/white_glitter.png";
            imgSrc2 = "images/orange_glitter.png";
        }
        //speed, size, particleLifetime, center
        let particlesV1 = new this.objects.ParticleSystem(speed, size1, particleLifetime, center);
        let particlesV2 = new this.objects.ParticleSystem(speed, size2, particleLifetime, center);
        let particleV1Renderer = this.renderer.ParticleSystem(particlesV1, this.graphics, imgSrc1);
        let particleV2Renderer = this.renderer.ParticleSystem(particlesV2, this.graphics, imgSrc2);
        this.particleSystems.push({systemV1: particlesV1, systemV2: particlesV2, rendererV1: particleV1Renderer, rendererV2: particleV2Renderer, lifetime: lifetime, timeSum: 0})

    }

    update(elapsedTime) {
        for(let i = this.particleSystems.length; i--;) {
            let sys = this.particleSystems[i];
            sys.timeSum += elapsedTime;
            if(sys.timeSum >= sys.lifetime) {
                this.particleSystems.splice(i, 1);
            } else {
                sys.systemV1.update(elapsedTime);
                sys.systemV2.update(elapsedTime);
            }
        }
    }
}