MyGame.objects.Missile = class extends MyGame.objects.SpaceObject {
    constructor (orientation, maxSpeed, center, type) {
        let m = {x: Math.cos(orientation), y:Math.sin(orientation)}
        let imgSrc = "images/missile_4.png";
        if(type === "saucer") {
            imgSrc = "images/light_bullet.png"
        }
        super(m, orientation, maxSpeed, center,  {width: 50, height: 10}, imgSrc);
        this.distance = 0;
        this.type = type;
    }

    update(elapsedTime) {
        let xDistance = (this.momentum.x * this.maxSpeed * elapsedTime);
        let yDistance = (this.momentum.y * this.maxSpeed * elapsedTime);
        this.center.x += xDistance;
        this.center.y += yDistance;
        this.distance += Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

    }
}