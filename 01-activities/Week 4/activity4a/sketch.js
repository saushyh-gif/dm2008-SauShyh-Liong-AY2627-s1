// DM2008 — Activity 4a [Guided]
// Bake a Cookie (30 min)
//
// A class is a blueprint — Cookie describes what every cookie has and can do.
// Your job is to complete the class, then add movement and a flavor randomizer.
//
// Suggested order:
// 1. Add the missing properties to the constructor (sz, x, y)
// 2. Fix show() so it uses this.flavor, this.x, this.y, this.sz
// 3. Implement move() and randomFlavor()
// 4. Wire them up in keyPressed() and mousePressed()
//
// Stretch: add a second cookie with different starting values.

let cookie;
let flav = ["chocolate", "vanilla", "milk", "strawberry"];

function setup() {
  createCanvas(400, 400);
  noStroke();
  cookie = new Cookie("chocolate", 80, width / 2, height / 2);
}

function draw() {
  background(230);

  // hold a key to keep moving
  if (keyIsPressed) {
    if (key == "a") {
      cookie.moveleft();
    } else if (key == "d") {
      cookie.moveright();
    } else if (key == "w") {
      cookie.moveup();
    } else if (key == "s") {
      cookie.movedown();
    }
  }

  cookie.show();
}

class Cookie {
  constructor(flavor, sz, x, y) {
    this.flavor = flavor;
    this.sz = sz;
    this.x = x;
    this.y = y;
    this.speed = 3;
  }

  show() {
    switch (this.flavor) {
      case "chocolate":
        fill(196, 146, 96);
        break;
      case "vanilla":
        fill(255, 223, 150);
        break;
      case "milk":
        fill(240, 220, 190);
        break;
      case "strawberry":
        fill(250, 170, 180);
        break;
      default:
        fill(220, 180, 120);
    }
    ellipse(this.x, this.y, this.sz);

    // chocolate chips
    fill(90, 50, 30);
    ellipse(this.x - this.sz * 0.2, this.y - this.sz * 0.15, this.sz * 0.12);
    ellipse(this.x + this.sz * 0.2, this.y - this.sz * 0.1, this.sz * 0.12);
    ellipse(this.x, this.y + this.sz * 0.2, this.sz * 0.12);
    ellipse(this.x - this.sz * 0.15, this.y + this.sz * 0.1, this.sz * 0.08);
  }

  moveleft() {
    if (this.x > this.sz / 2) {
      this.x -= this.speed;
    }
  }

  moveright() {
    if (this.x < width - this.sz / 2) {
      this.x += this.speed;
    }
  }

  moveup() {
    if (this.y > this.sz / 2) {
      this.y -= this.speed;
    }
  }

  movedown() {
    if (this.y < height - this.sz / 2) {
      this.y += this.speed;
    }
  }

  // pick a random flavour from the flav array
  randomFlavor() {
    this.flavor = random(flav);
  }
}

// Click to give the cookie a random flavour
function mousePressed() {
  cookie.randomFlavor();
}
