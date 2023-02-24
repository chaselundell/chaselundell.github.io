MyGame.objects.Saucer = class extends MyGame.objects.Ship {
    constructor (momentum, center, type, audioPlayer) {
        let size = {width: 60, height: 50};
        let imageSrc = "images/UFO_1.png";
        let speed = .17;
        let fireRate = 2000;
        if(type === "small") {
            speed = .24;
            imageSrc = "images/UFO_2.png";
            size = {width: 40, height: 30};
            fireRate = 1000;
        }
        super(momentum, 0, speed, 0, 0, center, size, imageSrc, 5);
        this.fireRate = fireRate;
        this.speed = speed;
        this.type = type;
        this.active = false;
        this.timeSum = 0;
        this.fireTimeSum = 0;
        this.audioPlayer = audioPlayer;
        this.soundTimer = 0;
    }

    fire(player) {
        if(this.missiles.length < this.maxMissiles) {
            let newCenter = {};
            Object.assign(newCenter, this.center);
            let missileOrientation = this.findAngleToPlayer(player);
            if(this.type === "large") {
                if(missileOrientation > 0) missileOrientation += 5;
                else missileOrientation -= 10;
            }
            missileOrientation = this.degreesToRad(missileOrientation);
            this.missiles.push(new MyGame.objects.Missile(missileOrientation, .6, newCenter, "saucer"));
        }

    };

    radToDegrees(radians) {
        return radians * 180 / Math.PI;
    }

    degreesToRad(degrees) {
        return degrees * Math.PI / 180;
    }

    findAngleToPlayer(player) {
        let deltaY = (player.center.y - this.center.y);
        let deltaX = (player.center.x - this.center.x);
        return this.radToDegrees(Math.atan2(deltaY, deltaX));
    }

    update(elapsedTime, canvasWidth, canvasHeight, player, score) {
        this.soundTimer += elapsedTime;
        if(this.active && this.soundTimer >= 2000) {
            this.audioPlayer.playSound("alien");
        }
        if(score >= 40000 && this.type === "large") {
            this.active = false;
        }

        if(this.active && this.fireTimeSum >= this.fireRate) {
            this.fireTimeSum = 0;
            this.fire(player);
        }

        this.timeSum += elapsedTime;
        this.fireTimeSum += elapsedTime;
        //I want the large one to show up every 20 sec and small to show up every 35 sec
        if(this.type === "large" && this.timeSum >= 20000) {
            this.timeSum = 0;
            this.active = true;
            this.startSaucer(canvasWidth, canvasHeight);
        }else if(this.type === "small" && this.timeSum >= 35000) {
            this.timeSum = 0;
            this.active = true;
            this.startSaucer(canvasWidth, canvasHeight);
        }

        if(this.active) {
            this.center.x += (this.momentum.x * this.speed * elapsedTime);
            this.center.y += (this.momentum.y * this.speed * elapsedTime);
        }
        

        if(this.center.x >= canvasWidth || this.center.x <= 0) {
            this.active = false;
        }

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

    startSaucer(canvasWidth, canvasHeight) {
        if(this.getRandomNum(0, 2)) {
            this.center = {x: canvasWidth, y: this.getRandomNum(0, canvasHeight)};
            this.momentum = {x: -1, y: 0};
        } else {
            this.center = {x: 0, y: this.getRandomNum(0, canvasHeight)};
            this.momentum = {x: 1, y: 0};
        }
    }

    getRandomNum(min, max) {
        return Math.floor((Math.random() * max) + min);
    }
}