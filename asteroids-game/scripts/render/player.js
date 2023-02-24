MyGame.render.Player = (function(graphics) {
    'use strict';

    function render(spec) {
        graphics.drawSpaceObject(spec);
    }

    return {
        render: render
    };
}(MyGame.graphics));
