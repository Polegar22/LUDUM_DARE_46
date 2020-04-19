const TILE_SIZE = 64;

const TILE_TYPE = {
  OUT_OF_BOUND: -1,
  NOTHING: 0,
  WALL: 1,
  WOMAN: 2,
  DANGEROUS_WOMAN: 3,
  DOOR: 4,
  COFFIN: 5,
};

function Map() {
  this.levels = [DEBUG_LEVEL, LEVEL_1, LEVEL_2];
  this.currentLevel = this.levels.shift();
}

Map.prototype.getContentOfTile = function (x, y) {
  var tileX = Math.floor(x / TILE_SIZE);
  var tileY = Math.floor(y / TILE_SIZE);
  if (
    tileY < 0 ||
    tileY > this.getHeight() - 1 ||
    tileX < 0 ||
    tileX > this.getWidth() - 1
  ) {
    return TILE_TYPE.OUT_OF_BOUND;
  }
  return this.currentLevel[tileY][tileX];
};

Map.prototype.removeContentOfTile = function (x, y) {
  var tileX = Math.floor(x / TILE_SIZE);
  var tileY = Math.floor(y / TILE_SIZE);
  this.currentLevel[tileY][tileX] = 0;
};
Map.prototype.nextLevel = function () {
  this.currentLevel = this.levels.shift();
};

Map.prototype.getHeight = function () {
  return this.currentLevel.length;
};

Map.prototype.getWidth = function () {
  return this.currentLevel[0].length;
};
