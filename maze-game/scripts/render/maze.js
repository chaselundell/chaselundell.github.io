MyGame.render.Maze = (function(graphics) {
    'use strict';

    function render(spec) {
        graphics.drawMaze(spec);
    }

    function renderBackground() {
        graphics.drawBackground();
    }

    return {
        render: render,
        renderBackground: renderBackground
    };
}(MyGame.graphics));
