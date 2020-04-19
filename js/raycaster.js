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

var player = new Player(400, 128, 180, 65);
var map = new Map();
var keyPressed = {};

wallLoader = new ImageLoader("wall.png");
victimLoader = new ImageLoader("amelie.png");

window.onload = function () {
  let mainTheme = document.getElementById("mainTheme");
  this.setInterval(function () {
    // mainTheme.play();
  }, 30000);

  addKeyboardEventListener();

  distToProjectedPlane = Math.floor(
    PLANE_WIDTH / 2 / getTanDeg(player.getFov() / 2)
  );
  angleBetweenRays = player.getFov() / PLANE_WIDTH;

  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = PLANE_WIDTH;
  canvas.height = PLANE_HEIGHT;

  window.requestAnimationFrame(() => animLoop(ctx));
};

function addKeyboardEventListener() {
  window.onkeydown = function (event) {
    const key = event.key;
    if (
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

function animLoop(ctx) {
  window.requestAnimationFrame(() => animLoop(ctx));
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
    wallOffsetAndHeight = findObjectOffsetAndHeight(TILE_TYPE.WALL, rayAngle);

    if (!wallOffsetAndHeight) {
      continue;
    }
    ctx.drawImage(
      wallLoader.image,
      Math.floor(wallOffsetAndHeight.offset),
      0,
      1,
      TILE_SIZE,
      rayNumber,
      PLANE_HEIGHT / 2 - Math.round(wallOffsetAndHeight.height / 2),
      2,
      wallOffsetAndHeight.height
    );

    victimOffsetAndHeight = findObjectOffsetAndHeight(
      TILE_TYPE.VICTIM,
      rayAngle
    );
    if (!victimOffsetAndHeight) {
      continue;
    }
    if (wallOffsetAndHeight.height < victimOffsetAndHeight.height) {
      ctx.drawImage(
        victimLoader.image,
        Math.floor(victimOffsetAndHeight.offset),
        0,
        1,
        TILE_SIZE,
        rayNumber,
        PLANE_HEIGHT / 2 + 20 - Math.round(victimOffsetAndHeight.height / 2),
        2,
        victimOffsetAndHeight.height
      );
    }
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
}

function findObjectOffsetAndHeight(objectToFind, rayAngle) {
  let horizontalCoordinates = undefined;
  if (objectToFind === TILE_TYPE.WALL) {
    horizontalCoordinates = findHorizontalIntersectionCoord(
      objectToFind,
      rayAngle
    );
  }
  let verticalCoordinates = findVerticalIntersectionCoord(
    objectToFind,
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

  let projectedObjectHeight = Math.round(
    (TILE_SIZE / shortestObjectDistance) * distToProjectedPlane
  );

  return { height: projectedObjectHeight, offset };
}
function findHorizontalIntersectionCoord(objectToFind, rayAngle) {
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
    objectToFind,
    intersectionX,
    intersectionY,
    xDelta,
    yDelta
  );
}

function findVerticalIntersectionCoord(objectToFind, rayAngle) {
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
    objectToFind,
    intersectionX,
    intersectionY,
    xDelta,
    yDelta
  );
}

function findNextObjectCoordinate(objectToFind, x, y, xDelta, yDelta) {
  let contentOfTile = map.getContentOfTile(x, y);
  while (
    contentOfTile !== objectToFind &&
    contentOfTile !== TILE_TYPE.OUT_OF_BOUND
  ) {
    x += xDelta;
    y += yDelta;
    contentOfTile = map.getContentOfTile(x, y);
  }
  if (contentOfTile == TILE_TYPE.OUT_OF_BOUND) {
    return undefined;
  }
  return { x, y };
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
