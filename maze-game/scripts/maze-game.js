MyGame.main = (function(objects, renderer, graphics, input) {
    'use strict';

    
    let mazeSizeDropdown = document.getElementById("mazeSizeDropdown");
    let mazeSizeStr = mazeSizeDropdown.options[mazeSizeDropdown.selectedIndex].value;
    let timer = document.getElementById('time');
    let currScore = document.getElementById('currScore');
    let highScoreElem = document.getElementById('highScore');

    let numCells = parseInt(mazeSizeStr);
    const cellWidth = graphics.canvas.width/numCells;
    const cellHeight = graphics.canvas.height/numCells;
    const BORDER_WIDTH = 0.5;

    const PLAYER_IMAGE = "images/child.png";

    const START_FILL_COLOR = '#39ff14';
    const BREAD_CRUMB_FILL_COLOR = '#C49102'

    const FINISH_FILL_COLOR = '#8B0000';
    const SHORTEST_PATH_FILL_COLOR = "#FF8300";
    const HINT_FILL_COLOR = "#DDA0DD";
    const SECOND = 1000;

    let lastTimeStamp = performance.now();

    let myKeyboard = input.Keyboard();
    let myMouse = input.Mouse();
    let time, score, trackedSeconds, moves = 1;
    let choosingStart, choosingFinish, showBreadCrumbs, showShortestPath, showHint = false;
    let player, maze, breadCrumbs, hint = null;
    let gameFinished = true;
    let highScores = [];

    function initGameObjects() {
        player = Player({x: 0,y: 0}, PLAYER_IMAGE);
        time = 0;
        score = 0;
        moves = 1;
        trackedSeconds = 0;
        gameFinished = true;
        maze = Maze(numCells, START_FILL_COLOR, FINISH_FILL_COLOR, SHORTEST_PATH_FILL_COLOR);
        maze.init();
        calculateHint();
        breadCrumbs = [{x:0, y:0, fillColor: BREAD_CRUMB_FILL_COLOR}]
    };
    initGameObjects();

    function newGame() {
        let mazeSizeStr = mazeSizeDropdown.options[mazeSizeDropdown.selectedIndex].value;
        numCells = parseInt(mazeSizeStr);
        initGameObjects();
        graphics.reset();
        render();
    }

    function chooseStart() {
        choosingStart = true;
        mouseCapture = true;
    }

    function chooseFinish() {
        choosingFinish = true;
        mouseCapture = true;
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
    }

    function update(elapsedTime) {
        if(!gameFinished) {
            trackedSeconds += elapsedTime;
            if(trackedSeconds >= SECOND) {
                time += 1;
                trackedSeconds = 0;
            }
        }
        let interval = 8;
        if(moves%interval == 0) {
            let imageSource = 'images/Jesus.jpeg';
            if(moves/interval == 1) {
                imageSource = 'images/atonement.jpeg';
            }else if(moves/interval == 2) {
                imageSource = 'images/atonement.jpeg';
            }else if(moves/interval == 3) {
                imageSource = 'images/baptism.webp';
            }else if(moves/interval == 4) {
                imageSource = 'images/holy-ghost.png';
            }else if(moves/interval == 5) {
                imageSource = 'images/sacrament.jpg';
            }else if(moves/interval == 6) {
                imageSource = 'images/temple.jpeg';
            }
            moves += 1;
            document.getElementById("instructionalImage").src= imageSource;
        }
        if(!gameFinished) timer.innerHTML = "Time: " + time;
        if(!gameFinished) currScore.innerHTML = "Current Score: " + score;
        if(!gameFinished && player.getPosition().x === maze.finish.x && player.getPosition().y === maze.finish.y) {
            gameFinished = true;
            highScores.push({score: score, time: time});
            highScores.sort(function(a, b) { return b.score - a.score });
            if(highScores.length > 5) highScores.pop();
            let newListElem = document.createElement('ol');
            highScores.forEach(function(highScore) {
                let li = document.createElement('li');
                li.appendChild(document.createTextNode("High Score: " + highScore.score + " in " + highScore.time + " seconds."));
                newListElem.appendChild(li);
            });
            let parent = document.getElementById('highScores');
            let child = document.getElementById('highScore');
            parent.removeChild(child);
            newListElem.setAttribute("id", "highScore");
            parent.appendChild(newListElem);
        }
    }

    function render() {
        graphics.clear();
        // renderer.Maze.renderBackground();

        renderer.Maze.render(maze);
        if(showShortestPath) {
            maze.shortestPath.forEach(function(coord) {
                renderer.Point.render(coord);
            })
        }
        if(showBreadCrumbs) {
            breadCrumbs.forEach(function(crumb) {
                renderer.Point.render(crumb);
            });
        }
        if(showHint && hint.direction) {
            let hintCoords = player.getMove(hint.direction);
            hintCoords.fillColor = hint.fillColor;
            renderer.Point.render(hintCoords);
        }
        renderer.Point.render(maze.start);
        renderer.Player.render(player);
        renderer.Point.render(maze.finish);
        if(player.getPosition().x === maze.finish.x && player.getPosition().y === maze.finish.y) {
            renderer.GameOver.render(score);
        }
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        requestAnimationFrame(gameLoop);
    }

    function calculateHint() {
        let prevHint = null;
        if(hint) {
            prevHint = hint;
        }
        hint = null;
        //if the player is on the shortest path, hint towards the next cell in shortest path
        for(let i = 0; i < maze.shortestPath.length; i++) {
            if(maze.shortestPath[i].x === player.getPosition().x && maze.shortestPath[i].y === player.getPosition().y) {
                hint = {direction: maze.shortestPath[i].direction};
                hint.fillColor = HINT_FILL_COLOR;
                break;
            }
        }
        //if they aren't on the shortest path, use the last hint direction
        if(!hint && prevHint) {
            hint = prevHint;
        }
    }

    function setPlayerStart(e) {
        let x = Math.floor(e.clientX/cellWidth);
        let y = Math.floor(e.clientY/cellHeight);
        maze.start = {x: x,y: y, fillColor: START_FILL_COLOR};
        maze.findShortestPath();
        breadCrumbs = [{x:x, y:y, fillColor: BREAD_CRUMB_FILL_COLOR}]
        player.setPosition({x: start.x, y: start.y});
        score = 0;
        moves = 1;
        time = 0;
    }

    function setFinish(e) {
        let x = Math.floor(e.clientX/cellWidth);
        let y = Math.floor(e.clientY/cellHeight);
        maze.finish = {x:x, y:y, fillColor: FINISH_FILL_COLOR};
        maze.findShortestPath();
    }

    function generalMoveHandle(direction) {
        gameFinished = false;
        if(player.getPosition().x === maze.finish.x && player.getPosition().y === maze.finish.y){
            gameFinished = true;
            return;
        }
        let pX = player.getPosition().x;
        let pY = player.getPosition().y;

        if(maze.isValidMove(pX, pY, direction)) {
            
            return true;
        }
        return false;
    }

    function postMoveUpdate() {
        moves += 1;
        let pX = player.getPosition().x;
        let pY = player.getPosition().y;
        calculateHint();
        if(breadCrumbs.filter(function(b){ return b.x === pX && b.y === pY;}).length === 0) {
            breadCrumbs.push({x: pX, y: pY, fillColor: BREAD_CRUMB_FILL_COLOR})
            if(maze.shortestPath.filter(function(s){ return s.x === pX && s.y === pY;}).length != 0) {
                score += 5;
            } else {
                score -= 2;
            }
        }
    }

    function playerUp(elapsedTime) {
        if(generalMoveHandle(0)) {
            player.setPosition(player.moveUp());
            postMoveUpdate();
        }
    }
    function playerDown(elapsedTime) {
        if(generalMoveHandle(2)) {
            player.setPosition(player.moveDown());
            postMoveUpdate();
        }
    }
    function playerLeft(elapsedTime) {
        if(generalMoveHandle(3)) {
            player.setPosition(player.moveLeft());
            postMoveUpdate();
        }
    }
    function playerRight(elapsedTime) {
        if(generalMoveHandle(1)) {
            player.setPosition(player.moveRight());
            postMoveUpdate();
        }
    }

    function toggleBreadCrumbs() {
        showBreadCrumbs = !showBreadCrumbs;
    }
    function toggleHint() {
        showHint = !showHint;
    }
    function toggleShortestPath() {
        showShortestPath = !showShortestPath;
    }

    //up
    myKeyboard.register('w', playerUp);
    myKeyboard.register('i', playerUp);
    myKeyboard.register('ArrowUp', playerUp);
    //down
    myKeyboard.register('s', playerDown);
    myKeyboard.register('k', playerDown);
    myKeyboard.register('ArrowDown', playerDown);
    //left
    myKeyboard.register('a', playerLeft);
    myKeyboard.register('j', playerLeft);
    myKeyboard.register('ArrowLeft', playerLeft);
    //right
    myKeyboard.register('d', playerRight);
    myKeyboard.register('l', playerRight);
    myKeyboard.register('ArrowRight', playerRight);

    myKeyboard.register('b', toggleBreadCrumbs);
    myKeyboard.register('h', toggleHint);
    myKeyboard.register('p', toggleShortestPath);

    let canvas = document.getElementById('id-canvas');
    let mouseCapture = false;
    myMouse.register('mousedown', function(e, elapsedTime) {
        mouseCapture = true;
    });

    myMouse.register('mouseup', function(e, elapsedTime) {
        if(choosingStart) {
            setPlayerStart(e);
            choosingStart = false;
        }
        if(choosingFinish) {
            setFinish(e);
            choosingFinish = false;
        }
        mouseCapture = false;
    });

    myMouse.register('mousemove', function(e, elapsedTime) {
        if (mouseCapture) {
            console.log("captured!")
            if(choosingStart) {
                setPlayerStart(e);
            }
            if(choosingFinish) {
                setFinish(e);
            }
        }
    });

    requestAnimationFrame(gameLoop);
    let game = {
        newGame: newGame,
        numCells: numCells,
        cellWidth: cellWidth,
        cellHeight: cellHeight,
        chooseStart: chooseStart,
        chooseFinish: chooseFinish
    };
    return game

}(MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input));
