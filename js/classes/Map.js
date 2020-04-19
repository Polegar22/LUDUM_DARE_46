const TILE_SIZE = 64;

const TILE_TYPE = {
  OUT_OF_BOUND: -1,
  NOTHING: 0,
  WALL: 1,
  VICTIM: 2,
};

function Map() {
  this.level = LEVEL_1;
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
  return this.level[tileY][tileX];
};

Map.prototype.getHeight = function () {
  return this.level.length;
};

Map.prototype.getWidth = function () {
  return this.level[0].length;
};
