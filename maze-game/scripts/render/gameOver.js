MyGame.render.GameOver = (function(graphics) {
    'use strict';

    function render(score) {
        graphics.drawGameOver(score);
    }

    return {
        render: render
    };
}(MyGame.graphics));
