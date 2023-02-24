MyGame.objects.AudioPlayer = class {
    constructor () {
        
    }

    pauseSound(whichSound) {
        MyGame.sounds[whichSound].pause();
    }
    
    playSound(whichSound) {
        MyGame.sounds[whichSound].play();
    }
    
    changeVolume(whichSound, value) {
        MyGame.sounds[whichSound].volume = value / 100;
    }

    restartSound(whichSound) {
        MyGame.sounds[whichSound].currentTime = 0;
    }
}
//------------------------------------------------------------------
//
// This function performs the one-time game initialization.
//
//------------------------------------------------------------------
function initialize() {
    'use strict';

    function loadSound(source) {
        let sound = new Audio();
        sound.src = source;
        return sound;
    }

    function loadAudio() {
        MyGame.sounds = {}
        MyGame.sounds['alien'] = loadSound('audio/alien.flac');
        MyGame.sounds['explosion'] = loadSound('audio/explosion.wav');
        MyGame.sounds['music'] = loadSound('audio/bensound-endlessmotion.mp3');
        MyGame.sounds['hyperspace'] = loadSound('audio/hyperspace.wav');
        MyGame.sounds['laser'] = loadSound('audio/laser.wav');
        MyGame.sounds['gunshot'] = loadSound('audio/gunshot.wav');
        MyGame.sounds['shipThrust'] = loadSound('audio/shipthrust.ogg');
        for(let sound in MyGame.sounds) {
            MyGame.sounds[sound].volume = 40/100;
        }
    }
    loadAudio();
}