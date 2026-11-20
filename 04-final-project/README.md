# Final Project: Firefly Jar

A jar of fireflies sitting in a forest, made in p5.js. When left alone, the fireflies slowly start flashing together in rhythm, the way real fireflies sync up at night. Shaking the jar or reaching in with your hand scares them and breaks the rhythm, and they have to calm down and find it again.


## How to play

- Click or press any key on the title screen to begin
- Hold SPACE to shake the jar
- Click inside the jar to add a firefly (up to 80)
- Move the mouse near the jar to reach in, and the fireflies fly away from your hand

## How it works

- The background loops from day to night, with the sun and moon moving across the sky, stars at night and wild fireflies out in the forest
- Every firefly has its own timer and flashes when the timer runs out. When one firefly flashes, it nudges the others' timers forward, so over time they all start flashing together
- The swarm has different moods, switched with a `switch` statement:
  - **shakejar**: a short jolt when SPACE is first pressed, the fireflies get thrown around
  - **disturbed**: SPACE is still held, the jar keeps shaking and the fireflies can't sync
  - **settling**: the fireflies calm down and their flashes slowly pull into rhythm
  - **resting**: most of the fireflies are flashing together, and the jar glows with each flash
- Getting too close with the mouse sends the swarm back to settling
- The number of fireflies is shown in the bottom left corner

## Code structure

The sketch is split into classes, each with its own `show()` and `update()` methods:

- `Sky` for the day and night cycle, trees, stars and forest
- `Jar` for the glass jar and its shaking
- `Hand` for the mouse reaching into the jar
- `Firefly` for each firefly's movement, flashing, trail and wings
- `Swarm` for managing all the fireflies and their moods
