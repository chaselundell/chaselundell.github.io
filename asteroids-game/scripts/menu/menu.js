MyGame.menu = (function(objects, renderer, graphics, input) {
    'use strict';
    const BUTTON_WIDTH = graphics.canvas.width/8;
    const BUTTON_HEIGHT = 50;
    const SHIP_SIZE = 50
    let showMenu = true;
    let myKeyboard = input.Keyboard();
    let myMouse = input.Mouse();
    let currentMenuItem = "main";
    let buttons = [];
    let audioPlayer = new objects.AudioPlayer();
    buttons.push(objects.MenuButton(BUTTON_WIDTH, BUTTON_HEIGHT, "", ((graphics.canvas.width/2) - (BUTTON_WIDTH/2)), (graphics.canvas.height * .15), "images/button.jpg", "images/button_pressed.jpg", "New Game"));
    buttons.push(objects.MenuButton(BUTTON_WIDTH, BUTTON_HEIGHT, "", ((graphics.canvas.width/2) - (BUTTON_WIDTH/2)), (graphics.canvas.height * .3), "images/button.jpg", "images/button_pressed.jpg", "Controls"));
    buttons.push(objects.MenuButton(BUTTON_WIDTH, BUTTON_HEIGHT, "", ((graphics.canvas.width/2) - (BUTTON_WIDTH/2)), (graphics.canvas.height * .45), "images/button.jpg", "images/button_pressed.jpg", "High Scores"));
    buttons.push(objects.MenuButton(BUTTON_WIDTH, BUTTON_HEIGHT, "", ((graphics.canvas.width/2) - (BUTTON_WIDTH/2)), (graphics.canvas.height * .6), "images/button.jpg", "images/button_pressed.jpg", "Credits"));
    
    buttons.push(objects.MenuButton(graphics.canvas.width/14, BUTTON_HEIGHT, "", (graphics.canvas.width * .1), (graphics.canvas.height * .1), "images/button.jpg", "images/button_pressed.jpg", "Music"));

    buttons.push(objects.MenuButton(SHIP_SIZE, SHIP_SIZE, "", (graphics.canvas.width * .2), (graphics.canvas.height * .8), "images/spaceship_1.png", "images/spaceship_1.png", ""));
    buttons.push(objects.MenuButton(SHIP_SIZE, SHIP_SIZE, "", (graphics.canvas.width * .4), (graphics.canvas.height * .8), "images/blue_ship.png", "images/blue_ship.png", ""));
    buttons.push(objects.MenuButton(SHIP_SIZE, SHIP_SIZE, "", (graphics.canvas.width * .6), (graphics.canvas.height * .8), "images/Titan.png", "images/Titan.png", ""));
    buttons.push(objects.MenuButton(SHIP_SIZE, SHIP_SIZE, "", (graphics.canvas.width * .8), (graphics.canvas.height * .8), "images/spaceship_4.png", "images/spaceship_4.png", ""));
    buttons[buttons.length - 1].shipSelected = true;
    let shipSelected = "images/spaceship_4.png";
//Controls, High Scores, Credits
    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
        myMouse.update(elapsedTime);
    }

    let mouseCapture = false;
    myMouse.register('mousedown', function(e, elapsedTime) {
        mouseCapture = true;
        buttons.forEach(function(btn){
            if(btn.clicked(e.pageX, e.pageY)) {
                if(btn.btnText === "New Game") {
                    btn.pressed = true;
                } else if(btn.btnText === "") {
                    buttons.forEach(btn => btn.shipSelected = false);
                    btn.shipSelected = true;
                    shipSelected = btn.imageSrc;
                } else if(btn.btnText === "Music") {
                    audioPlayer.playSound("music");
                } else {
                    currentMenuItem = btn.btnText;
                }
            }
        });
    });

    myMouse.register('mouseup', function(e, elapsedTime) {
        mouseCapture = false;
        buttons.forEach(function(btn){
            if(btn.clicked(e.pageX, e.pageY)) {
                if(btn.btnText === "New Game") {
                    btn.pressed = false;
                    showMenu = false;
                }
            }
        });
    });

    myMouse.register('mousemove', function(e, elapsedTime) {
        if (mouseCapture) {
            console.log("captured!")
        }
    });

    function returnToMainMenu() {
        currentMenuItem = "main";
    }

    myKeyboard.register('Escape', returnToMainMenu);

    function update(elapsedTime) {

    };

    function render(){
        renderer.Menu.render(currentMenuItem, buttons);
    };
    

    function menuLoop(elapsedTime) {
        if(showMenu) {
            processInput(elapsedTime);
            update(elapsedTime);
            render();

        }
        requestAnimationFrame(menuLoop);

    }

    let that = {
        get showMenu() { return showMenu; },
        set showMenu(value) { showMenu = value; },
        get shipSelected() { return shipSelected; }
    };

    requestAnimationFrame(menuLoop);

    return that;
}(MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input));