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
  this.takeThat = document.getElementById("takeThat");
  this.ohNo = document.getElementById("ohNo");
  this.coffin = document.getElementById("coffin");
  this.ouf = document.getElementById("ouf");
  this.aie = document.getElementById("aie");
  this.step = document.getElementById("step");
  this.canMove = true;
  this.isBloody = false;
  this.isWinner = false;
  this.life = 20;
  this.isBloodlust = false;
}

Player.prototype.look = function (direction) {
  if (direction === DIRECTION.LEFT) {
    this.viewingAngle = computeAngle((this.viewingAngle += this.cameraSpeed));
  } else {
    this.viewingAngle = computeAngle((this.viewingAngle -= this.cameraSpeed));
  }
};

Player.prototype.move = function (direction) {
  if (!this.canMove) {
    return;
  }

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

  let contentOfTile = map.getContentOfTile(
    this.position.x + deltaX * 10,
    this.position.y + deltaY * 10
  );

  if (contentOfTile === TILE_TYPE.DOOR) {
    map.nextLevel();
    this.isBloodlust = false;
    this.position.x = 100;
    this.position.y = 100;
    this.isBloodlust = false;
  } else if (contentOfTile === TILE_TYPE.WOMAN) {
    ohNo.play();
    this.canMove = false;
    this.isBloody = true;
    this.isBloodlust = false;
    this.life += 10;
    setTimeout(() => {
      this.canMove = true;
      this.isBloody = false;
      ouf.play();
      this.life += 20;
      map.removeContentOfTile(
        this.position.x + deltaX * 10,
        this.position.y + deltaX * 10
      );
    }, 3500);
  } else if (contentOfTile === TILE_TYPE.DANGEROUS_WOMAN) {
    takeThat.play();
    this.isBloody = true;
    this.isBloodlust = false;
    this.canMove = false;
    setTimeout(() => {
      this.canMove = true;
      this.isBloody = false;
      this.life -= 30;
      aie.play();
      map.removeContentOfTile(
        this.position.x + deltaX * 10,
        this.position.y + deltaX * 10
      );
    }, 2000);
  } else if (contentOfTile === TILE_TYPE.COFFIN) {
    coffin.play();
    this.canMove = false;
    setTimeout(() => {
      this.isBloodlust = false;
      this.isWinner = true;
    }, 2000);
  }

  if (contentOfTile !== TILE_TYPE.WALL || player.isBloodlust) {
    this.position.x += deltaX;
    this.position.y += deltaY;
  }
  step.play();
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

Player.prototype.removeLife = function (amount) {
  this.life -= amount;
};

Player.prototype.getLife = function () {
  return this.life;
};

Player.prototype.getIsWinner = function () {
  return this.isWinner;
};

Player.prototype.setBloodlust = function () {
  this.isBloodlust = !this.isBloodlust;
  if (this.isBloodlust) {
    this.life = Math.floor(this.life / 2);
  }
};

Player.prototype.getIsBloodLust = function () {
  return this.isBloodlust;
};

Player.prototype.getIsBloody = function () {
  return this.isBloody;
};
