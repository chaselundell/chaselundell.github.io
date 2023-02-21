MyGame.render.Player = (function(graphics) {
    'use strict';

    function render(spec) {
        graphics.drawPlayer(spec);
    }

    return {
        render: render
    };
}(MyGame.graphics));
