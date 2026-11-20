// DM2008 — Activity 4b [Guided]
// Objects in Motion (50 min)
//
// You have a working Agent class to start with — your job is to bring it to life.
// Each agent moves, changes over time, and is drawn to the screen.
// Mouse click adds a new agent. C clears them all.
//
// Things to try:
// - Change the starting values (size, speed, color) to see what happens
// - Make agents bounce instead of wrap — what needs to change?
// - Add a second method to your class beyond update() and show()
//
// Stretch: give each agent a lifespan — shrink or fade it over time, then remove it.
// Hint: a backward loop lets you safely splice items while iterating.

let agents = [];
const NUM_START = 12;

function setup() {
  createCanvas(600, 400);
  noStroke();

  for (let i = 0; i < NUM_START; i++) {
    let x = random(width);
    let y = random(height);
    let sz = random(30, 40);
    let change_sz = random(-0.2, 0.2);
    let speedX = random(-3, 3);
    let speedY = random(-3, 3);
    agents.push(new Agent(x, y, sz, change_sz, speedX, speedY));
  }
}

function draw() {
  background(230);

  for (let i = agents.length - 1; i >= 0; i--) {
    agents[i].update();
    agents[i].show();

    if (agents[i].sz <= 0 || agents[i].sz >= 80) {
      agents.splice(i, 1);
    }
  }
}

function mousePressed() {
  // add 3 agents at the mouse each click
  for (let i = 0; i < 3; i++) {
    let sz = random(30, 50);
    let change_sz = random(-0.2, 0.2);
    let speedX = random(-3, 3);
    let speedY = random(-3, 3);
    agents.push(new Agent(mouseX, mouseY, sz, change_sz, speedX, speedY));
  }
}

function keyPressed() {
  // Replacing the array with an empty one effectively clears all agents
  if (key == "C" || key == "c") {
    agents = [];
  }
}

class Agent {
  constructor(x, y, sz, change_sz, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.sz = sz;
    this.change_sz = change_sz;
    this.dx = speedX;
    this.dy = speedY;
    this.col = random(255); // a color value that will change over time
  }

  update() {
    // move
    this.x += this.dx;
    this.y += this.dy;

    // change size and colour over time
    this.sz += this.change_sz;
    this.col = (this.col + 1) % 255;

    // bounce off the edges
    let r = this.sz / 2;
    if (this.x > width - r) {
      this.x = width - r;
      this.dx *= -1;
    }
    if (this.x < r) {
      this.x = r;
      this.dx *= -1;
    }
    if (this.y > height - r) {
      this.y = height - r;
      this.dy *= -1;
    }
    if (this.y < r) {
      this.y = r;
      this.dy *= -1;
    }
  }

  show() {
    fill(this.col, 150, 220);
    ellipse(this.x, this.y, this.sz);
  }
}