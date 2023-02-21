function Cell(x, y, groupId) {
    this.visited = false;
    this.walls = {
        north: true,
        east: true,
        south: true,
        west: true
    }
    let ctx = this;
    var that = {

        setGroupId: function(id) {
            groupId = id;
        },

        getGroupId: function() {
            return groupId;
        },

        getX: function() {
            return x;
        },

        getY: function() {
            return y;
        },

        isVisited() {
            return ctx.visited;
        },

        setVisited() {
            ctx.visited = true;
        },

        removeSide(sideId) {
            switch(sideId) {
                case 0:
                  ctx.walls.north = false;
                  break;
                case 1:
                  ctx.walls.east = false;
                  break;
                case 2:
                  ctx.walls.south = false;
                  break;
                case 3:
                  ctx.walls.west = false;
                  break;
              }
        },

        checkSide(sideId) {
            switch(sideId) {
                case 0:
                  return ctx.walls.north;
                  break;
                case 1:
                  return ctx.walls.east;
                  break;
                case 2:
                  return ctx.walls.south;
                  break;
                case 3:
                  return ctx.walls.west;
                  break;
              }
        }
    };

    return that;
}