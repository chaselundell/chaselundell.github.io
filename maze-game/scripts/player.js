function Player(position, imageSource) {
    let image = new Image();
    image.isReady = false;
    image.onload = function() {
        this.isReady = true;
    };
    image.src = imageSource;

    function moveUp() {
        return {x: position.x, y: position.y - 1};
    }

    function moveDown() {
        return {x: position.x, y: position.y + 1};
    }

    function moveLeft() {
        return {x: position.x - 1, y: position.y};
    }

    function moveRight() {
        return {x: position.x + 1, y: position.y};
    }
    
    var that = {
        moveUp: moveUp,
        moveDown: moveDown,
        moveLeft: moveLeft,
        moveRight:moveRight,

        getMove: function(direction) {
            switch(direction) {
                case 0:
                  return moveUp();
                case 1:
                  return moveRight();
                case 2:
                  return moveDown();
                case 3:
                  return moveLeft();
              }
        },

        getBorderColor: function() {
            return borderColor;
        },

        getFillColor: function() {
            return fillColor;
        },

        setDirection: function(d) {
            direction = d;
        },

        getDirection: function() {
            return direction;
        },

        getPosition: function() {
            return position;
        },

        setPosition: function(pos) {
            position = pos
        },
        
        getImage: function() {
            return image;
        }
    };

    return that;
}