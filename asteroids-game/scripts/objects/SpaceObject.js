MyGame.objects.SpaceObject = class {
    constructor (momentum, orientation, maxSpeed, center, size, imageSrc) {
        let self = this;
        this.momentum = momentum;
        this.orientation = orientation;
        this.maxSpeed = maxSpeed;
        this.center = center;
        this.size = size;
        this.radius = Math.max(this.size.width, this.size.height)/2;
        
        this.image = new Image(); 
        
        this.image.onload = function() {
            self.imageReady = true;
        };
        this.image.src = imageSrc;
    }

    update(elapsedTime) {

    }

    wrapMapEdges(canvasWidth, canvasHeight) {
        if((this.center.x + this.size.width/2) >= canvasWidth) {
            this.center.x = this.size.width/2 + 1;
        }
        if((this.center.x - this.size.width/2) <= 0) {
            this.center.x = canvasWidth - this.size.width/2 - 1;
        }
        if((this.center.y + this.size.height/2) >= canvasHeight) {
            this.center.y = this.size.height/2 + 1;
        }
        if((this.center.y - this.size.height/2) <= 0) {
            this.center.y = canvasHeight - this.size.height/2 - 1;
        }
    }

    setImage(newImgSrc) {
        this.image.src = newImgSrc;
    }

    collides(otherObj) {
        var myCircle = {radius: this.radius, x: this.center.x, y: this.center.y};
        var otherCircle = {radius: otherObj.radius, x: otherObj.center.x, y: otherObj.center.y};


        var xDistance = myCircle.x - otherCircle.x;
        var yDistance = myCircle.y - otherCircle.y;
        var centerDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

        if (centerDistance < myCircle.radius + otherCircle.radius) {
            return true;
        }  
    }
}