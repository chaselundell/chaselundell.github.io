MyGame.objects.Ship = class extends MyGame.objects.SpaceObject {
    constructor (momentum, orientation, maxSpeed, moveRate, rotateRate, center, size, imageSrc, maxMissiles) {
        super(momentum, orientation, maxSpeed, center, size, imageSrc);
        this.moveRate = moveRate;
        this.rotateRate = rotateRate;
        this.accelerateTimer = 0;
        this.missiles = [];
        this.maxMissiles = maxMissiles;
    }

    moveForward(elapsedTime) {
        //don't let the ship go faster than the max speed.
        if(this.momentum.x > this.maxSpeed) this.momentum.x = this.maxSpeed;
        if(Math.abs(this.momentum.x) > this.maxSpeed) this.momentum.x = -this.maxSpeed;
        if(this.momentum.y > this.maxSpeed) this.momentum.y = this.maxSpeed;
        if(Math.abs(this.momentum.y) > this.maxSpeed) this.momentum.y = -this.maxSpeed;
        
        this.center.x += (this.momentum.x * this.moveRate * elapsedTime);
        this.center.y += (this.momentum.y * this.moveRate * elapsedTime);
    };

    rotateLeft(elapsedTime) {
        this.orientation -= this.rotateRate * (elapsedTime);
    };

    rotateRight(elapsedTime) {
        this.orientation += this.rotateRate * (elapsedTime);
    };
}