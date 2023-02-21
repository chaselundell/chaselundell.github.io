function Maze(size, START_FILL_COLOR, FINISH_FILL_COLOR, SHORTEST_PATH_FILL_COLOR) {
    maze = [];
    unvisitedCoords = [];
    shortestPath = [];
    start = {x:0, y:0, fillColor: START_FILL_COLOR};
    finish = {x:size - 1, y:size - 1, fillColor: FINISH_FILL_COLOR};


    function initUnvisitedCoords() {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                unvisitedCoords.push({x: col, y: row});
            }
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function findShortestPath() {
        if(start.x >= size || start.y >= size || finish.x >= size || finish.y >= size) return;
        let paths = [[start]];
        while(paths.length > 0) {
            let path = paths.shift();
            let currPos = path[path.length - 1];

            //This will add a new path for every direction available
            for(let i = 0; i < 4; i++) {
                let nextPos = {};
                switch(i){
                    case 0:
                    nextPos = {x: currPos.x, y: currPos.y - 1, fillColor: SHORTEST_PATH_FILL_COLOR};break;
                    case 1:
                    nextPos = {x: currPos.x + 1, y: currPos.y, fillColor: SHORTEST_PATH_FILL_COLOR};break;
                    case 2:
                    nextPos = {x: currPos.x, y: currPos.y + 1, fillColor: SHORTEST_PATH_FILL_COLOR};break;
                    case 3:
                    nextPos = {x: currPos.x - 1, y: currPos.y, fillColor: SHORTEST_PATH_FILL_COLOR};break;
                }
                // can't go that direction, theres a wall
                if(nextPos.x < 0 || nextPos.y < 0 || maze[currPos.y][currPos.x].checkSide(i) || path.filter(function(p){ return p.x === nextPos.x && p.y === nextPos.y;}).length != 0) {
                    continue;
                }
                // you're at the finish! return the path.
                if(nextPos.x === finish.x && nextPos.y === finish.y) {
                    path.push(nextPos);
                    shortestPath = path;
                    return;
                }
                //if it is a valid move, add it to current path and add that to the paths array
                //you have to make a new path array to add to paths otherwise it will be referencing the same one
                let newPath = path.slice();
                let prevCell = newPath.pop();
                let newPrevCell = {x: prevCell.x, y: prevCell.y, fillColor: prevCell.fillColor, direction: i};
                newPath.push(newPrevCell);
                newPath.push(nextPos);
                paths.push(newPath);
            }
        }
    }

    function checkNeighborsGroup(x, y, side) {
        if(side === 0 && maze[y - 1] != null && maze[y - 1][x].getGroupId() != maze[y][x].getGroupId()) {
            return maze[y - 1][x]
        }
        if(side === 1 && maze[y][x + 1] != null && maze[y][x + 1].getGroupId() != maze[y][x].getGroupId()) {
            return maze[y][x + 1]
        }
        if(side === 2 && maze[y + 1] != null && maze[y + 1][x].getGroupId() != maze[y][x].getGroupId()) {
            return maze[y + 1][x]
        }
        if(side === 3 && maze[y][x - 1] != null && maze[y][x - 1].getGroupId() != maze[y][x].getGroupId()) {
            return maze[y][x - 1]
        }
        return null;
       
    }

    function regroup(addGID, delGID) {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if(maze[row][col].getGroupId() === delGID) {
                    maze[row][col].setGroupId(addGID);
                }
            }
        }
    }

    function cleanUpRemainingGroups() {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                visitCell(col, row);
            }
        }
    }

    function printGroups() {
        if(size != 15) {
            return;
        }
        for (let row = 0; row < size; row++) {
            console.log(maze[row][0].getGroupId() + ", " + maze[row][1].getGroupId() + ", " + maze[row][2].getGroupId() + ", " + maze[row][3].getGroupId() + ", " + maze[row][4].getGroupId() + ", " +maze[row][5].getGroupId() + ", " +maze[row][6].getGroupId() + ", " +maze[row][7].getGroupId() + ", " +maze[row][8].getGroupId() + ", " +maze[row][9].getGroupId() + ", " +maze[row][10].getGroupId() + ", " +maze[row][11].getGroupId() + ", " +maze[row][12].getGroupId() + ", " +maze[row][13].getGroupId() + ", " +maze[row][14].getGroupId());
        }
        console.log("\n\n")
    }

    function visitCell(x, y) {
        let randSide = getRandomInt(3);
        let j = 0;
        for(let i = 0; i < 4; i++) {
            let diffCell = checkNeighborsGroup(x, y, randSide);
            if(diffCell) {
                j--;
                //remove side from both cells
                maze[y][x].removeSide(randSide);
                //make the diffRandSide point opposite wherever randSide is pointing
                let diffRandSide = randSide + 2;
                if(diffRandSide > 3)
                diffRandSide = randSide - 2;
                maze[diffCell.getY()][diffCell.getX()].removeSide(diffRandSide);
                //loop through all cells and change any with the group id of the neighbor to the visited cell's groupId
                regroup(maze[y][x].getGroupId(), maze[diffCell.getY()][diffCell.getX()].getGroupId())
                //break out of for loop
                break;
            }
            //If the ids were the same then just continue until you find one that isn't
            if(randSide >= 3) randSide = 0;
            else randSide++;
            
            j++;
        }
        // maze[y][x].setVisited();

        return maze[y][x];
    }

    function printIsVisited() {
        for (let row = 0; row < size; row++) {
            console.log(maze[row][0].isVisited() + ", " + maze[row][1].isVisited() + ", " + maze[row][2].isVisited() + ", " + maze[row][3].isVisited() + ", " + maze[row][4].isVisited());
        }
        console.log("\n\n")
    }

    function visitRandomCell() {
        let rand = getRandomInt(unvisitedCoords.length);
        let randx = unvisitedCoords[rand].x;
        let randy = unvisitedCoords[rand].y;
        unvisitedCoords.splice(rand, 1);
        visitCell(randx, randy);
    }

    function isValidMove(x, y, direction) {
        return !maze[y][x].checkSide(direction);
    }

    var that = {
        init() {
            for (let row = 0; row < size; row++) {
                maze.push([]);
                for (let col = 0; col < size; col++) {
                    maze[row].push(new Cell(col, row, col.toString() + "-" + row.toString()));
                }
            }
            initUnvisitedCoords();
            while(unvisitedCoords.length > 0){
                visitRandomCell();
            }
            cleanUpRemainingGroups();

            findShortestPath();
        },

        size() {
            return size;
        },
        isValidMove: isValidMove,
        findShortestPath: findShortestPath,
        visitRandomCell: visitRandomCell,
        get start() { return start; },
        get finish() { return finish; },
        set start(s) { start = s;},
        set finish(f) { finish = f;},
        get shortestPath() { return shortestPath; }
    };

    return that;
}