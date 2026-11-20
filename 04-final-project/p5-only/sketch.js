let sky;
let jar;
let swarm;
let hand;

// app states: "start" to "running"
let appState = "start";

let startFireflies = 25;
let maxFireflies = 80;
let cycleLength = 3600; // day - night loop
let trailLength = 12; // how many past positions each firefly remembers
let syncStrength = 0.4; // how strongly a flash pulls the others into rhythm
let calmRate = 0.004; // how fast the swarm calms down after a disturbance
let shakeFrames = 20; // length of the "shakejar" jolt
let handIdleFrames = 300; // hand fades away after ~5s without movement

function setup() {
  createCanvas(windowWidth, windowHeight);

  sky = new Sky();
  jar = new Jar();
  hand = new Hand();
  swarm = new Swarm(startFireflies, jar);
}

function draw() {
  switch (appState) {
    case "start":
      runScene();
      drawTitle();
      break;

    case "running":
      hand.update();
      runScene();
      hand.show();
      drawHUD();
      break;
  }
}

// updates and draws
function runScene() {
  sky.update();
  jar.resize();
  swarm.update(hand, jar);
  jar.update(swarm.mood);

  sky.show();

  push();
  translate(jar.shakeX, jar.shakeY);
  jar.showBack(sky.nightAmount, swarm.averageGlow());
  swarm.show(sky.nightAmount);
  jar.showFront(sky.nightAmount);
  pop();
}

function keyPressed() {
  if (appState === "start") {
    appState = "running";
    return false;
  }

  if (key === " ") {
    // holding a key repeats keyPressed, so only shake once per press
    if (swarm.mood !== "shakejar" && swarm.mood !== "disturbed") {
      swarm.shakeJar();
    }
    return false; // stop the page from scrolling
  }
}

function keyReleased() {
  if (key === " ") {
    swarm.calmDown();
  }
}

function mousePressed() {
  if (appState === "start") {
    appState = "running";
    return;
  }

  // convert the mouse into "jar space" (the jar may be shaking)
  let jx = mouseX - jar.shakeX;
  let jy = mouseY - jar.shakeY;
  if (jar.contains(jx, jy)) {
    swarm.add(jx, jy);
  }
}

function drawTitle() {
  push();
  noStroke();
  textFont("Georgia, serif");
  textAlign(CENTER, CENTER);

  fill(245, 240, 210);
  // title in the centre
  textSize(96);
  text("Firefly Jar", width / 2, height / 2);

  // prompt sits just under the title
  fill(245, 240, 210);
  textSize(16);
  text("Click or Press any key to begin", width / 2, height / 2 + 70);

  // how to play
  fill(245, 240, 210);
  textSize(14);
  text(
    "Hold SPACE to shake the jar   ·   Click inside the jar to add a firefly   ·   Move the mouse to reach in",
    width / 2,
    height / 2 + 100
  );
  pop();
}

function drawHUD() {
  push();
  noStroke();
  textFont("Georgia, serif");
  textAlign(LEFT, BOTTOM);

  fill(245, 240, 210);
  textSize(32);
  text(swarm.fireflies.length + " Fireflies", 24, height - 22);
  pop();
}


// sky loops day and night, and draws the forest backdrop
class Sky {
  constructor() {
    // start in the late afternoon so night falls soon after opening
    this.t = cycleLength * 0.4;
    this.angle = 0;
    this.nightAmount = 0; // 0 = full day, 1 = full night
    this.phase = "day";

    this.stars = [];
    for (let i = 0; i < 120; i++) {
      this.stars.push(new Star());
    }

    // two layers of trees: hazy ones at the back, darker ones in front
    this.backTrees = [];
    for (let x = -0.05; x < 1.05; x += random(0.03, 0.06)) {
      this.backTrees.push(new Tree(x, random(0.25, 0.42), random(0.04, 0.07), 6));
    }
    this.frontTrees = [];
    for (let x = -0.05; x < 1.05; x += random(0.06, 0.11)) {
      this.frontTrees.push(new Tree(x, random(0.32, 0.55), random(0.06, 0.1), 20));
    }

    // wild fireflies far away in the forest
    this.wildFireflies = [];
    for (let i = 0; i < 30; i++) {
      this.wildFireflies.push(new WildFirefly());
    }
  }

  update() {
    this.t = (this.t + 1) % cycleLength;
    this.angle = (this.t / cycleLength) * PI * 2;

    // sin(angle) is the sun's height: 1 = noon, 0 = horizon, -1 = midnight
    let sunHeight = sin(this.angle);
    this.nightAmount = constrain(map(sunHeight, 0.35, -0.05, 0, 1), 0, 1);

    if (this.nightAmount > 0.5) {
      this.phase = "night";
    } else {
      this.phase = "day";
    }

    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].update();
    }
    for (let i = 0; i < this.wildFireflies.length; i++) {
      this.wildFireflies[i].update();
    }
  }

  show() {
    let n = this.nightAmount;
    let horizonY = height * 0.8;

    // sky gradient — day colours blend into night colours using map()
    noStroke();
    for (let y = 0; y < horizonY; y += 4) {
      let r = map(y, 0, horizonY, map(n, 0, 1, 120, 4), map(n, 0, 1, 205, 20));
      let g = map(y, 0, horizonY, map(n, 0, 1, 165, 8), map(n, 0, 1, 215, 32));
      let b = map(y, 0, horizonY, map(n, 0, 1, 170, 24), map(n, 0, 1, 180, 58));
      fill(r, g, b);
      rect(0, y, width, 4);
    }

    // stars only show at night
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].show(n);
    }

    this.drawSunAndMoon(horizonY);

    // back layer of trees (hazy)
    fill(map(n, 0, 1, 80, 14), map(n, 0, 1, 112, 24), map(n, 0, 1, 100, 38));
    for (let i = 0; i < this.backTrees.length; i++) {
      this.backTrees[i].show(horizonY);
    }

    for (let i = 0; i < this.wildFireflies.length; i++) {
      this.wildFireflies[i].show(n);
    }

    // front layer of trees (darker)
    fill(map(n, 0, 1, 45, 6), map(n, 0, 1, 72, 12), map(n, 0, 1, 60, 20));
    for (let i = 0; i < this.frontTrees.length; i++) {
      this.frontTrees[i].show(horizonY);
    }

    // forest floor
    fill(map(n, 0, 1, 55, 8), map(n, 0, 1, 76, 13), map(n, 0, 1, 58, 20));
    rect(0, horizonY, width, height - horizonY);
  }

  drawSunAndMoon(horizonY) {
    let arcW = width * 0.42;
    let arcH = height * 0.6;

    // sun follows the angle
    let sunX = width / 2 - cos(this.angle) * arcW;
    let sunY = horizonY - sin(this.angle) * arcH;
    let moonX = width / 2 + cos(this.angle) * arcW;
    let moonY = horizonY + sin(this.angle) * arcH;

    noStroke();

    fill(255, 235, 180, 50);
    ellipse(sunX, sunY, 110);
    fill(210, 225, 255, 30);
    ellipse(moonX, moonY, 80);
    fill(255, 244, 210);
    ellipse(sunX, sunY, 56);
    fill(236, 240, 225);
    ellipse(moonX, moonY, 38);
  }

}

class Star {
  constructor() {
    this.x = random(1);
    this.y = random(0.7);
    this.size = random(1, 2.5);
    this.twinkle = random(PI * 2);
    this.speed = random(0.02, 0.06);
  }

  update() {
    this.twinkle += this.speed;
  }

  show(night) {
    noStroke();
    fill(255, 255, 240, night * (140 + 100 * sin(this.twinkle)));
    ellipse(this.x * width, this.y * height, this.size);
  }
}

class Tree {
  constructor(x, h, w, sink) {
    this.x = x; // fraction of width
    this.h = h; // fraction of height
    this.w = w; // fraction of width
    this.sink = sink; // pixels below the horizon, so front trees sit lower
  }

  show(horizonY) {
    let x = this.x * width;
    let baseY = horizonY + this.sink;
    let w = this.w * width;
    let h = this.h * height;

    rect(x - w * 0.08, baseY - h * 0.15, w * 0.16, h * 0.15);
    for (let i = 0; i < 3; i++) {
      let tierBase = baseY - h * 0.12 - i * h * 0.25;
      let tierW = w * (1 - i * 0.25);
      triangle(x - tierW / 2, tierBase, x + tierW / 2, tierBase, x, tierBase - h * 0.45);
    }
  }
}


class WildFirefly {
  constructor() {
    this.x = random(1);
    this.y = random(0.55, 0.85);
    this.blink = random(PI * 2);
    this.speed = random(0.02, 0.05);
  }

  update() {
    this.blink += this.speed;
  }

  show(night) {
    let b = sin(this.blink);
    if (b > 0.6) {
      let a = map(b, 0.6, 1, 0, 180) * night;
      let x = this.x * width + sin(this.blink * 0.3) * 12; // slow drift
      let y = this.y * height;
      noStroke();
      fill(190, 255, 110, a * 0.25);
      ellipse(x, y, 14);
      fill(220, 255, 160, a);
      ellipse(x, y, 3);
    }
  }
}

class Jar {
  constructor() {
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeAmount = 0;
    this.shakePhase = 0;
    this.resize();
  }

  resize() {
    this.h = height * 0.58;
    this.w = constrain(this.h * 0.68, 0, width * 0.8);
    this.x = width / 2;
    this.bottomY = height * 0.88;
    this.y = this.bottomY - this.h / 2; // centre of the jar body
    this.radius = this.w * 0.16;
    this.neckW = this.w * 0.6;
    this.neckH = this.h * 0.07;

    let margin = 14;
    this.left = this.x - this.w / 2 + margin;
    this.right = this.x + this.w / 2 - margin;
    this.top = this.y - this.h / 2 + margin;
    this.bottom = this.bottomY - margin;
  }

  update(mood) {
    if (mood === "shakejar") {
      this.shakeAmount = 22; // big jolt
    } else if (mood === "disturbed") {
      this.shakeAmount = 10; // steady shaking while space is held
    } else {
      this.shakeAmount *= 0.85; // settle down
    }

    this.shakePhase += 0.9;
    this.shakeX = sin(this.shakePhase) * this.shakeAmount + random(-1, 1) * this.shakeAmount * 0.3;
    this.shakeY = cos(this.shakePhase * 1.3) * this.shakeAmount * 0.3;
  }

  contains(px, py) {
    return (
      px > this.x - this.w / 2 &&
      px < this.x + this.w / 2 &&
      py > this.y - this.h / 2 &&
      py < this.bottomY
    );
  }

  showBack(night, avgGlow) {
    push();
    rectMode(CENTER);
    noStroke();

    // the whole jar glows with the swarm, when they sync, the jar pulses
    let light = avgGlow * (0.3 + 0.7 * night);
    for (let i = 0; i < 4; i++) {
      fill(190, 255, 110, light * (18 - i * 4));
      ellipse(this.x, this.y, this.w * (1.3 + i * 0.45), this.h * (1.05 + i * 0.3));
    }

    fill(190, 225, 235, map(night, 0, 1, 35, 18));
    rect(this.x, this.y, this.w, this.h, this.radius);
    pop();
  }

  // drawn in front of the fireflies: glass outline, neck, cork
  showFront(night) {
    push();
    rectMode(CENTER);
    let topY = this.y - this.h / 2;

    // neck
    fill(190, 225, 235, 25);
    stroke(215, 240, 250, 120);
    strokeWeight(2.5);
    rect(this.x, topY - this.neckH / 2 + 4, this.neckW, this.neckH, 6);

    // body outline
    noFill();
    stroke(215, 240, 250, 130);
    strokeWeight(3);
    rect(this.x, this.y, this.w, this.h, this.radius);

    // rim
    fill(200, 230, 240, 60);
    rect(this.x, topY - this.neckH, this.neckW * 1.12, this.h * 0.025, 4);

    // cork lid (darker at night)
    let shade = map(night, 0, 1, 1, 0.45);
    let lidH = this.h * 0.07;
    fill(165 * shade, 118 * shade, 78 * shade);
    stroke(90 * shade, 60 * shade, 40 * shade);
    strokeWeight(2);
    rect(this.x, topY - this.neckH - lidH / 2 - 2, this.neckW * 0.9, lidH, 5);
    pop();
  }
}


class Hand {
  constructor() {
    this.x = -999;
    this.y = -999;
    this.lastX = 0;
    this.lastY = 0;
    this.radius = 150; // fireflies inside this distance fly away
    this.active = false;
    this.idle = 0; // frames since the mouse last moved
    this.fade = 0; // 0–1, used to fade the hand in and out
  }

  update() {
    if (mouseX !== this.lastX || mouseY !== this.lastY) {
      this.idle = 0;
    } else {
      this.idle++;
    }
    this.lastX = mouseX;
    this.lastY = mouseY;

    this.x = mouseX;
    this.y = mouseY;
    this.radius = height * 0.17;

    let inside = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
    this.active = inside && this.idle < handIdleFrames;

    if (this.active) {
      this.fade = constrain(this.fade + 0.08, 0, 1);
    } else {
      this.fade = constrain(this.fade - 0.03, 0, 1);
    }
  }

  show() {
    // the normal system mouse pointer is used as the cursor, so nothing is drawn here
  }
}

class Firefly {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(1, 0);
    this.vel.setHeading(random(PI * 2));

    this.calmSpeed = random(0.8, 1.4);
    this.speed = this.calmSpeed;
    this.size = random(5, 8);
    this.trail = [];

    // flashing: the timer counts up, and the firefly flashes when it reaches period
    this.period = random(110, 130);
    this.timer = random(this.period);
    this.glow = 0; // 1 right after a flash, then fades
    this.framesSinceFlash = 999;
    this.breath = random(PI * 2); // soft glow between flashes

    this.wingPhase = random(PI * 2); // so the wings don't all flap in step
  }

  // ease speed towards what the swarm's mood wants
  ease(speedFactor) {
    let target = this.calmSpeed * speedFactor;
    this.speed = this.speed * 0.94 + target * 0.06;
  }

  // randomised flight
  wander(turn) {
    this.vel.setHeading(this.vel.heading() + random(-turn, turn));
  }

  // fly away from the hand
  flee(hand) {
    if (!hand.active) {
      return false;
    }
    let d = dist(this.pos.x, this.pos.y, hand.x, hand.y);
    if (d < hand.radius) {
      let away = createVector(this.pos.x - hand.x, this.pos.y - hand.y);
      let strength = map(d, 0, hand.radius, 1.2, 0); // stronger when closer
      away.setMag(strength);
      this.vel.add(away);
      this.speed = constrain(this.speed + strength * 0.4, 0, 7);

      // a nervous firefly sometimes loses its rhythm
      if (random(1) < 0.005) {
        this.scramble();
      }
      return true;
    }
    return false;
  }

  move() {
    this.speed = constrain(this.speed, 0.3, 9);
    this.vel.setMag(this.speed);
    this.pos.add(this.vel);

    this.trail.push(createVector(this.pos.x, this.pos.y));
    if (this.trail.length > trailLength) {
      this.trail.splice(0, 1);
    }

    this.wingPhase += 0.5 + this.speed * 0.2;
  }

  // bounce off the glass walls
  checkEdges(jar, rattled) {
    let hit = false;
    if (this.pos.x < jar.left) {
      this.pos.x = jar.left;
      this.vel.x *= -1;
      hit = true;
    } else if (this.pos.x > jar.right) {
      this.pos.x = jar.right;
      this.vel.x *= -1;
      hit = true;
    }
    if (this.pos.y < jar.top) {
      this.pos.y = jar.top;
      this.vel.y *= -1;
      hit = true;
    } else if (this.pos.y > jar.bottom) {
      this.pos.y = jar.bottom;
      this.vel.y *= -1;
      hit = true;
    }
    if (hit && rattled) {
      this.glow = constrain(this.glow + 0.2, 0, 1);
    }
  }

  // counts up to the next flash
  updateFlash() {
    this.timer++;
    this.framesSinceFlash++;
    this.glow *= 0.92;
    this.breath += 0.05;

    if (this.timer >= this.period) {
      this.flash();
      return true;
    }
    return false;
  }

  flash() {
    this.glow = 1;
    this.timer = 0;
    this.framesSinceFlash = 0;
  }

  // seeing a neighbour flash pulls this firefly's timer forward.
  // fireflies close to flashing get pulled more — this is what makes them sync.
  nudge(strength) {
    this.timer += this.timer * strength;
  }

  // lose rhythm
  scramble() {
    this.timer = random(this.period);
  }

  show(night) {
    let vis = 0.3 + 0.7 * night; // faint in the day, fully lit at night
    let b = constrain(this.glow + 0.12 + 0.08 * sin(this.breath), 0, 1);

    noStroke();

    // trail
    for (let i = 0; i < this.trail.length; i++) {
      let p = this.trail[i];
      fill(190, 255, 110, map(i, 0, this.trail.length, 0, 70) * vis * (0.4 + 0.6 * b));
      ellipse(p.x, p.y, this.size * map(i, 0, this.trail.length, 0.3, 0.9));
    }

    // halo
    fill(190, 255, 100, b * vis * 45);
    ellipse(this.pos.x, this.pos.y, this.size * 5 * (0.5 + b));

    // body and wings
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    let flap = 0.3 + (0.7 * (sin(this.wingPhase) + 1)) / 2;
    let wingAlpha = constrain(map(night, 0, 1, 110, 55) + 90 * b, 0, 200);

    // back wings (small), then front wings (large)
    this.drawWing(-this.size * 0.35, 1, this.size * 1.6, this.size * 0.9, 0.9, flap, wingAlpha * 0.8);
    this.drawWing(-this.size * 0.35, -1, this.size * 1.6, this.size * 0.9, 0.9, flap, wingAlpha * 0.8);
    this.drawWing(-this.size * 0.05, 1, this.size * 2.4, this.size * 1.3, 0.35, flap, wingAlpha);
    this.drawWing(-this.size * 0.05, -1, this.size * 2.4, this.size * 1.3, 0.35, flap, wingAlpha);

    noStroke();
    fill(225, 255, 150, 200 + 55 * b);
    ellipse(0, 0, this.size * 1.7, this.size);
    fill(255, 255, 235, 150 + 105 * b);
    ellipse(this.size * 0.15, 0, this.size * 0.7);
    pop();
  }

  // side: 1 = one side of the body, -1 = the other side
  // sweep: how far the wing leans backwards
  drawWing(offsetX, side, len, wid, sweep, flap, alpha) {
    push();
    translate(offsetX, 0);
    rotate(side * sweep);
    fill(215, 245, 255, alpha * 0.55);
    stroke(255, 255, 255, alpha);
    strokeWeight(0.8);
    let l = len * flap;
    ellipse(0, (side * l) / 2, wid, l);
    pop();
  }
}

//   "shakejar" short jolt when space is first pressed
//   "disturbed" space is held, jar keeps shaking, no syncing possible
//   "settling" calming down, flashes slowly pull into rhythm
//   "resting" in sync, the whole swarm pulses as one
class Swarm {
  constructor(count, jar) {
    this.fireflies = [];
    for (let i = 0; i < count; i++) {
      this.fireflies.push(new Firefly(random(jar.left, jar.right), random(jar.top, jar.bottom)));
    }

    this.mood = "settling";
    this.moodTimer = 0;
    this.calm = 0; // 0–1, grows while settling
    this.coupling = 0; // how much fireflies influence each other right now
    this.fleeing = 0; // how many fireflies are fleeing the hand
    this.framesSinceSync = 0;
  }

  update(hand, jar) {
    let turn = 0.2;
    let speedFactor = 1;
    let n = this.fireflies.length;

    switch (this.mood) {
      case "shakejar":
        turn = 1.0;
        speedFactor = 4.5;
        this.coupling = 0;
        this.moodTimer--;
        if (this.moodTimer <= 0) {
          if (keyIsDown(" ")) {
            this.mood = "disturbed";
          } else {
            this.startSettling();
          }
        }
        break;

      case "disturbed":
        turn = 0.7;
        speedFactor = 3;
        this.coupling = 0;
        // safety net in case keyReleased was missed (e.g. window lost focus)
        if (!keyIsDown(" ")) {
          this.startSettling();
        }
        break;

      case "settling":
        turn = 0.2;
        speedFactor = 1;
        this.calm = constrain(this.calm + calmRate, 0, 1);
        this.coupling = this.calm;
        if (this.isSynced() && this.fleeing < n * 0.3) {
          this.mood = "resting";
          this.framesSinceSync = 0;
        }
        break;

      case "resting":
        turn = 0.12;
        speedFactor = 0.6;
        this.coupling = 1;
        // if the swarm stops flashing together, go back to settling
        if (this.isSynced()) {
          this.framesSinceSync = 0;
        } else {
          this.framesSinceSync++;
        }
        if (this.framesSinceSync > 200) {
          this.startSettling();
        }
        break;
    }

    // update every firefly and collect the ones that flashed this frame
    let flashed = [];
    let rattled = this.mood === "shakejar" || this.mood === "disturbed";
    this.fleeing = 0;

    for (let i = 0; i < n; i++) {
      let f = this.fireflies[i];
      f.ease(speedFactor);
      f.wander(turn);
      if (f.flee(hand)) {
        this.fleeing++;
      }
      if (this.mood === "shakejar") {
        // jolted around inside the jar
        f.vel.add(createVector(random(-1, 1), random(-1, 1)));
      }
      f.move();
      f.checkEdges(jar, rattled);

      // while shaking
      if (this.mood === "disturbed" && random(1) < 0.02) {
        f.scramble();
      }

      if (f.updateFlash()) {
        flashed.push(f);
      }
    }

    // pulse coupling
    if (this.coupling > 0 && flashed.length > 0) {
      let strength = (syncStrength * this.coupling) / n;
      for (let k = 0; k < flashed.length; k++) {
        for (let i = 0; i < n; i++) {
          if (this.fireflies[i].framesSinceFlash > 0) {
            this.fireflies[i].nudge(strength);
          }
        }
      }
    }

    // a hand hovering close by unsettles the swarm
    if (this.fleeing > n * 0.3 && (this.mood === "settling" || this.mood === "resting")) {
      this.calm = constrain(this.calm - 0.01, 0, 1);
      if (this.mood === "resting") {
        this.startSettling();
      }
    }
  }

  // in sync
  isSynced() {
    let count = 0;
    for (let i = 0; i < this.fireflies.length; i++) {
      if (this.fireflies[i].framesSinceFlash < 8) {
        count++;
      }
    }
    return count >= this.fireflies.length * 0.8;
  }

  shakeJar() {
    this.mood = "shakejar";
    this.moodTimer = shakeFrames;
    this.calm = 0;
    for (let i = 0; i < this.fireflies.length; i++) {
      let f = this.fireflies[i];
      f.flash(); // everyone lights up in alarm...
      f.scramble(); // ...then loses their rhythm
      f.vel.setHeading(random(PI * 2));
      f.speed = f.calmSpeed * 6;
    }
  }

  calmDown() {
    if (this.mood === "disturbed") {
      this.startSettling();
    }
    // if still in "shakejar", it moves to settling by itself when the jolt ends
  }

  startSettling() {
    this.mood = "settling";
    this.framesSinceSync = 0;
  }

  add(x, y) {
    if (this.fireflies.length >= maxFireflies) {
      return;
    }
    let f = new Firefly(x, y);
    f.glow = 1; // a little burst of light when it arrives
    this.fireflies.push(f);
  }

  averageGlow() {
    if (this.fireflies.length === 0) {
      return 0;
    }
    let total = 0;
    for (let i = 0; i < this.fireflies.length; i++) {
      total += this.fireflies[i].glow;
    }
    return total / this.fireflies.length;
  }

  show(night) {
    for (let i = 0; i < this.fireflies.length; i++) {
      this.fireflies[i].show(night);
    }
  }
}
