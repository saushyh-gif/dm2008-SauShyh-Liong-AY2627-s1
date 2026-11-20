// DM2008 — Activity 2b [Guided]
// Pattern Making (40 min)
//
// Use a for loop to draw a repeating row of shapes.
// Add a condition to introduce variation — alternating color, size, or spacing.
// Then add one interaction (mouse or key) that changes the rule.
//
// Stretch: try a second row, or turn your row into a 2D grid.

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(240);
  noStroke();

  for (let j = 0; j < height; j += 50) {
    for (let i = 0; i < width; i += 50) {
      if (j % 100 == 0) {
        // colour row
        if (mouseIsPressed) {
          if (i % 100 == 0) {
            fill('#264653');
          } else {
            fill('#e76f51');
          }
        } else {
          if (i % 100 == 0) {
            fill('#e76f51');
          } else {
            fill('#264653');
          }
        }
        ellipse(i + 25, j + 25, 40);
      } else {
        // size row
        fill('#2a9d8f');
        if (mouseIsPressed) {
          if (i % 100 == 0) {
            ellipse(i + 25, j + 25, 15);
          } else {
            ellipse(i + 25, j + 25, 40);
          }
        } else {
          if (i % 100 == 0) {
            ellipse(i + 25, j + 25, 40);
          } else {
            ellipse(i + 25, j + 25, 15);
          }
        }
      }
    }
  }
}