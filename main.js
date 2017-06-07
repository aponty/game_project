console.log('linked')

var gameFrame = document.querySelector('.gamewindow'),
  paddle = document.querySelector('.paddle'),
  paddleLeft = 0,
  ball = document.querySelector('.ball'),
  ballVertPos = 24,
  ballVertVelocity = 1,
  ballHorPos = 0,
  ballHorVelocity = 1;

//TODO: menu. Pause. Final screen. Score keeping (local storage)
//generate blocks and collision detection (?) or go pong?
//add spin to ball to erraticise it
//need to add depending on paddle movement. How to track if it's moving left/rigth/still?
//if keypress right and ball slope is towards it, multiply <1
//if keypress right and ball slope is away from it, multiply > 1
// etc for left
//acceleration with time?



// help with cleaning up oscilation logic from  here http://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
//and keypress object and controlling everthing in a gameLogic fn set to interval here- https://stackoverflow.com/questions/13538168/is-it-possible-to-make-jquery-keydown-respond-faster
//make object of keys pressed that only persists while they're pressed. If it's there when setInterval runs, it'll be executed.
//I really like seting the value = true. clever, nice and clean conditionals.
var keys = {}
document.addEventListener('keydown', addKey);
document.addEventListener('keyup', removeKey)

function addKey(x) {
  keys[x.which] = true;
}

function removeKey(x) {
  delete keys[x.which];
}

function moveLeft() {
  if (keys[37] && paddleLeft > 0) {
    paddleLeft -= 1;
    paddle.style.left = paddleLeft + '%';
  };
}

function moveRight() {
  if (keys[39] && paddleLeft <= 80) {
    paddleLeft += 1;
    paddle.style.left = paddleLeft + '%';
  };
}

function ballPaddleCollisionCheck() {
  if (ballVertPos === 100) {
    if (ballHorPos >= paddleLeft && ballHorPos <= paddleLeft + 40) {
      console.log('collision! calling spinCheck')
      spinCheck();
    }
  }
}

function spinCheck() {
  var z = Math.sqrt((Math.pow(ballHorVelocity, 2) + Math.pow(ballVertVelocity, 2) - Math.pow(.75 * ballVertVelocity, 2))/Math.pow(ballHorVelocity, 2))
  var m = Math.sqrt((Math.pow(ballVertVelocity, 2) + Math.pow(ballHorVelocity, 2) - Math.pow(.75 * ballHorVelocity, 2))/Math.pow(ballVertVelocity, 2))

  // add an if not on right edge condition or if not on left edge spin
  if (keys[39] && ballHorVelocity > 0) {
    ballVertVelocity *= .75
    ballHorVelocity *= z
    console.log('spin flat')
  }
  if (keys[39] && ballHorVelocity < 0) {
    ballVertVelocity *= m
    ballHorVelocity *= .75
    console.log('spin up')
  }
  if (keys[37] && ballHorVelocity > 0) {
    ballVertVelocity *= m
    ballHorVelocity *= .75
    console.log('spin up')
  }
  if (keys[37] && ballHorVelocity < 0) {
    ballVertVelocity *= .75
    ballHorVelocity *= z
    console.log('spin flat')
  }
}

function oscilateBall() {
  ball.style.left = ballHorPos + '%';
  ball.style.top = ballVertPos + '%';
  ballHorPos += ballHorVelocity;
  ballVertPos += ballVertVelocity;
  if (ballHorPos >= 100 || ballHorPos <= 0) {
    ballHorVelocity = -ballHorVelocity;
  };
  if (ballVertPos >= 100 || ballVertPos <= 0) {
    ballVertVelocity = -ballVertVelocity;
  };
}

function gameLoop() {
  moveLeft();
  moveRight();
  oscilateBall();
  ballPaddleCollisionCheck();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
