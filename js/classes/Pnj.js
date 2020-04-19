function Pnj(posX, posY, spriteName, viewingAngle, fov) {
  this.position = { x: posX, y: posY };
  this.viewingAngle = viewingAngle;
  this.fov = fov;
  this.spriteLoader = new ImageLoader(spriteName);
  this.width = 32;
  this.height = 64;
}

Pnj.prototype.getFov = function () {
  return this.fov;
};

Pnj.prototype.getPosition = function () {
  return this.position;
};

Pnj.prototype.getViewingAngle = function () {
  return this.viewingAngle;
};

Pnj.prototype.getImage = function () {
  return this.spriteLoader.image;
};

Pnj.prototype.getWidth = function () {
  return this.width;
};

Pnj.prototype.getHeight = function () {
  return this.height;
};
