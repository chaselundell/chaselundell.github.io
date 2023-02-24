MyGame.objects.MenuButton = function(width, height, color, x, y, imageSrc, imagePressedSrc, btnText) {
    'use strict';
    let pressed = false;
    let imageReady = false;
    let shipSelected = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    };
    image.src = imageSrc;

    let imagePressedReady = false;
    let image2 = new Image();

    image2.onload = function() {
        imagePressedReady = true;
    };
    image2.src = imagePressedSrc;

    function clicked(clickX, clickY) {
        var leftEdge = x;
        var rightEdge = x + width;
        var topEdge = y;
        var bottomEdge = y + height;
        var clicked = true;
        if (clickX > rightEdge || clickX < leftEdge || clickY < topEdge || clickY > bottomEdge) {
            clicked = false;
        }
        return clicked;
    }

    let that = {
        clicked: clicked,
        get imageReady() { return imageReady; },
        get shipSelected() { return shipSelected; },
        get imageSrc() { return imageSrc; },
        get image() { if(pressed) 
                        return image2 
                      else return image; 
                    },
        get imagePressedReady() { return imagePressedReady; },
        get width() { return width; },
        get height() { return height; },
        get x() { return x; },
        get y() { return y; },
        get color() { return color; },
        set pressed(p) { pressed = p; },
        set shipSelected(sel) { shipSelected = sel; },
        get btnText() { return btnText; }
    };

    return that;
}