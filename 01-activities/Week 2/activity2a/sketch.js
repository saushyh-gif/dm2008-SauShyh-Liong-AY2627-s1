// DM2008 — Activity 2a [Guided]
// Mode Switch (20 min)
//
// Keys 1, 2, 3 switch between modes — each one changes the background color.
// Try extending each mode to also change the fill, size, or speed of the ellipse.
// Keep it simple: one clear change per mode that's easy to see on screen.
//
// Stretch: add a 4th mode, or make the ellipse change shape between modes.

// DM2008 — Activity 2a [Guided]
// Mode Switch (20 min)
//
// Keys 1, 2, 3 switch between modes — each one changes the background color.
// Try extending each mode to also change the fill, size, or speed of the ellipse.
// Keep it simple: one clear change per mode that's easy to see on screen.
//
// Stretch: add a 4th mode, or make the ellipse change shape between modes.

let x = 0;       // ellipse x-position
let size = 50;   // ellipse size
let speed = 2;   // how far the ellipse moves each frame
let bgColor;     // background color, changed by key presses
let ballColor;   // ellipse color, changed by key presses

function setup() {
  createCanvas(400, 400);
  bgColor = color(220);
  ballColor = color(0);
}

function draw() {
  background(bgColor);
  fill(ballColor);

  if (mouseIsPressed) {
    rectMode(CENTER);
    rect(x, height / 2, size);
  } else {
    ellipse(x, height / 2, size);
  }

  // Move the shape
  x += speed;

  // Wrap around when it exits the right edge
  if (x > width + size / 2) {
    x = 0;
  }
}

// Keys 1, 2, 3 set the speed mode
function keyPressed() {
  switch (key) {
    case "1":
      bgColor = color(200, 100, 100);
      ballColor = color(255);
      speed = 1;
      break;
    case "2":
      bgColor = color(100, 200, 100);
      ballColor = color(255, 255, 0);
      speed = 4;
      break;
    case "3":
      bgColor = color(100, 100, 200);
      ballColor = color(255, 150, 0);
      speed = 8;
      break;
    default:
      bgColor = color(220); // grey
      ballColor = color(0);
      speed = 2;
  }
}
