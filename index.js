console.log('loaded');
var game = new Phaser.Game(600, 400, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var snake, food, cursors;
var snakePoop = [];


var velocitySpeed = 200;

function preload () {
  game.load.image('snake', '/snake.png');
  game.load.image('food', '/mushroom.png');
}

function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  snake = game.add.sprite(100, 100, 'snake');
  snake.enableBody = true;
  food = game.add.sprite(game.world.randomX, game.world.randomY, 'food');
  food.scale.setTo(0.3, 0.3);
  game.physics.arcade.sortDirection = Phaser.Physics.Arcade.BOTTOM_TOP;
  game.physics.arcade.enable(snake);
  game.physics.arcade.enable(food);
  cursors = game.input.keyboard.createCursorKeys();

  snake.checkWorldBounds = true;
  snake.events.onOutOfBounds.add(snakeOut, this);
}

function update () {

  game.physics.arcade.collide(snake, food, collisionHandler, null, this);

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

  // console.log(snake.body.collideWorldBounds);
}

function collisionHandler () {
  food.reset(game.world.randomX, game.world.randomY);
  velocitySpeed = velocitySpeed + 50;
  addTail();
}

function addTail() {
  snakePoop.push(game.add.sprite(snake.x, snake.y, 'snake'));
  game.physics.arcade.enable(snakePoop[snakePoop.length - 1]);
  game.physics.arcade.collide(snake, snakePoop[snakePoop.length - 1], poopCollisionHandler, null, this);
}


function poopCollisionHandler() {
  console.log('💩💩💩you touch the poop💩💩💩');
}

function snakeOut(snake) {
  console.log(snake.x);
  console.log(snake.y);
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
