// DM2008 — Activity 3a [Guided]
// Array Sampler (25 min)
//
// An array stores a list of values — here it's colors, but it could be
// sizes, positions, or anything else.
// Press any key to cycle through the array one item at a time.
//
// Try these:
// - Replace the colors with your own values (sizes, positions, text).
// - Use mousePressed() instead of keyPressed().
// - Use push() to add new items or splice() to remove them.
// - Loop through the whole array to draw all items at once.
//
// Stretch: visualize all items in the array simultaneously instead of one at a time.

let widths = [60, 100, 40, 120, 80];
let palette = ["#f06449", "#ffb400", "#009988", "#3c78d8"];

function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  background(30);

  let x = 0;
  for (let i = 0; i < widths.length; i++) {
    fill(palette[i % palette.length]);
    rect(x, 0, widths[i], height);
    x = x + widths[i]; // next stripe starts where this one ends
  }
}

function mousePressed() {
  widths.push(random(20, 100));
  console.log("Stripes:", widths.length);
}

function keyPressed() {
  if (widths.length > 1) {
    widths.splice(0, 1);
  }
  console.log("Stripes:", widths.length);
}

