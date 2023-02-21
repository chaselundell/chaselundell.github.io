MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    let mazeSizeDropdown = document.getElementById("mazeSizeDropdown");
    let mazeSizeStr = mazeSizeDropdown.options[mazeSizeDropdown.selectedIndex].value;

    let numCells = parseInt(mazeSizeStr);
    let cellWidth = canvas.width/numCells;
    let cellHeight = canvas.height/numCells;

    let imgFloor = new Image();
    imgFloor.isReady = false;
    imgFloor.onload = function() {
        this.isReady = true;
    };
    imgFloor.src = 'images/floor.png';

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function reset() {
        mazeSizeDropdown = document.getElementById("mazeSizeDropdown");
        mazeSizeStr = mazeSizeDropdown.options[mazeSizeDropdown.selectedIndex].value;

        numCells = parseInt(mazeSizeStr);
        cellWidth = canvas.width/numCells;
        cellHeight = canvas.height/numCells;
        clear();
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }

    function drawText(spec) {
        context.save();

        context.font = spec.font;
        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;
        context.textBaseline = 'top';

        context.translate(spec.position.x, spec.position.y);
        context.rotate(spec.rotation);
        context.translate(-spec.position.x, -spec.position.y);


        context.fillText(spec.text, spec.position.x, spec.position.y);
        context.strokeText(spec.text, spec.position.x, spec.position.y);

        context.restore();
    }

    function drawGameOver(score) {
        context.save();

        context.font = "100px Arial";
        context.fillStyle = "#363689";
        context.fillText("Finished!", 30, canvas.height/3);
        context.fillText("Score: " + score, 30, canvas.height/3 + 150);


        context.strokeStyle = "#2A2A6B";
        context.strokeWidth = 1;
        context.strokeText("Finished!", 30, canvas.height/3);
        context.strokeText("Score: " + score, 30, canvas.height/3 + 150);

        context.restore();
    }

    function drawMaze() {
        context.strokeStyle = '#708090';
        context.lineWidth = 6;
    
        for (let row = 0; row < numCells; row++) {
            for (let col = 0; col < numCells; col++) {
                drawCell(maze[row][col]);
            }
        }
    
        context.beginPath();
        context.moveTo(3, 3);
        context.lineTo(canvas.width - 3, 3);
        context.lineTo(canvas.width - 3, canvas.height) - 3;
        context.lineTo(3, canvas.height - 3);
        context.closePath();
        context.strokeStyle = '#708090';
        context.stroke();
    }

    function drawCell(cell) {

        if (imgFloor.isReady) {
            context.drawImage(imgFloor,cell.getX() * cellWidth, cell.getY() * cellHeight, cellWidth, cellHeight);
        }

        //Only have to draw bottom and right sides because I am drawing the border around the maze
        if (cell.checkSide(1)) {
            context.moveTo((cell.getX() + 1) * (cellWidth), cell.getY() * (cellHeight) - 3);
            context.lineTo((cell.getX() + 1) * (cellWidth), (cell.getY() + 1) * (cellHeight) + 3);
        }
        if (cell.checkSide(2)) {
            context.moveTo(cell.getX() * (cellWidth) - 3, (cell.getY() + 1) * (cellHeight));
            context.lineTo((cell.getX() + 1) * (cellWidth) + 3, (cell.getY() + 1) * (cellHeight));
        }
        context.stroke();
    }

    function drawPlayer(player) {
        if (player.getImage().isReady) {
            context.drawImage(player.getImage(), player.getPosition().x * cellWidth + 6, player.getPosition().y * cellHeight + 6, cellWidth - 12, cellHeight - 12);
            // context.drawImage(player.getImage(), player.getPosition().x, player.getPosition().y, cellWidth, cellHeight);
        }

        
    }

    function drawPoint(point) {
        context.fillStyle = point.fillColor;
        context.fillRect(point.x * (cellWidth) + cellWidth/3, point.y * (cellHeight) + cellWidth/3, cellWidth/3, cellHeight/3);
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        drawText: drawText,
        drawMaze: drawMaze,
        drawCell: drawCell,
        drawPlayer: drawPlayer,
        drawPoint: drawPoint,
        reset: reset,
        drawGameOver: drawGameOver
    };
    

    return api;
}());
