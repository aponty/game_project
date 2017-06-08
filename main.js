console.log('linked')
//TODO: menu. Pause. Final screen. Score keeping (local storage)
//generate blocks and collision detection
//acceleration with time?
// help with cleaning up oscilation logic from  here http://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
//and keypress object and controlling everthing in a gameLogic fn set to interval here- https://stackoverflow.com/questions/13538168/is-it-possible-to-make-jquery-keydown-respond-faster

var gameFrame = document.querySelector('.gamewindow');
var paddle = document.querySelector('.paddle');
var paddleLeft = 0;
var ball = document.querySelector('.ball');
var ballVertPos = 560;
var ballVertVelocity = 5;
var ballHorPos = 0;
var ballHorVelocity = 5;
var assets = [{
    class: 'hash',
    url: './assets/2hash.png',
    width: 70
  },
  {
    class: 'amp',
    url: './assets/3amp.png',
    width: 140
  },
  {
    class: 'percent',
    url: './assets/4percent.png',
    width: 190
  },
  {
    class: 'asterisk',
    url: './assets/5asterisk.png',
    width: 300
  }
];
var widthByClass = {
  hash: 70,
  amp: 140,
  percent: 190,
  asterisk: 300
};
var keys = {}

document.addEventListener('keydown', addKey);
document.addEventListener('keyup', removeKey);

//TODO need to add random generation. In batches (levels) or just running.
function setBoard() {
  assets.forEach((x, i) => { //change to some counter that 10x (can increment by level) goes and pulls random index from array
    var brick = document.createElement('div');
    brick.setAttribute('class', `brick ${assets[i].class}`);
    brick.style.backgroundImage = 'url("' + assets[i].url + '")';
    brick.style.top = Math.random() * 300 + 'px';
    brick.style.left = Math.random() * (800 - assets[i].width) + 'px';
    gameFrame.appendChild(brick);
  })
};

setBoard();

function addKey(x) {
  keys[x.which] = true;
}

function removeKey(x) {
  delete keys[x.which];
}

function movePaddleLeft() {
  if (keys[37] && paddleLeft > 0) {
    paddleLeft -= 5;
    paddle.style.left = paddleLeft + 'px';
  };
}

function movePaddleRight() {
  if (keys[39] && paddleLeft <= 675) {
    paddleLeft += 5;
    paddle.style.left = paddleLeft + 'px';
  };
}

function ballPaddleCollisionCheck() {
  if (ballVertPos === 585) {
    if (ballHorPos >= paddleLeft && ballHorPos <= paddleLeft + 125) {
      console.log('call spincheck')
      spinCheck();
    }
  }
}

//TODO add an if not on right edge condition or if not on left edge spin
function spinCheck() {
  var z = Math.sqrt((Math.pow(ballHorVelocity, 2) + Math.pow(ballVertVelocity, 2) - Math.pow(.75 * ballVertVelocity, 2)) / Math.pow(ballHorVelocity, 2))
  var m = Math.sqrt((Math.pow(ballVertVelocity, 2) + Math.pow(ballHorVelocity, 2) - Math.pow(.75 * ballHorVelocity, 2)) / Math.pow(ballVertVelocity, 2))

  if (keys[39] && ballHorVelocity > 0) {
    ballVertVelocity *= .75
    ballHorVelocity *= z
    console.log('spun flat')
  }
  if (keys[39] && ballHorVelocity < 0) {
    ballVertVelocity *= m
    ballHorVelocity *= .75
    console.log('spun up')
  }
  if (keys[37] && ballHorVelocity > 0) {
    ballVertVelocity *= m
    ballHorVelocity *= .75
    console.log('spun up')
  }
  if (keys[37] && ballHorVelocity < 0) {
    ballVertVelocity *= .75
    ballHorVelocity *= z
    console.log('spun flat')
  }
}

function moveAndBounceBall() {
  ball.style.left = ballHorPos + 'px';
  ball.style.top = ballVertPos + 'px';
  ballHorPos += ballHorVelocity;
  ballVertPos += ballVertVelocity;
  if (ballHorPos <= 0 || ballHorPos >= 795) { // horizontal
    ballHorVelocity = -ballHorVelocity;
  };
  if (ballVertPos <= 0 || ballVertPos >= 585) { //vertical
    ballVertVelocity = -ballVertVelocity;

  };
}

//TODO Need to add horizontal bounce off the sides.
function ballBrickCollisionCheck() {
  document.querySelectorAll('.brick').forEach(x => {
    var top = parseFloat(x.style.top.split('px')[0])
    var left = parseFloat(x.style.left.split('px')[0])
    var right = widthByClass[x.classList[1]]
    if (ballVertPos <= (top + 50) && ballVertPos >= top && ballHorPos >= left && ballHorPos <= left + right) {
      x.parentNode.removeChild(x);
      ballVertVelocity = -ballVertVelocity;
    }
  })
}

function gameLoop() {
  movePaddleLeft();
  movePaddleRight();
  moveAndBounceBall();
  ballPaddleCollisionCheck();
  ballBrickCollisionCheck();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);












//
