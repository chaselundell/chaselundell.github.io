MyGame.objects.Asteroid = class extends MyGame.objects.SpaceObject {
    constructor (orientation, type, center, rotateRate) {
        let m = {x: Math.cos(orientation), y:Math.sin(orientation)}

        let imgSrc = "images/meteor_" + type + ".png";

        let size = {width: 100, height: 100};
        if(type === "medium") size = {width: 65, height: 65};
        if(type === "small") size = {width: 40, height: 40};

        let speed = .1;
        if(type === "medium") speed = .17;
        if(type === "small") speed = .24;

        super(m, orientation, speed, center, size, imgSrc);  

        this.type = type;
        this.speed = speed;
        this.rotateRate = rotateRate;
        this.radius *= .8;
        this.invincible = true;
        this.timeSum = 0;
    }

    update(elapsedTime, canvasWidth, canvasHeight) {
        this.timeSum += elapsedTime;
        if(this.timeSum >= 200) {
            this.timeSum = 0;
            this.invincible = false;
        }

        this.center.x += (this.momentum.x * this.speed * elapsedTime);
        this.center.y += (this.momentum.y * this.speed * elapsedTime);
        
        this.wrapMapEdges(canvasWidth, canvasHeight);

        this.orientation -= this.rotateRate * (elapsedTime);
    }
}