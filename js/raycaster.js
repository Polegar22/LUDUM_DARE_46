var KEY = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
};

const PLANE_WIDTH = 800;
const PLANE_HEIGHT = 600;
var cameraHeight;
var distToProjectedPlane;
var angleBetweenRays;

var map = new Map();
var player = new Player(100, 100, 0, 65);
var keyPressed = {};

var wallLoader = new ImageLoader("wall.png");
var doorLoader = new ImageLoader("door.png");
var womanLoader = new ImageLoader("woman.png");
var dangerousWomanLoader = new ImageLoader("dangerousWoman.png");
var coffinLoader = new ImageLoader("coffin.png");
var startupScreenLoader = new ImageLoader("startScreen.png");

var imgByTileType = {
  [TILE_TYPE.WALL]: wallLoader.image,
  [TILE_TYPE.DOOR]: doorLoader.image,
  [TILE_TYPE.WOMAN]: womanLoader.image,
  [TILE_TYPE.DANGEROUS_WOMAN]: dangerousWomanLoader.image,
  [TILE_TYPE.COFFIN]: coffinLoader.image,
};

window.onload = function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = PLANE_WIDTH;
  canvas.height = PLANE_HEIGHT;
  startupScreen(ctx);
  addKeyboardEventListener(ctx);
};

function initGame(ctx) {
  var mainTheme = document.getElementById("mainTheme");

  distToProjectedPlane = Math.floor(
    PLANE_WIDTH / 2 / getTanDeg(player.getFov() / 2)
  );
  angleBetweenRays = player.getFov() / PLANE_WIDTH;

  window.requestAnimationFrame(() => animLoop(ctx));

  let lifeInterval = setInterval(function () {
    this.player.removeLife(1);
    if (this.player.getLife() <= 0 || this.player.getIsWinner()) {
      window.clearTimeout(lifeInterval);
      drawEndScreen(ctx, this.player.getIsWinner());
    }
  }, 1000);
}

function addKeyboardEventListener(ctx) {
  window.onkeydown = function (event) {
    const key = event.key;
    if (key === "r") {
      this.location.reload();
    } else if (key === "Enter") {
      initGame(ctx);
      // mainTheme.play();
    } else if (key === " ") {
      if (player) {
        player.setBloodlust();
      }
    } else if (
      key === KEY.LEFT ||
      key === KEY.UP ||
      key === KEY.RIGHT ||
      key === KEY.DOWN
    ) {
      keyPressed[key] = true;
    }
  };
  window.onkeyup = function (event) {
    const key = event.key;
    if (
      key === KEY.LEFT ||
      key === KEY.UP ||
      key === KEY.RIGHT ||
      key === KEY.DOWN
    ) {
      keyPressed[key] = false;
    }
  };
}

function startupScreen(ctx) {
  ctx.clearRect(0, 0, PLANE_WIDTH, PLANE_HEIGHT);
  ctx.drawImage(startupScreenLoader.image, 0, 0, PLANE_WIDTH, PLANE_HEIGHT);
}

function drawEndScreen(ctx, win = false) {
  ctx.clearRect(0, 0, PLANE_WIDTH, PLANE_HEIGHT);
  ctx.fillStyle = "#0D1135";
  ctx.fillRect(0, 0, PLANE_WIDTH, PLANE_HEIGHT);

  ctx.font = "30px Arial";
  ctx.fillStyle = "gold";
  ctx.textAlign = "center";

  if (!win) {
    ctx.fillText(
      "You did not manage to stay alive",
      PLANE_WIDTH / 2,
      PLANE_HEIGHT / 2 - 30
    );
    ctx.fillText(
      "Try to avoid the garlic woman !",
      PLANE_WIDTH / 2,
      PLANE_HEIGHT / 2 + 30
    );
  } else {
    mainTheme.play();
    ctx.fillText(
      "Congratulation you managed to stay alive !",
      PLANE_WIDTH / 2,
      PLANE_HEIGHT / 2 - 30
    );
  }
  ctx.fillText("Press R to reload", PLANE_WIDTH / 2, PLANE_HEIGHT / 2 + 80);
}

function animLoop(ctx) {
  animId = window.requestAnimationFrame(() => animLoop(ctx));
  if (this.player.getLife() > 0 && !this.player.getIsWinner()) {
    if (keyPressed[KEY.LEFT]) {
      player.look(DIRECTION.LEFT);
    } else if (keyPressed[KEY.RIGHT]) {
      player.look(DIRECTION.RIGHT);
    }
    if (keyPressed[KEY.UP]) {
      player.move(DIRECTION.FORWARD);
    } else if (keyPressed[KEY.DOWN]) {
      player.move(DIRECTION.BACKWARD);
    } else {
      player.idle();
    }
    drawScene(ctx);
  } else {
    window.cancelAnimationFrame(animId);
  }
  if (this.player.getIsWinner()) {
    drawEndScreen(ctx, true);
  }
}

function drawScene(ctx) {
  ctx.clearRect(0, 0, PLANE_WIDTH, PLANE_HEIGHT);

  ctx.fillStyle = "#0D1135";
  ctx.fillRect(0, 0, PLANE_WIDTH, PLANE_HEIGHT / 2);

  ctx.fillStyle = "#686462";
  ctx.fillRect(0, PLANE_HEIGHT / 2, PLANE_WIDTH, PLANE_HEIGHT / 2);

  for (let rayNumber = 0; rayNumber < PLANE_WIDTH; rayNumber++) {
    let rayAngle = computeAngle(
      player.getViewingAngle() +
        player.getFov() / 2 -
        rayNumber * angleBetweenRays
    );
    wallOffsetAndHeight = findObjectOffsetAndHeight(
      [TILE_TYPE.WALL, TILE_TYPE.DOOR],
      rayAngle
    );

    if (!wallOffsetAndHeight) {
      continue;
    }
    ctx.drawImage(
      imgByTileType[wallOffsetAndHeight.contentOfTile],
      Math.floor(wallOffsetAndHeight.offset),
      0,
      1,
      TILE_SIZE,
      rayNumber,
      PLANE_HEIGHT / 2 - Math.round(wallOffsetAndHeight.height / 2),
      2,
      wallOffsetAndHeight.height
    );

    spriteOffsetAndHeight = findObjectOffsetAndHeight(
      [TILE_TYPE.WOMAN, TILE_TYPE.DANGEROUS_WOMAN, TILE_TYPE.COFFIN],
      rayAngle
    );
    if (!spriteOffsetAndHeight) {
      continue;
    }
    if (wallOffsetAndHeight.height < spriteOffsetAndHeight.height) {
      let height = spriteOffsetAndHeight.height / 1.5;
      ctx.drawImage(
        imgByTileType[spriteOffsetAndHeight.contentOfTile],
        Math.floor(spriteOffsetAndHeight.offset),
        0,
        1,
        TILE_SIZE,
        rayNumber,
        PLANE_HEIGHT / 2 - height / 4,
        1,
        height
      );
    }
  }
  if (player.getIsBloodLust()) {
    ctx.globalAlpha = 0.5;
  }

  ctx.drawImage(
    player.getHandImage(),
    player.getAnimationFrame() * this.player.getWidth(),
    0,
    player.getWidth(),
    player.getHeight(),
    PLANE_WIDTH / 2 - player.getWidth() / 2,
    PLANE_HEIGHT - player.getHeight(),
    player.getWidth(),
    player.getHeight()
  );

  if (player.getIsBloody()) {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, PLANE_WIDTH, PLANE_HEIGHT);
  }

  ctx.globalAlpha = 1;

  ctx.font = "30px Arial";
  ctx.fillStyle = "gold";
  ctx.fillText("Life : " + player.getLife(), 10, 30);
}

function findObjectOffsetAndHeight(objectsToFind, rayAngle) {
  let horizontalCoordinates = undefined;
  if (objectsToFind.includes(TILE_TYPE.WALL)) {
    horizontalCoordinates = findHorizontalIntersectionCoord(
      objectsToFind,
      rayAngle
    );
  }
  let verticalCoordinates = findVerticalIntersectionCoord(
    objectsToFind,
    rayAngle
  );

  if (!horizontalCoordinates && !verticalCoordinates) {
    return undefined;
  }

  let horizontalDist = horizontalCoordinates
    ? findPlayerDistanceToObject(
        horizontalCoordinates.x,
        horizontalCoordinates.y,
        rayAngle
      )
    : TILE_SIZE * TILE_SIZE;

  let verticalDist = verticalCoordinates
    ? findPlayerDistanceToObject(
        verticalCoordinates.x,
        verticalCoordinates.y,
        rayAngle
      )
    : TILE_SIZE * TILE_SIZE;

  let shortestObjectDistance =
    horizontalDist < verticalDist ? horizontalDist : verticalDist;

  let offset;
  if (horizontalDist < verticalDist) {
    offset = horizontalCoordinates.x % 64;
  } else {
    offset = verticalCoordinates.y % 64;
  }

  let contentOfTile =
    horizontalDist < verticalDist
      ? horizontalCoordinates.contentOfTile
      : verticalCoordinates.contentOfTile;

  let projectedObjectHeight = Math.round(
    (TILE_SIZE / shortestObjectDistance) * distToProjectedPlane
  );

  return { height: projectedObjectHeight, offset, contentOfTile };
}
function findHorizontalIntersectionCoord(objectsToFind, rayAngle) {
  let yDirection = getYDirectionBy(rayAngle);
  let yDelta = TILE_SIZE * yDirection;
  let xDelta = ensureXDirection(TILE_SIZE / getTanDeg(rayAngle), rayAngle);

  let intersectionY =
    Math.floor(player.getPosition().y / TILE_SIZE) * TILE_SIZE;
  if (yDirection === 1) {
    intersectionY += TILE_SIZE;
  } else {
    intersectionY += -1;
  }

  let intersectionX =
    player.getPosition().x +
    Math.floor((player.getPosition().y - intersectionY) / getTanDeg(rayAngle));

  return findNextObjectCoordinate(
    objectsToFind,
    intersectionX,
    intersectionY,
    xDelta,
    yDelta
  );
}

function findVerticalIntersectionCoord(objectsToFind, rayAngle) {
  let xDirection = getXDirectionBy(rayAngle);
  let xDelta = TILE_SIZE * xDirection;
  let yDelta = ensureYDirection(TILE_SIZE * getTanDeg(rayAngle), rayAngle);

  let intersectionX =
    Math.floor(player.getPosition().x / TILE_SIZE) * TILE_SIZE;
  if (xDirection === 1) {
    intersectionX += TILE_SIZE;
  } else {
    intersectionX += -1;
  }

  let intersectionY =
    player.getPosition().y +
    (player.getPosition().x - intersectionX) * getTanDeg(rayAngle);

  return findNextObjectCoordinate(
    objectsToFind,
    intersectionX,
    intersectionY,
    xDelta,
    yDelta
  );
}

function findNextObjectCoordinate(objectsToFind, x, y, xDelta, yDelta) {
  let contentOfTile = map.getContentOfTile(x, y);
  while (
    !objectsToFind.includes(contentOfTile) &&
    contentOfTile !== TILE_TYPE.OUT_OF_BOUND
  ) {
    x += xDelta;
    y += yDelta;
    contentOfTile = map.getContentOfTile(x, y);
  }
  if (contentOfTile == TILE_TYPE.OUT_OF_BOUND) {
    return undefined;
  }
  return { x, y, contentOfTile };
}

function findPlayerDistanceToObject(x, y, rayAngle) {
  let distordedDist = Math.floor(
    Math.sqrt(
      Math.pow(player.getPosition().x - x, 2) +
        Math.pow(player.getPosition().y - y, 2)
    )
  );

  let correctedDist = Math.floor(
    distordedDist * getCosDeg(rayAngle - player.getViewingAngle())
  );
  return correctedDist;
}
