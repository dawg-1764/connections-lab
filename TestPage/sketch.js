//ml5
let classifier;

//webcam
let webcam;

//face detection
let faceMesh;
let faces = [];

//faceMesh options
let options = {
  maxFaces: 1,
  refineLandmarks: false,
  flipHorizontal: true,
};

//positions for face overlay
let minX, minY, maxX, maxY;

//visual transition
let staticState = "idle";

//terrain scan visuals
let cols = 80;
let rows = 65;
let noiseAmount = 50;
let smallBuffer;
let spacing = 8;
let depthScale = 90;

//presence smoothing
let facePresence = 0;

//box pulse on new classification
let boxPulse = 0;

//HTML element for scattered words
let labelDiv;

//voice object + list
var myVoice = new p5.Speech();
let voiceList = [0, 194, 22, 130, 116, 54, 68];

//sound objects
let staticSound;
let scannerSound;


//pre set phrases for computer to use
let phrases = [
  "hey there, nice looking ",
  "well hello, is that a ",
  "nice to meet you ",
  "wow, look at that ",
  "what a beautiful ",
  "greetings, fellow ",
  "how have you been ",
  "that's a fine looking ",
  "what a lovely ",
  "hello, my friend ",
  "wow, that's a stunning ",
];

async function setup() {
  createCanvas(500, 500, WEBGL);

  //webCam
  webcam = await createCapture(VIDEO, { flipped: true });
  webcam.size(640, 480);
  webcam.hide();

  //faceMesh
  faceMesh = await ml5.faceMesh(options);
  faceMesh.detectStart(webcam, gotFaces);

  //ml5
  classifier = await ml5.imageClassifier("doodlenet", { topk: 10 });

  //preset graphics
  smallBuffer = createGraphics(cols, rows);
  smallBuffer.pixelDensity(1);

  //html things
  labelDiv = createDiv("");
  labelDiv.position(0, 0);
  labelDiv.style("pointer-events", "none");
  labelDiv.hide();

  //sound
  staticSound = await loadSound("static.mp3");
  scannerSound = await loadSound("scanner.mp3");

  staticAudio = new Audio('static.mp3');
  staticAudio.loop = true;
  staticAudio.volume = 0;
}

function draw() {
  background(0);
  orbitControl();
  ortho(-width / 2, width / 2, -height / 2, height / 2, 0.1, 5000);

  // smoothly ease presence
  let target = faces.length > 0 ? 1 : 0;
  facePresence = lerp(facePresence, target, 0.05);

  boxPulse *= 0.9;

  push();
  rotateX(-PI / 2.6);
  drawTerrain();
  pop();

  drawFaceOverlay();

  if (frameCount % 180 == 0) {
    classifier.classify(webcam, gotResult);
  }
}

function drawTerrain() {
  smallBuffer.image(webcam, 0, 0, cols, rows);
  smallBuffer.loadPixels();
  noFill();

  let dynamicSpacing = width / cols; // terrain always spans full canvas width
  let dynamicDepthScale = height * 0.2; // scale bump height relative to screen size too

  for (let y = 0; y < rows; y++) {
    beginShape();
    for (let x = 0; x < cols; x++) {
      let i = (x + y * cols) * 4;
      let rawBrightness = smallBuffer.pixels[i] / 255;

      let idleWave = noise(x * 0.5, y * 0.5, frameCount * 0.1);
      let idleBrightness = 0.5 + (idleWave - 0.5) * 0.3;

      let brightness = lerp(idleBrightness, rawBrightness, facePresence);

      let px = (x - cols / 2) * dynamicSpacing;
      let pz = (y - rows / 2) * dynamicSpacing;

      let py = -brightness * dynamicDepthScale + noise(y * 5) * noiseAmount * facePresence;

      stroke(brightness * 255);
      vertex(px, py, pz);
    }
    endShape();
  }
}

function drawFaceOverlay() {
  if (faces.length === 0) {
    if (staticState === "idle") {
      playStaticLoop();
    }
    labelDiv.hide();
    return;
  } else {
    if (staticState === "playing" || staticState === "fadingIn") {
      stopStaticLoop();
    }
  }

  let face = faces[0];
  minX = Infinity; minY = Infinity;
  maxX = -Infinity; maxY = -Infinity;

  let scale = Math.min(width / webcam.width, height / webcam.height);
  let offsetX = (width - webcam.width * scale) / 2;
  let offsetY = (height - webcam.height * scale) / 2;

  for (let j = 0; j < face.keypoints.length; j++) {
    let kp = face.keypoints[j];
    let x = kp.x * scale + offsetX;
    let y = kp.y * scale + offsetY;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  let padding = 20; // extra pixels added on every side

  push();
  translate(-width / 2, -height / 2, 50);
  noFill();
  stroke(255, 0, 0);
  strokeWeight(2 + boxPulse * 6);
  rect(
    minX - padding,
    minY - padding,
    (maxX - minX) + padding * 2,
    (maxY - minY) + padding * 2
  );
  pop();

  labelDiv.show();
}

function gotResult(results) {
  console.log(results);
  boxPulse = 1;
  if (!scannerSound.isPlaying()) {
    scannerSound.play(0, 1, 1, 0, 5);
  } else {
    scannerSound.stop();
  }

  let boxWidth = maxX - minX;
  let boxHeight = maxY - minY;

  // scale margin range to the box's own size, so it stays meaningful on any screen
  let minMargin = boxWidth * 0.3;
  let maxMargin = boxWidth * 1.2;

  let html = "";

  // pick a random word, phrase and voice
  if (faces.length > 0) {
    let chosen = random(results);
    let phrase = random(phrases);
    let voice = voiceList[Math.floor(random(0, voiceList.length - 1))];
    myVoice.setVoice(voice);
    myVoice.speak(phrase + chosen.label);
  }

  results.forEach((r) => {
    let side = floor(random(4));
    let x, y;
    
    if (side === 0) { 
      x = random(minX, maxX);
      y = minY - random(minMargin, maxMargin);
    } else if (side === 1) {
      x = maxX + random(minMargin, maxMargin);
      y = random(minY, maxY);
    } else if (side === 2) {
      x = random(minX, maxX);
      y = maxY + random(minMargin, maxMargin);
    } else {
     x = minX - random(minMargin, maxMargin);
      y = random(minY, maxY);
    }

    html += `<span style="position:absolute; left:${x}px; top:${y}px; color:red; font-family:'Courier New', monospace; font-size:48px;">${r.label}</span>`;
  });

  labelDiv.html(html);
}

function gotFaces(results) {
  faces = results;
}

function playStaticLoop() {
  if (staticState === "fadingIn" || staticState === "playing") return;

  staticAudio.volume = 0;
  staticAudio.play();
  fadeAudio(staticAudio, 0.7, 1500);

  staticState = "fadingIn";
  setTimeout(() => {
    if (staticState === "fadingIn") staticState = "playing";
  }, 1500);
}

function stopStaticLoop() {
  if (staticState === "idle" || staticState === "fadingOut") return;

  fadeAudio(staticAudio, 0, 1500);
  staticState = "fadingOut";

  setTimeout(() => {
    staticAudio.pause();
    staticState = "idle";
  }, 1500);
}

function fadeAudio(audio, target, duration) {
  let start = audio.volume;
  let startTime = performance.now();

  function step(now) {
    let progress = Math.min((now - startTime) / duration, 1);
    let value = start + (target - start) * progress;
    audio.volume = Math.min(1, Math.max(0, value)); // clamp to valid 0-1 range
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function keyPressed() {
  if (key === 'f') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
  setTimeout(() => {
      resizeCanvas(windowWidth, windowHeight);
    }, 100);
}