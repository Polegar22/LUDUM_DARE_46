function Victim(spriteName, id, posX, posY, viewingAngle, fov) {
  this.id = id;
  this.position = { x: posX, y: posY };
  this.viewingAngle = viewingAngle;
  this.fov = fov;
  this.spriteLoader = new ImageLoader(spriteName);
  this.width = 32;
  this.height = 64;
}

Victim.prototype.getFov = function () {
  return this.fov;
};

Victim.prototype.getPosition = function () {
  return this.position;
};

Victim.prototype.getViewingAngle = function () {
  return this.viewingAngle;
};

Victim.prototype.getImage = function () {
  return this.spriteLoader.image;
};

Victim.prototype.getWidth = function () {
  return this.width;
};

Victim.prototype.getHeight = function () {
  return this.height;
};

Victim.prototype.getId = function () {
  return this.id;
};
