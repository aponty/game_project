$(function() {
  // help with cleaning up oscilation logic from  here http://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
  //and keypress object and controlling everthing in a gameLogic fn set to interval here- https: //stackoverflow.com/questions/13538168/is-it-possible-to-make-jquery-keydown-respond-faster
  var $gameFrame = $('.gamewindow')
  var paddle = document.querySelector('.paddle');
  var paddleLeft = 0;
  var paddleVelocity = 7; //ok to change a little
  var ball = document.querySelector('.ball');
  var ballVertPos = 560;
  var ballVertVelocity = 5; //can't change much, jumps borders
  var ballHorPos = 0;
  var ballHorVelocity = 5; //can't change much, jumps borders
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
  var widthByClass = { //should use data attributes, but this is already in place
    hash: 70,
    amp: 140,
    percent: 190,
    asterisk: 300
  };
  var keys = {};
  var startPause = 'never been run';
  var score = 0;
  var lives;
  var $livesDisplay = $('span').eq(1);
  var timesFourForBrickNumber = 5;
  var currentLevel = 1;
  var infiniteLevelSetBoardInt;
  var input;
  var spin = .75;

  $('input').keydown(function(x) { //jazzing up the imput box
    if (x.which === 13) {
      input = $('input').val();
      $('input').hide();
      var $acknowledge = $("h4");
      $acknowledge.text('Saved!');
      $('.landing').append($acknowledge)
    }
  });
  document.addEventListener('keydown', addKeyAndSpaceStartPause);
  document.addEventListener('keyup', removeKey);
  document.querySelector('button').addEventListener('click', clickStart);
  document.querySelectorAll('h2')[0].addEventListener('click', clickStart) //start on one by default
  document.querySelectorAll('h2')[1].addEventListener('click', function() { //start on two
    currentLevel = 2;
    clickStart();
  })
  document.querySelectorAll('h2')[2].addEventListener('click', function() { //on three
    currentLevel = 3;
    clickStart();
  })
  document.querySelectorAll('h2')[3].addEventListener('click', function() { //infinite
    currentLevel = '∞';
    clickStart();
  })

  function addKeyAndSpaceStartPause(x) {
    keys[x.which] = true; //keylogger

    if (x.which === 32 && document.activeElement != document.querySelector('input')) { //start/pause w/ spacebar, if the input is not in focus
      if (startPause === 'never been run') {
        setLevel();
      } else if (startPause === 'run') {
        startPause = 'stop';
        if (currentLevel === '∞') {
          clearInterval(infiniteLevelSetBoardInt) //prevents the board from accumulating objects when paused
        }
      } else if (startPause === 'stop') {
        startPause = 'run';
        if (currentLevel === '∞') {
          infiniteLevelSetBoardInt = setInterval(function() {
            setBoard();
          }, 8000);
        }
      }
    }
  };

  function removeKey(x) {
    delete keys[x.which];
  };

  function clickStart() {
    if (startPause === 'never been run') {
      //class changes cue CSS animations
      $('.gamewindow').attr('class', 'gamewindow animate');
      $('button').attr('class', 'animate');
      $('.landing').attr('class', 'landing animate');
      //input just goes away
      $('input').css('display', 'none');
      setTimeout(setLevel, 1500);
    }
  };

  function setLevel() {
    $('span').eq(0).text('Level: ' + currentLevel);
    //reset the board. Unlike ball, paddle only drawn when keydown: forcing it to reset here
    paddleLeft = 0
    paddle.style.left = '0px'
    ballVertPos = 560;
    ballHorPos = 0;
    ballVertVelocity = -5;
    ballHorVelocity = 5;

    if (currentLevel === 1) { //really wanna mess with paddle size, ball speed. However, most speed adjustments require major math changes
      timesFourForBrickNumber = 1;
      paddleVelocity = 7;
      lives = 4;
      spin = .95
    }
    if (currentLevel === 2) {
      timesFourForBrickNumber = 3;
      paddleVelocity = 6;
      lives = 3;
      spin = .85
    }
    if (currentLevel === 3) {
      timesFourForBrickNumber = 10;
      paddleVelocity = 8;
      lives = 2;
      spin = .75
    }
    if (currentLevel === '∞') {
      timesFourForBrickNumber = 2;
      paddleVelocity = 8;
      lives = 3;
      spin = .75
      infiniteLevelSetBoardInt = setInterval(function() { //could add a random factor to this, but didn't get to it
        setBoard();
      }, 8000);
    }
    var livesString = ""  //just asthetic. I like the lives being a string instead of a number
    for (var i = 0; i < lives; i++) {
      livesString += '@';
    }
    $livesDisplay.text('Lives: ' + livesString);
    startGameAnimation();
  }

  function startGameAnimation() {
    document.querySelector('.landing').style.display = 'none'
    document.querySelector('.stats').style.display = 'block'
    paddle.style.display = 'block';
    ball.style.display = 'block';
    setBoard();
    if (startPause === 'never been run') {
      startPause = 'run';
      requestAnimationFrame(gameLoop); //weird to have the line that kicks it all off buried here, but that's a product of multiple start options
    }
    if (startPause === 'stop') {
      startPause = 'run'
    }
  };

  function setBoard() { //draws the board (places the bricks) based on level variables when called
    for (var j = 0; j < timesFourForBrickNumber; j++) {
      for (var i = 0; i < assets.length; i++) {
        var $brick = $('<div>');
        $brick.attr('class', `brick ${assets[i].class}`);
        $brick.css({
          backgroundImage: 'url("' + assets[i].url + '")',
          top: Math.random() * 275 + 'px',
          left: Math.random() * (800 - assets[i].width) + 'px'
        });
        $gameFrame.append($brick);
      }
    }
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
    if (ballVertPos >= 585) {
      if (ballHorPos >= paddleLeft && ballHorPos <= paddleLeft + 125) {
        spinCheck();
      } else { //if it doesn't hit the paddle
        lives--
        $livesDisplay.css('background-color', 'rgba(128, 0, 0, .4)')
        $gameFrame.css('background-color', 'rgba(128, 0, 0, .4)')
        var livesString = '' //again, purely stylistic. I like the symbols more than a number
        for (var i = 0; i < lives; i++) {
          livesString += '@'
        }
        $livesDisplay.text('Lives: ' + livesString);
        setTimeout(function() {
          $livesDisplay.css('background-color', 'white')
          $gameFrame.css('background-color', 'white')
        }, 400)
      }
    }
  };

  function spinCheck() {
    //calculates factor to multiply slope by without affecting total speed (hypotenuse). Pythagoras; keeping c^2 the same means (a*z)^2 + (b * m)^2 = a^2 + b^2, solved here for z and m
    var z = Math.sqrt((Math.pow(ballHorVelocity, 2) + Math.pow(ballVertVelocity, 2) - Math.pow(spin * ballVertVelocity, 2)) / Math.pow(ballHorVelocity, 2));
    var m = Math.sqrt((Math.pow(ballVertVelocity, 2) + Math.pow(ballHorVelocity, 2) - Math.pow(spin * ballHorVelocity, 2)) / Math.pow(ballVertVelocity, 2));

    //if paddle right and ball right
    if (keys[39] && paddleLeft < 675 && ballHorVelocity > 0) {
      ballVertVelocity *= spin;
      ballHorVelocity *= z;
      console.log('spun flat!');
    }
    //if paddle right and ball left
    if (keys[39] && paddleLeft < 675 && ballHorVelocity < 0) {
      ballVertVelocity *= m;
      ballHorVelocity *= spin;
      console.log('spun up!');
    }
    //if paddle left and ball right
    if (keys[37] && paddleLeft >= 1 && ballHorVelocity > 0) {
      ballVertVelocity *= m;
      ballHorVelocity *= spin;
      console.log('spun up!');
    }
    //if paddle left and ball left
    if (keys[37] && paddleLeft >= 1 && ballHorVelocity < 0) {
      ballVertVelocity *= spin;
      ballHorVelocity *= z;
      console.log('spun flat!');
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
      var width = widthByClass[x.classList[1]];
      var ballHC = ballHorPos + 5; //horizontal center

      if (ballVertPos <= (top + 50) && ballVertPos >= top && ballHorPos >= left && ballHorPos <= (left + width)) { //if there's any overlap
        if (ballHC - 10 > left && ballHC + 10 < left + width) { //if overlap and the ball's center not within the horizonal bounds means coming from top or bottom. + 10px fuzz because animation variations
          ballVertVelocity = -ballVertVelocity; //so vertical bounce.
          x.parentNode.removeChild(x);
          score += 5;
        } else {
          ballHorVelocity = -ballHorVelocity; // else horizontal bounce.
          x.parentNode.removeChild(x);
          score += 5;
        }
      }
    })
  };

  function drawScore() {
    document.querySelectorAll('span')[2].textContent = 'Score: ' + score;
  }

  function endGameNextLevelCheck() {
    var $p = $('p')
    if (lives < 0) {
      startPause = 'stop';
      clearInterval(infiniteLevelSetBoardInt)
      drawScorePage();
    }
    var bricks = document.querySelectorAll('.brick') //annoying to query this over and over again, but need a current list
    //getElementsByClassName outside of functions doesn't work either, because at the start there's nothing to get so it errors
    if (bricks.length === 0) {
      if (currentLevel < 3) {
        currentLevel++
      } else {
        currentLevel = '∞'
      }
      $p.text(currentLevel)
      startPause = 'stop';
      $p.fadeIn(500, function() {
        $p.fadeOut(500, function() {
          setLevel();
        })
      })
    }
  }

  function drawScorePage() {
    $livesDisplay.text('Lives: DEAD');
    if (input) localStorage[input] = score;
    document.querySelectorAll('.brick').forEach(x => x.style.display = 'none');
    document.querySelector('.paddle').style.display = 'none';
    document.querySelector('.ball').style.display = 'none';
    $('header').eq(1).text('YOUR SCORE: ' + score);
    document.querySelector('.score').style.display = 'block';
    var scoreList = []; // to order results from localStorage
    for (var i in localStorage) {
      scoreList.push([i, localStorage[i]])
    }
    scoreList.sort((a, b) => b[1] - a[1])
    scoreList.slice(0, 6).forEach(x => {
      var $nameScore = $('<h2>');
      $nameScore.text(x[0] + ": " + x[1]);
      $('.score').append($nameScore)
    })
    var $reload = $('<button>');
    $reload.text("<<back to start>>")
    $reload.click(function() {
      location.reload()
    })
    $gameFrame.append($reload)
  }

  function gameLoop() {
    if (startPause === 'run') { //the recursion never stops, it just doesn't execute anything after space is hit
      endGameNextLevelCheck();
      movePaddleLeft();
      movePaddleRight();
      moveAndBounceBall();
      ballPaddleCollisionCheck();
      ballBrickCollisionCheck();
      drawScore();
    }
    requestAnimationFrame(gameLoop);
  };
})
