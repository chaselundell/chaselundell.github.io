MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    let imgBckgnd = new Image();
    imgBckgnd.isReady = false;
    imgBckgnd.onload = function() {
        this.isReady = true;
    };
    imgBckgnd.src = 'images/space_asteroids_game_1.jpg';

    let lifeImg = new Image();
    lifeImg.isReady = false;
    lifeImg.onload = function() {
        this.isReady = true;
    };
    lifeImg.src = 'images/life.png';

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawBackground() {
        context.drawImage(imgBckgnd, 0, 0, canvas.width, canvas.height);
    }

    function drawMainMenu(buttons) {
        drawBackground();

        buttons.forEach(function(btn){
            drawMenuButton(btn);
        });
    }

    function drawScore(score) {
        context.save();
        context.font = "20px Arial";
        context.fillStyle = "#E0FFFF";
        context.fillText("Score: " + score, 60, 60);
        context.restore();
    }

    function drawHyperspaceBar(ship) {
        context.save();
        context.font = "20px Arial";
        context.fillStyle = "#E0FFFF";
        context.fillText("Hyperspace Status: ", 320, 60);
        context.fillStyle = "#FFA07A";
        if(ship.hyperspaceStatus === 100) context.fillStyle = "#90EE90";
        context.fillRect(420, 45, ship.hyperspaceStatus * 2, 30);
        context.restore();
    }
    
    function drawLevel(level) {
        context.save();
        context.font = "20px Arial";
        context.fillStyle = "#E0FFFF";
        context.fillText("Level: " + level, 750, 60);
        context.restore();
    }

    function drawLives(lives) {
        for(let i = 0; i < lives; i++) {
            context.drawImage(lifeImg, 900 + 60*i, 40, 40, 40);
        }
    }

    function drawGameOver(score, level) {
        drawBackground();
        context.save();

        context.font = "100px Arial";
        context.fillStyle = "#93AAD1";
        context.fillText("Game Over!", canvas.width/2, canvas.height/6);


        context.strokeStyle = "#2A2A6B";
        context.strokeWidth = 1;
        context.strokeText("Game Over!", canvas.width/2, canvas.height/6);

        context.font = "40px Arial";
        context.fillStyle = "#E0FFFF";
        context.fillText("Score: " + score, canvas.width/2, 3 * canvas.height/6);
        context.fillText("Level: " + level, canvas.width/2, 4 * canvas.height/6);
        context.font = "30px Arial";
        context.fillText("Press ESC to return to the menu.", canvas.width/2, 5 * canvas.height/6);

        context.restore();
    }

    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.x / 2,
            center.y - size.y / 2,
            size.x, size.y);

        context.restore();
    }

    function drawSpaceObject(spaceObj) {

        if (spaceObj.imageReady) {
            if(spaceObj.active === false) return;
            context.save();
            context.translate(spaceObj.center.x, spaceObj.center.y);
            context.rotate(spaceObj.orientation);
            context.translate(-spaceObj.center.x, -spaceObj.center.y);

            context.drawImage(spaceObj.image, spaceObj.center.x - spaceObj.size.width / 2, spaceObj.center.y - spaceObj.size.height / 2, spaceObj.size.width, spaceObj.size.height);
            context.restore();

            if(spaceObj.invincible && spaceObj.maxMissiles) {//just to make sure only the ship's circle draws
                context.globalAlpha = 0.2;
                context.fillStyle = "#C0C0C0";
                context.beginPath();
                context.arc(spaceObj.center.x, spaceObj.center.y, spaceObj.size.width, 0, 2 * Math.PI);
                context.fill();
                context.globalAlpha = 1.0;
            }
        }
    }

    function drawPoint(point) {
        context.fillStyle = point.fillColor;
        context.fillRect(point.x * (cellWidth) + cellWidth/3, point.y * (cellHeight) + cellWidth/3, cellWidth/3, cellHeight/3);
    }

    function drawMenuButton(btn) {
        if(btn.btnText != ""){
            context.drawImage(btn.image, btn.x, btn.y, btn.width, btn.height);
            context.textAlign="center"; 
            context.textBaseline = "middle";

            context.font = "bold 25px Arial";
            context.lineWidth = 4;
            context.strokeStyle = "#2A2A6B";
            context.strokeText(btn.btnText, btn.x + (btn.width/2), btn.y + (btn.height/2));
            context.fillStyle = "#93AAD1";
            context.fillText(btn.btnText, btn.x + (btn.width/2), btn.y + (btn.height/2));
        } else {
            if(btn.shipSelected) {
                context.globalAlpha = 0.2;
                context.fillStyle = "#C0C0C0";
                context.beginPath();
                context.arc(btn.x + btn.width/2, btn.y + btn.height/2, btn.width, 0, 2 * Math.PI);
                context.fill();
                context.globalAlpha = 1.0;
            }
            context.drawImage(btn.image, btn.x, btn.y, btn.width, btn.height);
        }
    }

    function drawControls() {
        drawBackground();
        context.textAlign="center"; 
        context.textBaseline = "middle";
        context.font = "bold 25px Arial";
        context.lineWidth = 6;

        context.fillStyle = "#E0FFFF";
        context.fillText("Use the Left/Right arrow keys to rotate the ship.", context.canvas.width / 2, context.canvas.height / 5);
        context.fillText("Use the Up arrow key to thrust forward.", context.canvas.width / 2, context.canvas.height / 5 + context.canvas.height / 5);
        context.fillText("Use the Space Bar to fire and the Z key to jump to hyperspace.", context.canvas.width / 2, 2 * context.canvas.height / 5 + context.canvas.height / 5);
    }

    function drawHighScores() {
        drawBackground();
        let highScores = [];
        for(let i = 0; i < 10; i++) {
            let key = "highScores_" + i;
            let highScore = sessionStorage[key];
            if(highScore) {
                highScores.push(highScore);
            } else {
                highScores.push("0");
            }
        }
        context.textAlign="center"; 
        context.textBaseline = "middle";
        context.font = "bold 25px Arial";
        context.lineWidth = 6;

        context.fillStyle = "#E0FFFF";
        for(let i = 0; i < highScores.length; i++) {
            if(highScores[i] !== "0") context.fillText("Score " + (i + 1) + ": " + highScores[i], context.canvas.width / 2, context.canvas.height/12 * i + context.canvas.height/12);
        }
        if(highScores[0] === "0")
            context.fillText("No High Scores", context.canvas.width / 2, context.canvas.height / 2);
    }

    function drawCredits() {
        drawBackground();
        context.textAlign="center"; 
        context.textBaseline = "middle";
        context.font = "bold 25px Arial";
        context.lineWidth = 6;

        context.fillStyle = "#E0FFFF";
        context.fillText("Developed By: Chase Lundell.", context.canvas.width / 2, context.canvas.height / 6);
        context.font = "bold 20px Arial";
        context.fillText("Music from https://www.bensound.com/.", context.canvas.width / 2, 2 * context.canvas.height / 6);
        context.fillText("Images from https://freestocktextures.com/ and https://pngtree.com/.", context.canvas.width / 2, 3 * context.canvas.height / 6);
        context.fillText("Sound effects from https://freesound.org/.", context.canvas.width / 2, 4 * context.canvas.height / 6);
        
    }


    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawSpaceObject: drawSpaceObject,
        drawPoint: drawPoint,
        drawGameOver: drawGameOver,
        drawBackground: drawBackground,
        drawMainMenu: drawMainMenu,
        drawControls: drawControls,
        drawHighScores: drawHighScores,
        drawCredits: drawCredits,
        drawScore: drawScore,
        drawLives: drawLives,
        drawHyperspaceBar: drawHyperspaceBar,
        drawLevel: drawLevel,
        drawTexture: drawTexture
    };
    

    return api;
}());
