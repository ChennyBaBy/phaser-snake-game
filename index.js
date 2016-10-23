console.log('loaded');

var gameWidth = 600
var gameHeight = 400
var game = new Phaser.Game(
  gameWidth,
  gameHeight,
  Phaser.AUTO,
  '',
  { preload: preload, create: create, update: update });

var snake, food, cursors, score = 0;
var snakePoop = [];

var gameOver = false;


var velocitySpeed = 200;


function preload () {
  game.load.image('snake', '/snake.png');
  game.load.image('snakePoop', '/snake-red.png');
  game.load.image('food', '/mushroom.png');
  game.load.audio('coin', './coin.mp3');
  game.load.audio('cheering', './cheering.mp3');
}

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  snake = game.add.sprite(100, 100, 'snake');
  snake.enableBody = true;
  coinSound = game.add.audio('coin');
  cheeringSound = game.add.audio('cheering');
  var y = game.world.randomY;
  var x = game.world.randomX;
  if (x < 40) {
    x = 40
  } else if ( x > gameWidth - 40 ){
    x = gameWidth - 40
  }

  if (y < 40) {
    y = 40
  } else if ( y > gameHeight - 40 ){
    y = gameHeight - 40
  }
  food = game.add.sprite(x, y, 'food');
  food.scale.setTo(0.3, 0.3);
  game.physics.arcade.sortDirection = Phaser.Physics.Arcade.BOTTOM_TOP;
  game.physics.arcade.enable(snake);
  game.physics.arcade.enable(food);
  game.physics.arcade.enable(snakePoop);
  cursors = game.input.keyboard.createCursorKeys();

  snake.checkWorldBounds = true;
  snake.events.onOutOfBounds.add(snakeOut, this);

  stateText = game.add.text(game.world.centerX,game.world.centerY,'Game Over!', { font: '84px Arial', fill: '#fff' });
  stateText.anchor.setTo(0.5, 0.5);
  stateText.visible = false;

  scoreText = game.add.text(game.world.centerX,game.world.centerY,'Score: ' + score, { font: '22px Arial', fill: '#fff' });
  scoreText.x = 0;
  scoreText.y = 0;
}

function update () {

  scoreText.text = 'Score: ' + score
  game.physics.arcade.collide(snake, food, foodCollisionHandler, null, this);

  if (!gameOver) {
    if (cursors.left.isDown)
    {
      snake.body.velocity.x = -velocitySpeed;
      snake.body.velocity.y = 0;
    }
    else if (cursors.right.isDown)
    {
      snake.body.velocity.x = velocitySpeed;
      snake.body.velocity.y = 0;
    }
    if (cursors.up.isDown)
    {
      snake.body.velocity.x = 0;
      snake.body.velocity.y = -velocitySpeed;
    }
    else if (cursors.down.isDown)
    {
      snake.body.velocity.x = 0;
      snake.body.velocity.y = velocitySpeed;
    }
  }


  for (var i = 0; i < snakePoop.length; i++) {
    game.physics.arcade.collide(snake, snakePoop[i], poopCollisionHandler, null, this)
  }
}

function foodCollisionHandler () {
  var y = game.world.randomY;
  var x = game.world.randomX;
  if (x < 40) {
    x = 40
  } else if ( x > gameWidth - 40 ){
    x = gameWidth - 40
  }

  if (y < 40) {
    y = 40
  } else if ( y > gameHeight - 40 ){
    y = gameHeight - 40
  }
  food.reset(x, y);
  velocitySpeed = velocitySpeed + 50;
  addTail(this);
}

function addTail(context) {
  coinSound.play()
  score++
  console.log("x:" + snake.body.velocity.x);
  console.log("y:" + snake.body.velocity.y);

  var spawnOffsetX = 0;
  var spawnOffsetY = 0;

  if (snake.body.velocity.x > 0) {
    spawnOffsetX =  - 20
  }

  if (snake.body.velocity.x < 0) {
    spawnOffsetX = 20
  }

  if (snake.body.velocity.Y > 0) {
    spawnOffsetY = - 20
  }

  if (snake.body.velocity.y < 0) {
    spawnOffsetY = 20
  }

  snakePoop.push(game.add.sprite(snake.x + spawnOffsetX, snake.y + spawnOffsetY, 'snakePoop'));
  this.snakeTail = snakePoop[snakePoop.length - 1]
  this.snakeTail.scale.x = 0
  this.snakeTail.scale.y = 0
  game.add.tween(this.snakeTail.scale).to( { x: 1, y: 1 }, 2000, Phaser.Easing.Linear.None, true);
  game.physics.arcade.enable(this.snakeTail);
}


function poopCollisionHandler() {
  console.log('💩💩💩you touch the poop💩💩💩');
  console.log('💩💩💩Game Over💩💩💩');
  cheeringSound.play();

  stateText.visible = true;

  food.destroy();
  ga('send', 'event', "Game", "HightScore", "GameOver", score);
}

function snakeOut(snake) {
  if (snake.x > 600) {
    snake.reset(0, snake.y);
    snake.body.velocity.x = velocitySpeed;
  }
  if (snake.x < 0) {
    snake.reset(580, snake.y);
    snake.body.velocity.x = -velocitySpeed;
  }

  if (snake.y > 400) {
    snake.reset(snake.x, 0);
    snake.body.velocity.y = velocitySpeed;
  }

  if (snake.y < 0) {
    snake.reset(snake.x, 380);
    snake.body.velocity.y = -velocitySpeed;
  }
}
