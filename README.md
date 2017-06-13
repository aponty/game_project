# Font Fighter

Font Fighter is a brick-breaker style game built using HTML5, CSS, jQuery, and good old Vanilla Javascript.

This game began as an oscillating box built following [this excellent introduction to game logic](http://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing#node-js-io-js-ie9-support). The idea of controlling a bounce animation through slope inversion at a limit is fairly simple, but the organizational structure provided here was very helpful for avoiding beginner blind-alleys.

Then came vertical oscillation, and box became a ball bouncing in a fixed pattern around a container. Next came a paddle, and simple collision checking at the bottom; in essence, the program checks if the paddle is at the lower limit of the container every frame, and if it is, if it is within the bounds of the paddle.

From here the features started to expand. In order to de-regularize the movement of the ball, and simulate real-life physics, spin was added to skew the slope of the ball depending on how it struck the paddle. If the paddle is moving against the direction of the ball on a strike, it bounces more vertically; if the paddle is moving with the ball, it bounces flatter. A tricky part is to do this without either slowing or speeding the movement of the ball, as even minor changes can accumulate and dramatically change gameplay. Fortunately, there was a really smart guy a long time ago by the name of Pythagoras... But I digress. Slope variability greatly increases the skill aspect of the game, and makes play less predictable and more exciting. A later update allows for differing levels of slope to be applied at different gameplay levels. A future functionality could be to adjust the degree of slope added based on the speed (instead of just direction of and presence of movement) of the paddle.

Next comes bricks. A typographical 
