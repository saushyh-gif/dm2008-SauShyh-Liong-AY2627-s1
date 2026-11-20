// DM2008 — Activity 1b [Georg Nees]
// Learning By Making (30 min)

let x;
let y;
let w;
let r;
let g;
let b;

function setup() {
  createCanvas(500, 500)
}

function draw() {
  background(240,70);
  x = mouseX;
  y = mouseY;
  w = 250;
  r = 255;
  g = random(100, 200);
  b = random(50);
  
  stroke(r, g, b);
  strokeWeight(30);
  noFill();
  ellipse(x, y, w);
  ellipse(width-x, height-y, w);
}


function keyPressed() {
    saveCanvas("activity1b-image", "jpg");
}