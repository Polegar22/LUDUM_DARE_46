function ImageLoader(url) {
  this.image = new Image();
  this.image.tilesetRef = this;
  this.image.onload = function () {
    if (!this.complete) throw new Error('Error loading image "' + url + '".');
    this.tilesetRef.width = this.width / TILE_SIZE;
  };
  this.image.src = "assets/" + url;
}
