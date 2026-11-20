# Mini Project: Flappy Bird

Turned the Flappy Bird starter code into a playable game in p5.js. Press SPACE to start, flap and restart.

Changes I made to the code:
- Added flapping on SPACE in keyPressed(), with different actions depending on the game state
- Uncommented the pipe spawning so a new pipe comes every 90 frames, and removed pipes once they go off screen
- Collision with a pipe or the ground now ends the game
- Scoring when the bird passes a pipe, using pipes[i].passed so each pipe only counts once
- Score displayed at the top of the screen while playing
- Added a resetGame() function to reset the bird, pipes, score and spawn counter

Things I added:
- Game states: added a "start" state on top of "playing" and "gameover", so there is a start menu, the game, and a game over screen
- High score: keeps track of the best score and shows it on the game over screen with the current score
- Images: flappy bird sprite for the bird and a background image instead of the plain background, loaded with async/await in setup()
- Sound: added p5.sound with a wing sound when flapping, a point sound when scoring and a die sound on game over
- Pipes coloured green to match the background

Things I struggled with:
- Loading images and sounds in setup() with await, the game would not run properly until everything had loaded
- The game over state kept getting triggered every frame at first, so I had to be careful about where the state changes happen
- The bird image is bigger than the actual hitbox (r), so collisions sometimes look slightly off
- Resetting everything properly on restart so the old pipes and score do not carry over
