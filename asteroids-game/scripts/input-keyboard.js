MyGame.input.Keyboard = function () {
    let that = {
        keys: {},
        handlers: {}
    };

    function keyPress(e) {
        if(e.key != ' '){
            that.keys[e.key] = e.timeStamp;
        }
    }

    function keyRelease(e) {
        if(e.key === ' '){
            that.keys[e.key] = e.timeStamp;
        }else {
            delete that.keys[e.key];
        }
    }

    that.update = function (elapsedTime) {
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key)) {
                if (that.handlers[key]) {
                    that.handlers[key](elapsedTime);
                    if(key === ' ') delete that.keys[key];
                }
            }
        }
    };

    that.register = function (key, handler) {
        that.handlers[key] = handler;
    };

    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);

    return that;
};
