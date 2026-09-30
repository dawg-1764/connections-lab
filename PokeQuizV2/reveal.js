//State variables
//"idle" | "shaking" | "flash" | "resting"
let revealState = "idle";
let stateStartTime = 0;

//Boolean to communicate back with quiz.js if reveal is done 
let onRevealDone = null;

//Variables for the Pokebal shaking
let shakeTimeouts = [];
const SHAKE_DURATION = 3000;  // milliseconds
const FLASH_DURATION = 500;

//Image variables
let pokeballImg;
let openPokeballImg;

//Sound variables
let shakeSound;
let catchSound;

//Preload sounds
function preload() {
    shakeSound = new Audio("SoundEffects/shake.mp3");
    catchSound = new Audio("SoundEffects/catch.mp3");

    pokeballImg = loadImage("Media/Pokeball.png");
    openPokeballImg = loadImage("Media/openPokeball.png");
}

//Set the interaction with HTML and the clickability of the canvas
function setup() {
    let canvas = createCanvas(280, 280);
    canvas.parent("reveal-canvas");
    canvas.mousePressed(handleBallClick);
}

//Draw loop
function draw() {
    clear();

    //Nothing to draw until quiz.js starts the animation
    if (revealState === "idle") {
        return;
    }

    let elapsed = millis() - stateStartTime;

    //Ball is shaking
    if (revealState === "shaking") {
        drawPokeball(elapsed, true);
        if (elapsed > SHAKE_DURATION) {
            revealState = "flash";
            stateStartTime = millis();
        }
    }

    //Ball has finished shaking, flashes and then opens
    else if (revealState === "flash") {
        drawOpenBall(elapsed, true);
        drawFlash(elapsed);
        if (elapsed > FLASH_DURATION - 200) {
            playCatchSound();
            revealState = "resting";

            //Attach clickable property to element
            document.querySelector('#reveal-canvas').classList.add('clickable');

            if (onRevealDone) {
                let callback = onRevealDone;
                onRevealDone = null;
                callback();
            }
        }
    }

    //Idle ball, waiting for the user to click it to restart the quiz
    else if (revealState === "resting") {
        if (openPokeballImg) {
            drawOpenBall();
        }
    }
}

// Called from quiz.js. Runs `callback` once the animation finishes.
function playRevealAnimation(callback) {
    //Remove the "clickable" class from the canvas
    document.querySelector('#reveal-canvas').classList.remove('clickable');

    onRevealDone = callback;
    revealState = "shaking";
    stateStartTime = millis();


    // cancel any shake sounds still scheduled from a previous run (e.g. a fast retake)
    shakeTimeouts.forEach(id => clearTimeout(id));
    shakeTimeouts = [];

    // three shake clicks, spaced out across the wobble, like the real catch animation
    playShakeSound();
    shakeTimeouts.push(setTimeout(playShakeSound, SHAKE_DURATION / 3));
    shakeTimeouts.push(setTimeout(playShakeSound, (SHAKE_DURATION / 3) * 2));
}

//Draw the flash that appears when the shake ends
function drawFlash(elapsed) {
    let progress = elapsed / FLASH_DURATION;      // goes from 0 to 1
    noStroke();
    fill(255, 255, 255, 255 * (1 - progress));    // fades out as it grows
    circle(width / 2, height / 2, 320 * progress);
}

//Draw Pokeball
function drawPokeball(elapsed, shaking) {
    push();
    translate(width / 2, height / 2);

    if (shaking) {
        // wobble side to side; sin() naturally slows down and speeds up like a real shake
        let wobble = sin(elapsed * 0.02) * 14;
        rotate(radians(wobble));
    }

    imageMode(CENTER);
    image(pokeballImg, 0, 0, 160, 160);

    pop();
}

//Draw Open Pokeball
function drawOpenBall() {
    push();
    translate(width / 2, height / 2);
    imageMode(CENTER);
    image(openPokeballImg, 0, 0, 160, 160);
    pop();
}

//Checks to see if ball is ready to be clicked and clicked
function handleBallClick() {
    if (revealState === "resting") {
        playReturnSound(); // Sound function from quiz.js
        restart();         // Restart function from quiz.js
    }
}

//Play the shake sound effect
function playShakeSound() {
    shakeSound.currentTime = 0;
    shakeSound.play();
}

//Play the catch sound effect
function playCatchSound() {
    shakeSound.currentTime = 0;
    catchSound.play();
}