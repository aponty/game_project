# Font Fighter

## Links and Sources

[Click here to play!](https://aponty.github.io/font_fighter/index.html)

[Original repository, to view development and edits](https://github.com/aponty/game_project)

[Wireframes for initial design can be found here](https://wireframe.cc/pro/pp/67ebc0a6391765)

A minimalist styling was adopted, so the final product looks quite similar.


Font Fighter is a brick-breaker style game built using HTML5, CSS, jQuery, and good old Vanilla Javascript. An even mix of jQuery and Javascript was used to demonstrate mutual competence. Select your starting level, or simply press the space bar! Use the arrow keys to move the paddle, and space bar to pause if things get too heavy.


# Features, functions, and technologies used

### requestAnimationFrame
The game runs in a Javascript animation frame, which recursively asks the browser to display the next frame when there is an opportunity. In practice, this results in a refresh rate of appx 60 frames a second, though there is some variation (which can lead to issues, discussed below).

### Basic movement
 This game began as an oscillating box built following [this excellent introduction to game logic](http://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing#node-js-io-js-ie9-support). The box's position is continually updated with a variable called "velocity", which inverts when limits are reached, leading to the "bounce". To this, I added vertical oscillation as well, running simultaneously.

### The paddle

Next, a paddle to "strike" the ball. The paddle is controlled by two keyloggers; one that saves every key pressed, and one that deletes it when the key is released. If a key is saved when the animationFrame executes, functions can respond to it; if not, they can't. This allows for smooth motion control, as opposed to a simpler approach such as incrementing movement with each key press. [credit to some kind folks at stackoverflow](https://stackoverflow.com/questions/13538168/is-it-possible-to-make-jquery-keydown-respond-faster)

### Advanced movement

The slope of the ball is altered if it strikes the paddle while the paddle is moving. This "spin" effect simulates real-life physics, and greatly increases the skill component of the game. The degree of this effect can be easily altered between different levels.

* If the paddle is moving against the direction of the ball on a strike, it bounces more vertically.
* If the paddle is moving with the ball, it bounces flatter.

A tricky part is to do this without either slowing or speeding the movement of the ball, as even minor changes can accumulate and dramatically change gameplay. Fortunately, there was a really smart guy a long time ago by the name of Pythagoras...

A future functionality will be to adjust the degree of slope added based on the speed (instead of just direction of and presence of movement) of the paddle.

### The bricks

The bricks are dynamically created and added into the game at variable levels depending on the gameplay. In the "infinite" mode (the final level), they are added on a regular interval designed to slowly fill the screen (unless you're particularly skilled). Bricks are spread randomly across the top portion of the screen.

### Collision checking

Collision checking between the ball and the paddle is simple; if the ball is at the bottom of the window, and it is between the paddle's horizontal bounds, it bounces (and possibly adds spin). If it misses the paddle, a life is lost; if the last life is lost, the score screen is cued.

Collision checking between the ball and the bricks is done in a similar fashion, with an additional mechanism to determine if the ball should bounce horizontally (in instances of side strikes on the bricks) or vertically (when it strikes the top or the bottom). If the ball overlaps with a brick at all, a check is run to determine if the center of the ball is within the horizontal boundaries of the brick. If so, it is striking from the top or the bottom; if not, it is striking from the sides.

### Additional Features

#### localStorage and input fields

Local storage is used to save game scores and player names, if they choose to provide their name. The top six scores are displayed at the end of every game.

#### Pause functionality

While the animation frame never stops, once begun, a feature was added to allow the game to pause by pressing the space bar. This pause functionality causes the animation frame to "jump" all the steps of the game it would normally execute, leaving the game state untouched until the game is resumed.

#### Levels

Many factors of game play, including lives, the number of bricks that are loaded into the game, how much "spin" the ball receives, and the speed of the paddle are adjusted on each level, both enabling a more exciting game and demonstrating flexible and dynamic code. The "infinite" level enables open-ended gameplay and unlimited high scores.

#### Multiple start options

With different levels, the ability to start from any level was added, allowing multiple "points of entry" into a dynamically adjusted game cycle. This required substantial work in order to adjust all criteria such that they were properly in place no matter the prior "flow" through the game. An additional feature of starting with the space bar, bypassing the initial animations, was also allowed.

#### Multiple types of animations

jQuery animations, CSS keyframe animations, and animations created solely in vanilla Javascript were all used; on game start, on input submission, between levels, and on loss of life during game play.

#### Score, lives, and level counters

Tracked and updated throughout gameplay. Placed in a fixed position outside of game window; animated on loss of life.

#### Media queries and Flexbox

As the game is a fixed width, I added a media query to alert users if their browser size will make the game unplayable. Flexbox was also used, though the limited non-game content limits its utility in this case.

## Unsolved Issues

#### Collision detection details

Due to the fact that the ball moves more than one pixel a frame, the borders must be given a 'width'; otherwise, the ball can occasionally jump over them. This width results in issues when using a collision checking system such as described above. On corner strikes, the ball has "struck" both the vertical and horizontal sides; my solution was to prioritize horizontal strikes, but this is arbitrary and does not always look correct to the eye.

A solution to this would be to use a more advanced linear trajectory calculation system. However, such a system was not feasible to develop for this project (by this programmer, at least). A more simple, and traditional solution for this in brick-breaker games, is to make the ball larger and slower, which allows more "coverage" of minor discrepancies. The simplest solution is to only move the ball one pixel a cycle, eliminating the "width" of the border, but this results in very slow gameplay.

Another issue with this method is performance. Naive checking of this sort requires checking for collision between every object in the game every cycle of the animation frame. A limit test showed that this didn't noticeably slow gameplay until over a thousand bricks were added (and gameplay remained functional until ~4000 bricks or so), so it was not a substantial concern in this case, but possible solutions would be to (again) implement a linear trajectory calculation system or (more simply) to divide the board into "proximity zones", where collision is only checked between the ball and objects within whichever zone the ball currently is within.

#### Speed adjustments

A natural thought would be to vary the speed of the ball by different levels. However, this proved unfeasible in the framework adopted here. Unless there is a way to speed up requestAnimationFrame (which I don't believe there is, though I'd love to be disabused of that; all resources I've found say that throttling it down is the only speed control available), the only option to speed the ball up is to have it cover more distance every interval. As border width is already an issue here, this simply makes it worse. A smaller frame, a larger ball, and a slower game would have made the physics much simpler to work with.

A more advanced solution would be to decouple the physics and "drawing" of the game. Complete calculations on one (faster) interval, and display them on another. This would enable pixel-by-pixel accuracy, without bogging the display.

#### Speed variations

requestAnimationFrame aims for 60 frames a second, but in practice can vary substantially. This leads to different play experiences at different times. The best solution (while remaining in this framework) would be to add a timestamp measurement to the game cycle to force a more precise frame rate.

#### Window size

A fullscreen game was the initial goal, but (given that computers have different screen sizes) this requires relative measurements. Relative measurements, if applied to graphical objects (such as a representation of a ball) lead to deforming. While there are solutions for this, namely measuring the size of the screen and basing sizes of objects within the game on ratios that adjust for that, the game was too far along to comfortably experiment with basic definitions such as that when the idea occurred. Next time, perhaps!


Happy playing!
