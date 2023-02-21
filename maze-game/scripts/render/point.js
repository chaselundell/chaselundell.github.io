MyGame.render.Point = (function(graphics) {
    'use strict';

    function render(spec) {
        graphics.drawPoint(spec);
    }

    return {
        render: render
    };
}(MyGame.graphics));
