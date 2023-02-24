MyGame.objects.ParticleSystem = class {
    constructor(speed, size, particleLifetime, center) {
        this.nextName = 1;
        this.particles = {};
        this.speed = speed;
        this.size = size;
        this.particleLifetime = particleLifetime;
        this.center = center;
    }

    create() {
        let size = Random.nextGaussian(this.size.mean, this.size.stdev);
        let p = {
            center: { x: this.center.x, y: this.center.y },
            size: { x: size, y: size },
            direction: Random.nextCircleVector(),
            speed: Random.nextGaussian(this.speed.mean, this.speed.stdev), // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(this.particleLifetime.mean, this.particleLifetime.stdev), // seconds
            alive: 0
        };

        return p;
    }

    update(elapsedTime) {
        let removeMe = [];

        elapsedTime = elapsedTime / 1000;

        for (let particle = 0; particle < 2; particle++) {
            this.particles[this.nextName++] = this.create();
        }

        Object.getOwnPropertyNames(this.particles).forEach(value => {
            let particle = this.particles[value];

            particle.alive += elapsedTime;
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });

        for (let particle = 0; particle < removeMe.length; particle++) {
            delete this.particles[removeMe[particle]];
        }
    }
};
