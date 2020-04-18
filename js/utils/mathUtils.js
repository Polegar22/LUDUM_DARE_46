function computeAngle(angle) {
  if (angle < 0) angle = 360 + angle;
  return angle % 360;
}

function getTanDeg(deg) {
  var rad = (deg * Math.PI) / 180;
  return Math.tan(rad);
}

function getCosDeg(deg) {
  var rad = (deg * Math.PI) / 180;
  return Math.cos(rad);
}

function getSinDeg(deg) {
  var rad = (deg * Math.PI) / 180;
  return Math.sin(rad);
}

function getXDirectionBy(angle) {
  if ((angle >= 0 && angle <= 90) || (angle >= 270 && angle < 360)) {
    return 1;
  }
  return -1;
}

function getYDirectionBy(angle) {
  if (angle >= 180 && angle <= 360) {
    return 1;
  }
  return -1;
}

function ensureXDirection(xDelta, currentAngle) {
  var orientation = getXDirectionBy(currentAngle);

  if ((xDelta < 0 && orientation > 0) || (xDelta > 0 && orientation < 0))
    return -1 * xDelta;

  return xDelta;
}

function ensureYDirection(yDelta, currentAngle) {
  var orientation = getYDirectionBy(currentAngle);

  if ((yDelta < 0 && orientation > 0) || (yDelta > 0 && orientation < 0))
    return -1 * yDelta;

  return yDelta;
}
