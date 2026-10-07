// DM2008 — Mini Project
// FLAPPY BIRD (Starter Scaffold)
//
// Complete this scaffold into a playable game.
// Your game should have player control, collision detection,
// score tracking, and at least two game states.
//
// Not sure where to start? Try this order:
// 1. Get the bird flapping — add control in keyPressed()
// 2. Get pipes spawning — uncomment the spawn logic in draw()
// 3. Add collision detection between the bird and pipes
// 4. Add scoring when the bird passes a pipe
// 5. Add game states — at minimum a playing state and a game over state
//
// Stretch: add a start screen, a high score, or a difficulty curve.

/* ----------------- Globals ----------------- */
let bird;
let pipes = [];
let score = 0;
let spawnCounter = 0;
let highscore = 0;

const SPAWN_RATE = 90;
const PIPE_SPEED = 2.5;
const PIPE_GAP = 120;
const PIPE_W = 60;

// Game states: "playing" or "gameover" — add more if you need them
let gameState = "start";

/* ----------------- Setup & Draw ----------------- */
async function setup() {
  createCanvas(480, 640);
  imageMode(CENTER);
  flappybird = await loadImage("assets/flappybird.png");
  bird_bg = await loadImage("assets/flappybird_background.jpg");
  sound_wing = await loadSound("assets/sfx_wing.mp3");
  sound_point = await loadSound("assets/sfx_point.mp3");
  sound_die = await loadSound("assets/sfx_die.mp3");
  noStroke();
  bird = new Bird(120, height / 2);
  pipes.push(new Pipe(width + 40));
}

function draw() {
  image(bird_bg, width / 2, height / 2, width, height);

  if (gameState === "playing") {
    bird.update();

    // Spawn a new pipe every SPAWN_RATE frames, then reset the counter
    spawnCounter++;
    if (spawnCounter >= SPAWN_RATE) {
      pipes.push(new Pipe(width + 40));
      spawnCounter = 0;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();

      // When the bird hits a pipe, trigger game over
      if (pipes[i].hits(bird)) {
        // What should happen when the game ends?
        sound_die.play();
        gameState = "gameover";
      }

      // When the bird passes a pipe, increment the score
      // Hint: use pipes[i].passed to make sure you only score once per pipe
      if (!pipes[i].passed && pipes[i].x + pipes[i].w < bird.pos.x) {
        // increment score here
        pipes[i].passed = true;
        score += 1;
        sound_point.play();
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    bird.show();

    // Display the score — look up textAlign() and textSize() in the p5.js reference
    textSize(38);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    fill("white");
    text(score, width / 2, height / 7);
  }

  if (gameState === "gameover") {
    if (score > highscore) {
      highscore = score;
    }
    // What should the player see when the game ends?
    textAlign(CENTER, CENTER);
    textStyle(BOLD);

    fill(77, 130, 46);
    textSize(50);
    text("GAME OVER", width / 2, height / 3);
    // How do they restart?

    fill("white");
    textSize(30);
    text("Press SPACE to Restart", width / 2, (height * 3) / 4);
    text("Best: " + highscore, width / 2, height / 2 + 40);
    text("Score: " + score, width / 2, height / 2);
  }

  if (gameState === "start") {
    // Start menu
    bird.show();
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    fill(77, 130, 46);
    textSize(50);
    text("FLAPPY BIRD", width / 2, height / 3);
    fill("white");
    textSize(30);
    text("Press SPACE to Start", width / 2, (height * 3) / 4);
  }
}

/* ----------------- Input ----------------- */
function keyPressed() {
  // Make the bird flap on space or UP_ARROW — call bird.flap()
  if (key === " ") {
    if (gameState === "start") {
      gameState = "playing";
      bird.flap(); // so the bird doesn't drop immediately
    } else if (gameState === "playing") {
      bird.flap();
    } else if (gameState === "gameover") {
      resetGame();
      gameState = "start"; // back to the menu
    }
  }
}

function resetGame() {
  bird = new Bird(120, height / 2);
  pipes = [new Pipe(width + 40)];
  score = 0;
  spawnCounter = 0;
}

/* ----------------- Classes ----------------- */
class Bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 16;
    this.gravity = 0.45;
    this.flapStrength = -8.0;
  }

  applyForce(fy) {
    this.acc.y += fy;
  }

  flap() {
    // A negative y velocity moves the bird upward
    this.vel.y = this.flapStrength;
    sound_wing.play();
  }

  update() {
    this.applyForce(this.gravity);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Keep the bird within the canvas vertically
    if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y = 0;
    }

    // Touching the ground is game over — same as hitting a pipe
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y = 0;
      sound_die.play();
      gameState = "gameover";
    }
  }

  show() {
    image(flappybird, this.pos.x, this.pos.y, this.r * 6, this.r * 6);
  }
}

class Pipe {
  constructor(x) {
    this.x = x;
    this.w = PIPE_W;
    this.speed = PIPE_SPEED;

    const margin = 40;
    const gapY = random(margin, height - margin - PIPE_GAP);
    this.top = gapY;
    this.bottom = gapY + PIPE_GAP;

    this.passed = false;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    fill(103, 173, 62);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height - this.bottom);
  }

  offscreen() {
    // 'return' sends a value back to wherever this method was called
    // We'll cover this properly next week, for now just know it gives back true or false
    return this.x + this.w < 0;
  }

  // Checks if the bird overlaps with either pipe rectangle
  // 1) Is the bird within the pipe's x range?
  // 2) If yes, is it outside the gap — above the top or below the bottom?
  hits(bird) {
    // This method also uses 'return' — coming up next week!
    const withinX =
      bird.pos.x + bird.r > this.x && bird.pos.x - bird.r < this.x + this.w;
    const aboveGap = bird.pos.y - bird.r < this.top;
    const belowGap = bird.pos.y + bird.r > this.bottom;
    return withinX && (aboveGap || belowGap);
  }
}