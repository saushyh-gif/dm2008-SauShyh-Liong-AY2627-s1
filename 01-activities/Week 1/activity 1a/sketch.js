// DM2008 — Activity 1a
// Simple Creatures (20 min)

// Run the sketch, then click on the preview to enable keyboard
// Use the 'Option' ('Alt' on Windows) key to view or hide the grid
// Use the 'Shift' key to change overlays between black & white
// Write the code for your creature within the space provided

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(180, 215, 150);

  fill(0, 200, 0);
  triangle(240, 224, 240, 288, 360, 272);

  ellipse(196, 240, 110, 140);

  ellipse(152, 136, 112, 80);

  rect(152, 304, 24, 48);
  rect(208, 304, 24, 48);

  ellipse(140, 225, 45, 18);
  ellipse(180, 235, 45, 18);

  fill(255, 0, 0);
  triangle(238, 192, 238, 216, 262, 204);
  triangle(246, 224, 246, 248, 270, 236);

  fill(0);
  ellipse(152, 124, 12);

  line(104, 152, 144, 152);

  fill(255);
  triangle(110, 152, 118, 152, 114, 160);
  triangle(122, 152, 130, 152, 126, 160);
  triangle(134, 152, 142, 152, 138, 160);
  
  helperGrid(); // do not edit or remove this line
}
