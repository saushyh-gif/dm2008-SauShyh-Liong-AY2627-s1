// DM2008 — Activity 3b
// One Function Wonder (20 min)
//
// Write a function that draws a shape or group of shapes.
// It should take at least one parameter — try x, y, size, or color.
// Call it several times with different values to create variation.
//
// Ideas: a simple face, a flower, a house, an icon.
// Example: myShape(100, 200, 50); myShape(300, 200, 80);
//
// Stretch: call your function inside a for loop to create a repeating pattern.


let angle = 0

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
}

function draw() {
  background(30);
  noStroke();

  // Call your function here with different values each time
  myShape(color("#41abfb"), color("#9ef24a"), 80, 80, 60)
  myShape(color("#f06449"), color("#ffd23f"), 320, 80, 60)
  myShape(color("#ffd23f"), color("#41abfb"), 200, 200, 120)
  myShape(color("#9ef24a"), color("#f06449"), 80, 320, 60)
  myShape(color("#ffffff"), color("#41abfb"), 320, 320, 60)

  angle--
}

// Define your function outside draw()
// It can be called from anywhere in your sketch

function myShape(c1, c2, x, y, s) {
  push()
  translate(x, y);
  fill(c1);
  rect(0, 0, s, s);

  rotate(radians(angle));
  scale(0.7,0.7)
  fill(c2)
  rect(0,0,s,s)
  pop()
}

function keyPressed() {
  if (key == 's') {
    saveCanvas('activity3b-image03', 'jpg');
  }
}

