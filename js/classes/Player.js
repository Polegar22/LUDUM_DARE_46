var DIRECTION = {
  LEFT: 1,
  RIGHT: 2,
  FORWARD: 3,
  BACKWARD: 4,
};

function Player(posX, posY, viewingAngle, fov) {
  this.cameraSpeed = 2;
  this.playerSpeed = 3;
  this.position = { x: posX, y: posY };
  this.viewingAngle = viewingAngle;
  this.fov = fov;
  this.hands = new ImageLoader("handSprite.png");
  this.width = 450;
  this.height = 300;
  this.animationFrame = 1;
  this.animationState = 1;
  this.animationSpeed = 7;
  this.nbFrame = 3;
}

Player.prototype.look = function (direction) {
  if (direction === DIRECTION.LEFT) {
    this.viewingAngle = computeAngle((this.viewingAngle += this.cameraSpeed));
  } else {
    this.viewingAngle = computeAngle((this.viewingAngle -= this.cameraSpeed));
  }
};

Player.prototype.move = function (direction) {
  this.animationFrame += this.animationState;

  let deltaX = 0;
  let deltaY = 0;
  if (direction === DIRECTION.FORWARD) {
    deltaX += this.playerSpeed * getCosDeg(this.viewingAngle);
    deltaY -= this.playerSpeed * getSinDeg(this.viewingAngle);
  } else if (direction === DIRECTION.BACKWARD) {
    deltaX -= this.playerSpeed * getCosDeg(this.viewingAngle);
    deltaY += this.playerSpeed * getSinDeg(this.viewingAngle);
  }

  if (
    map.getContentOfTile(
      this.position.x + deltaX * 10,
      this.position.y + deltaY * 10
    ) !== TILE_TYPE.WALL
  ) {
    this.position.x += deltaX;
    this.position.y += deltaY;
  }
  if (
    map.getContentOfTile(this.position.x, this.position.y) === TILE_TYPE.DOOR
  ) {
    map.nextLevel();
    this.position.x = 100;
    this.position.y = 100;
  }
};

Player.prototype.getFov = function () {
  return this.fov;
};

Player.prototype.getPosition = function () {
  return this.position;
};

Player.prototype.getViewingAngle = function () {
  return this.viewingAngle;
};

Player.prototype.getAnimationFrame = function () {
  if (
    this.animationFrame >= this.nbFrame * this.animationSpeed - 1 ||
    this.animationFrame <= 0
  ) {
    this.animationState = -this.animationState;
  }
  let frame = Math.floor(this.animationFrame / this.animationSpeed);
  return frame;
};

Player.prototype.getHandImage = function () {
  return this.hands.image;
};

Player.prototype.getWidth = function () {
  return this.width;
};

Player.prototype.getHeight = function () {
  return this.height;
};

Player.prototype.idle = function () {
  this.animationFrame = 10;
};
