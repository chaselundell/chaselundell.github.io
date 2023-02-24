MyGame.main = (function(objects, renderer, graphics, input, menu) {
    'use strict';
    const PLAYER_IMAGE = "images/spaceship_4.png";
    const SECOND = 1000;
    const LARGE_PTS = 20;
    const MEDIUM_PTS = 50;
    const SMALL_PTS = 100;
    const SMALL_SAUCER_PTS = 500;
    const LARGE_SAUCER_PTS = 300;
    let lastTimeStamp = performance.now();
    let myKeyboard = input.Keyboard();
    let myMouse = input.Mouse();
    let score, trackedSeconds, level, scoreCounter = 0;
    let player = null;
    let largeSaucer = null;
    let smallSaucer = null;
    let particleSystemManager = null;
    let audioPlayer = null;
    let gameOver = false;
    let asteroids = [];
    let lives = 3;

    function initGameObjects() {
        particleSystemManager = new objects.ParticleSystemManager(graphics, objects, renderer);
        audioPlayer = new objects.AudioPlayer();
        asteroids.length = 0;
        
        generateAsteroids(3);

        //momentum, orientation, maxSpeed, moveRate, rotateRate, center, size, imageSrc
        player = new objects.PlayerShip({x: 0, y: 0}, 0, 4, 90 / 1000, Math.PI / 600, { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 }, { width: 50, height: 50 }, PLAYER_IMAGE, 5, particleSystemManager, audioPlayer);

        largeSaucer = generateSaucer("large");
        smallSaucer = generateSaucer("small");
        
        let accelerate = player.accelerateForward.bind(player);
        let rotateLeft = player.rotateLeft.bind(player);
        let rotateRight = player.rotateRight.bind(player);
        let fire = player.fire.bind(player);

        let hyperspace = player.safeHyperspace.bind(player, asteroids, graphics.canvas.width, graphics.canvas.height);

        myKeyboard.register('ArrowUp', accelerate);
        myKeyboard.register('ArrowLeft', rotateLeft);
        myKeyboard.register('ArrowRight', rotateRight);
        myKeyboard.register(' ', fire);

        myKeyboard.register('z', hyperspace);
        myKeyboard.register('Escape', displayMenu);
        score = 0;
        lives = 3;
        level = 1;
        gameOver = false;
        scoreCounter = 0;

    };
    initGameObjects();

    function displayMenu() {
        menu.showMenu = true;
        initGameObjects();
    }

    function generateSaucer(type) {
        let saucerCenter = {};
        let saucerMomentum = {};
        if(getRandomNum(0, 2)) {
            saucerCenter = {x: graphics.canvas.width, y: getRandomNum(0, graphics.canvas.height)};
            saucerMomentum = {x: -1, y: 0};
        } else {
            saucerCenter = {x: 0, y: getRandomNum(0, graphics.canvas.height)};
            saucerMomentum = {x: 1, y: 0};
        }
        return new objects.Saucer(saucerMomentum, saucerCenter, type, audioPlayer);
    }

    function generateAsteroids(howMany) {
        for(let i = 0; i < howMany; i++) {
            let asteroid = new objects.Asteroid(getRandomNum(0, 90), "large", {x: getRandomNum(25, graphics.canvas.width - 25), y: getRandomNum(60, graphics.canvas.height - 60)}, getRandomRotation());
            asteroids.push(asteroid);
        }
    }

    function getRandomNum(min, max) {
        return Math.floor((Math.random() * max) + min);
    }

    function getRandomRotation() {
        return Math.PI / (getRandomNum(0, 5) * 200 + 1000); //gives a number between 1000 and 2000 incremented by 200
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
    }

    function update(elapsedTime) {
        if(!gameOver) {
            trackedSeconds += elapsedTime;
            if(trackedSeconds >= SECOND) {
                time += 1;
                trackedSeconds = 0;
            }

            // Check Collisions
            if(!player.invincible && player.active && smallSaucer.active && player.collides(smallSaucer)) killPlayer();
            if(!player.invincible && player.active && largeSaucer.active && player.collides(largeSaucer)) killPlayer();

            for (var i = smallSaucer.missiles.length; i--;) {
                if(!player.invincible && player.active && player.collides(smallSaucer.missiles[i])){
                    killPlayer();
                    smallSaucer.missiles.splice(i, 1);
                }
            }

            for (var i = largeSaucer.missiles.length; i--;) {
                if(!player.invincible && player.active && player.collides(largeSaucer.missiles[i])){
                    killPlayer();
                    largeSaucer.missiles.splice(i, 1);
                }
            }

            for(let j = 0; j < player.missiles.length; j++) {
                if(largeSaucer.active && player.missiles[j].collides(largeSaucer)) {
                    largeSaucer.active = false;
                    score += LARGE_SAUCER_PTS;
                    audioPlayer.restartSound("explosion");
                    audioPlayer.playSound("explosion");
                    particleSystemManager.createParticleSystem(largeSaucer.center, "largeSaucer");
                }
                if(smallSaucer.active && player.missiles[j].collides(smallSaucer)) {
                    smallSaucer.active = false;
                    score += SMALL_SAUCER_PTS;
                    audioPlayer.restartSound("explosion");
                    audioPlayer.playSound("explosion");
                    particleSystemManager.createParticleSystem(smallSaucer.center, "smallSaucer");
                }
            }
            
            for (var i = asteroids.length; i--;) {
                if(!player.invincible && player.active && player.collides(asteroids[i])){
                    killPlayer();
                }
                for(let j = 0; j < player.missiles.length; j++) {
                    let hitAsteroid = asteroids[i];
                    if(!asteroids[i].invincible && player.missiles[j].collides(asteroids[i])) {
                        particleSystemManager.createParticleSystem(hitAsteroid.center, (hitAsteroid.type + "Asteroid"));
                        //remove asteroid from list
                        asteroids.splice(i, 1);
                        player.missiles.splice(j, 1);
                        //if hit asteroid is large, add 3 medium asteroids at the asteroid's center going random directions
                        if(hitAsteroid.type === "large") {
                            score += LARGE_PTS;
                        }
                        let splitAsteroidType = "medium";
                        let numSplitAsteroids = 3;
                        if(hitAsteroid.type === "medium") {
                            splitAsteroidType = "small";
                            numSplitAsteroids = 4;
                            score += MEDIUM_PTS;
                        }

                        if(hitAsteroid.type === "small") {
                            numSplitAsteroids = 0;
                            score += SMALL_PTS;
                        }
                        audioPlayer.restartSound("explosion");
                        audioPlayer.playSound("explosion");

                        for(let newIndex = 0; newIndex < numSplitAsteroids; newIndex++) {
                            let asteroid = new objects.Asteroid(getRandomNum(0, 90), splitAsteroidType, {x: hitAsteroid.center.x, y: hitAsteroid.center.y}, getRandomRotation());
                            asteroids.push(asteroid);
                        }

                        if(Math.floor(score/10000) > scoreCounter) {
                            lives++;
                            scoreCounter++;
                        }

                        break;

                    }
                }
            }

            //check if we need to go to next level
            if(asteroids.length === 0 && smallSaucer.active === false && largeSaucer.active === false) {
                level++;
                generateAsteroids(level + 2);
            }

            player.update(elapsedTime, graphics.canvas.width, graphics.canvas.height);
            asteroids.forEach(asteroid => asteroid.update(elapsedTime, graphics.canvas.width, graphics.canvas.height));
            largeSaucer.update(elapsedTime, graphics.canvas.width, graphics.canvas.height, player);
            smallSaucer.update(elapsedTime, graphics.canvas.width, graphics.canvas.height, player);

            particleSystemManager.update(elapsedTime);
        }
    }

    function killPlayer() {
        particleSystemManager.createParticleSystem(player.center, "ship");
        audioPlayer.restartSound("gunshot");
        audioPlayer.playSound("gunshot");
        lives--;
        if(lives <= 0) {
            gameOver = true;
            addHighScoreToStorage();
        }
        player.center = { x: graphics.canvas.width / 2, y: graphics.canvas.height / 2 };
        player.momentum = {x: 0, y: 0};
        player.seconds = 0;
        player.invincible = true;
        player.active = false;
        player.deadTimeSum = 0;
    }

    function addHighScoreToStorage() {
        let highScores = [];
        // Get a list of all the high scores in session storage, if one doesn't exist, just add one with score 0
        for(let i = 0; i < 10; i++) {
            let key = "highScores_" + i;
            let highScore = sessionStorage[key];
            if(highScore) {
                highScores.push(highScore);
            } else {
                highScores.push(0);
            }
        }
        //add your score, sort list and if length is more than 10, remove 1
        highScores.push(score);
        highScores.sort((a, b) => b - a); //sort descending high -> low
        if(highScores.length > 10) {
            highScores.pop();
        }
        // loop through list again setting the values into session storage
        for(let i = 0; i < 10; i++) {
            let key = "highScores_" + i;
            sessionStorage[key] = highScores[i];
        }
    }

    function render() {
        if(!gameOver) {
            graphics.clear();
            graphics.drawBackground();
            graphics.drawLives(lives);
            graphics.drawScore(score);
            graphics.drawHyperspaceBar(player);
            graphics.drawLevel(level);
            for(let i = 0; i < player.missiles.length; i++) {
                graphics.drawSpaceObject(player.missiles[i]);
            }
            if(smallSaucer.active) {
                for(let i = 0; i < smallSaucer.missiles.length; i++) {
                    graphics.drawSpaceObject(smallSaucer.missiles[i]);
                }
            }
            if(largeSaucer.active) {
                for(let i = 0; i < largeSaucer.missiles.length; i++) {
                    graphics.drawSpaceObject(largeSaucer.missiles[i]);
                }
            }
            
            for(let i = 0; i < asteroids.length; i++) {
                graphics.drawSpaceObject(asteroids[i]);
            }
            
            if(largeSaucer.active) graphics.drawSpaceObject(largeSaucer);
            if(smallSaucer.active) graphics.drawSpaceObject(smallSaucer);
            
            let systems = particleSystemManager.particleSystems;
            for(let i = 0; i < systems.length; i++) {
                systems[i].rendererV1.render();
                systems[i].rendererV2.render();
            }
            renderer.Player.render(player);

        } else {
            graphics.drawGameOver(score, level);
        }
            
    }

    function gameLoop(time) {
        if(!menu.showMenu) {
            let elapsedTime = time - lastTimeStamp;
            lastTimeStamp = time;

            processInput(elapsedTime);
            update(elapsedTime);
            render();
        } else {
            player.setImage(menu.shipSelected);
        }

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
    let game = {
        displayMenu: displayMenu
    };
    return game

}(MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.menu));
