MyGame.render.Menu = (function(graphics) {
    'use strict';

    function render(menuItem, buttons) {
        switch(menuItem) {
            case "main":
                graphics.drawMainMenu(buttons);
                break;
            case "Controls":
                graphics.drawControls();
                break;
            case "High Scores":
                graphics.drawHighScores();
                break;
            case "Credits":
                graphics.drawCredits();
                break;
          }
    }

    return {
        render: render
    };
}(MyGame.graphics));
