$(function() {

  //TODO: menu. Final screen. Score keeping (local storage)
  //acceleration with time?
  // help with cleaning up oscilation logic from  here http://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
  //and keypress object and controlling everthing in a gameLogic fn set to interval here- https://stackoverflow.com/questions/13538168/is-it-possible-to-make-jquery-keydown-respond-faster

  var gameFrame = document.querySelector('.gamewindow');
  var paddle = document.querySelector('.paddle');
  var paddleLeft = 0;
  var paddleVelocity = 7; //7
  var ball = document.querySelector('.ball');
  var ballVertPos = 560;
  var ballVertVelocity = 5; //5
  var ballHorPos = 0;
  var ballHorVelocity = 5; //5
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
  var keys = {};
  var startPause = 'never been run';
  var score = 0;
  var lives;
  var livesDisplay = document.querySelectorAll('span')[1];
  var livesString = '' //purely stylistic
  var timesFourForBrickNumber = 5;
  var currentLevel = 1

  document.addEventListener('keydown', addKeyAndSpaceStartPause);
  document.addEventListener('keyup', removeKey);
  document.querySelector('button').addEventListener('click', clickStart);
  document.querySelectorAll('h2')[0].addEventListener('click', clickStart) //start on one by default
  document.querySelectorAll('h2')[1].addEventListener('click', function () { //start on two
    currentLevel = 2;
    clickStart();
  })
  document.querySelectorAll('h2')[2].addEventListener('click', function () {
    currentLevel = 3;
    clickStart();
  })

  function setLevel() {
    document.querySelectorAll('span')[0].textContent = 'Level: ' + currentLevel;
    if (currentLevel === 1) {
      timesFourForBrickNumber = 1;  //score is 20
      paddleVelocity = 7;
      ballVertVelocity = 5;
      ballHorVelocity = 5;
      lives = 4;
    }
    if (currentLevel === 2) {  //really wanna mess with paddle size, ball speed. what collision variables do you need to change to do that?
      timesFourForBrickNumber = 3;  //score is 60
      paddleVelocity = 6;
      ballVertVelocity = 5;
      ballHorVelocity = 5;
      lives = 3;
    }
    if (currentLevel === 3) {  //really wanna mess with paddle size, ball speed. what collision variables do you need to change to do that?
      timesFourForBrickNumber = 10;  //score is 200
      paddleVelocity = 8;
      ballVertVelocity = 5;
      ballHorVelocity = 5;
      lives = 2;
    }
    for (var i=0; i<lives; i++) {
      livesString += '@'
    }
    livesDisplay.textContent = 'Lives: ' + livesString;
    startGame();
  }

  function setBoard() {
    for (var j = 0; j < timesFourForBrickNumber; j++) {
      for (var i = 0; i < assets.length; i++) {
        var brick = document.createElement('div');
        brick.setAttribute('class', `brick ${assets[i].class}`);
        brick.style.backgroundImage = 'url("' + assets[i].url + '")';
        brick.style.top = Math.random() * 275 + 'px';
        brick.style.left = Math.random() * (800 - assets[i].width) + 'px';
        gameFrame.appendChild(brick);
      }
    }
  };

  function addKeyAndSpaceStartPause(x) {
    keys[x.which] = true; //adds keys to keys object (keylogger)

    if (x.which === 32) { //start/pause w/ spacebar. If this listener callback grows I'll separate things out
      if (startPause === 'never been run') {
        setLevel();
        // startGame();
        startPause = 'run';
      } else if (startPause === 'run') {
        startPause = 'stop';
      } else if (startPause === 'stop') {
        startPause = 'run';
      }
    }
  };

  function clickStart() {
    if (startPause === 'never been run') {
      document.querySelector('.gamewindow').setAttribute('class', 'gamewindow animate');
      document.querySelector('button').setAttribute('class', 'animate');
      document.querySelector('.landing').setAttribute('class', 'landing animate');
      setTimeout(setLevel, 1500);
      startPause = 'run';
    }
  };

  function removeKey(x) {
    delete keys[x.which];
  };

  function movePaddleLeft() {
    if (keys[37] && paddleLeft > 0) {
      paddleLeft -= paddleVelocity;
      paddle.style.left = paddleLeft + 'px';
    };
  };

  function movePaddleRight() {
    if (keys[39] && paddleLeft <= 675) {
      paddleLeft += paddleVelocity;
      paddle.style.left = paddleLeft + 'px';
    };
  };

  function ballPaddleCollisionCheck() {
    if (ballVertPos === 585) {
      if (ballHorPos >= paddleLeft && ballHorPos <= paddleLeft + 125) {
        console.log('collision! call spincheck');
        spinCheck();
      } else {
        lives--
        var livesString = ''    //purely stylistic. I like the symbols more than a number
        for (var i=0; i<lives; i++) {
          livesString += '@'
        }
        livesDisplay.textContent = 'Lives: ' + livesString;
      }
    }
  };

  function spinCheck() {
    var z = Math.sqrt((Math.pow(ballHorVelocity, 2) + Math.pow(ballVertVelocity, 2) - Math.pow(.75 * ballVertVelocity, 2)) / Math.pow(ballHorVelocity, 2));
    var m = Math.sqrt((Math.pow(ballVertVelocity, 2) + Math.pow(ballHorVelocity, 2) - Math.pow(.75 * ballHorVelocity, 2)) / Math.pow(ballVertVelocity, 2));

    //if paddle right and ball right
    if (keys[39] && paddleLeft < 675 && ballHorVelocity > 0) {
      ballVertVelocity *= .75;
      ballHorVelocity *= z;
      console.log('spun flat');
    }
    //if paddle right and ball left
    if (keys[39] && paddleLeft < 675 && ballHorVelocity < 0) {
      ballVertVelocity *= m;
      ballHorVelocity *= .75;
      console.log('spun up');
    }
    //if paddle left and ball right
    if (keys[37] && paddleLeft >= 1 && ballHorVelocity > 0) {
      ballVertVelocity *= m;
      ballHorVelocity *= .75;
      console.log('spun up');
    }
    //if paddle left and ball left
    if (keys[37] && paddleLeft >= 1 && ballHorVelocity < 0) {
      ballVertVelocity *= .75;
      ballHorVelocity *= z;
      console.log('spun flat');
    }
  };

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
  };

  function ballBrickCollisionCheck() {
    document.querySelectorAll('.brick').forEach(x => {
      var top = parseFloat(x.style.top.split('px')[0]);
      var left = parseFloat(x.style.left.split('px')[0]);
      var right = widthByClass[x.classList[1]]; //data attributes would be much cleaner. But this works, and priorities say new features are more important
      //left edge. Sequence of elses is arbitrary; leaving them as naked ifs led to multiple delete attempts on some corner strikes
      if (ballHorPos >= left && ballHorPos <= (left + 10) && ballVertPos >= top && ballVertPos <= (top + 50)) {
        x.parentNode.removeChild(x);
        score += 5;
        ballHorVelocity = -ballHorVelocity;
      } else //bottom edge. Need to pick edges specifically to bounce horizontal vs vert. === to bottom edge gets jumped over. Added 10px fuzz
        if (ballVertPos <= (top + 50) && ballVertPos >= (top + 40) && ballHorPos >= left && ballHorPos <= (left + right)) {
          x.parentNode.removeChild(x);
          score += 5;
          ballVertVelocity = -ballVertVelocity;
        } else //right edge
          if (ballHorPos <= (left + right) && ballHorPos >= (left + right - 10) && ballVertPos >= top && ballVertPos <= (top + 50)) {
            x.parentNode.removeChild(x);
            score += 5;
            ballHorVelocity = -ballHorVelocity;
          } else //top edge
            if (ballVertPos >= top && ballVertPos <= (top + 10) && ballHorPos >= left && ballHorPos <= (left + right)) {
              x.parentNode.removeChild(x);
              score += 5;
              ballVertVelocity = -ballVertVelocity;
            }
    })
  };

  function scoreTracker() {
    document.querySelectorAll('span')[2].textContent = 'Score: ' + score;
  }

  function startGame() {
    document.querySelector('.landing').style.display = 'none'
    document.querySelector('.stats').style.display = 'block'
    paddle.style.display = 'block';
    ball.style.display = 'block';
    setBoard();
    requestAnimationFrame(gameLoop);
    // var gameStart = setInterval(gameLoop, 17)  alt start for leveling. Can easily change speed w/out affecting math, but laggy
  };
  // startGame(); second part of comment above

  function endGameCheck() {   //cue score screen here
    if (lives < 0) {
      livesDisplay.textContent = 'Lives: ' + 'DEAD'
      startPause = 'stop'
    }
  }

  function gameLoop() {
    if (startPause === 'run') {
      endGameCheck();
      movePaddleLeft();
      movePaddleRight();
      moveAndBounceBall();
      ballPaddleCollisionCheck();
      ballBrickCollisionCheck();
      scoreTracker();
    }
    requestAnimationFrame(gameLoop);
  };



  //jquery tag
})
