const canvas = document.getElementById("Canvas");
const ctx    = canvas.getContext("2d");

var mouseActive  = false;
var clickOn      = false;
var clickOff     = false;
var clicking     = false;
const mouseCoord = [0, 0];

var minCamX    = 0;
var minCamY    = 0;
var maxCamX    = 640;
var maxCamY    = 640;
var minZoom    = 0.1;
var maxZoom    = 10.0;
var camX       = 0.0;
var camY       = 0.0;
var zoom       = 1.0;
var newCamX    = camX;
var newCamY    = camY;
var newZoom    = zoom;
var deltaCamX  = 0.0;
var deltaCamY  = 0.0;
var camOffLeft = (canvas.width / 2) - (camX * zoom);
var camOffTop  = (canvas.height / 2) - (camY * zoom);

var touchCount     = 0;
var pinching       = false;
const pinch        = [0, 0, 0, 0];
var startMidX      = 0.0;
var startMidY      = 0.0;
var startPinchDist = 0.0;
var startCamX      = 0.0;
var startCamY      = 0.0;
var startZoom      = 1.0;

function getDistance(fromX, fromY, toX, toY)
{
	return Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
}

function incTouch(evt)
{
	touchCount++;
	if (touchCount == 1) {
		mouseActive   = true;
		mouseCoord[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		mouseCoord[1] = evt.targetTouches[0].pageY - canvas.offsetTop;
		clickOn       = true;
		clicking      = true;
	} else if (touchCount == 2) {
		mouseActive = false;
		pinching    = true;
		pinch[0]    = evt.targetTouches[0].pageX - canvas.offsetLeft;
		pinch[1]    = evt.targetTouches[0].pageY - canvas.offsetTop;
		pinch[2]    = evt.targetTouches[1].pageX - canvas.offsetLeft;
		pinch[3]    = evt.targetTouches[1].pageY - canvas.offsetTop;

		startCamX = camX;
		startCamY = camY;
		startZoom = zoom;

		startMidX = (pinch[0] + pinch[2]) / 2;
		startMidY = (pinch[1] + pinch[3]) / 2;
		startPinchDist
		 = getDistance(pinch[0], pinch[1], pinch[2], pinch[3]);
	}
}

function decTouch(evt)
{
	touchCount--;
	if (touchCount == 1) {
		mouseActive = true;
		pinching    = false;
	} else if (touchCount == 0) {
		mouseActive = false;
		clickOff    = true;
	}
}

function moveTouch(evt)
{
	if (pinching) {
		pinch[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		pinch[1] = evt.targetTouches[0].pageY - canvas.offsetTop;
		pinch[2] = evt.targetTouches[1].pageX - canvas.offsetLeft;
		pinch[3] = evt.targetTouches[1].pageY - canvas.offsetTop;
	} else {
		mouseCoord[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		mouseCoord[1] = evt.targetTouches[0].pageY - canvas.offsetTop;
	}
}

function moveMouse(evt)
{
	if (touchCount == 0) {
		mouseActive   = true;
		mouseCoord[0] = evt.pageX - canvas.offsetLeft;
		mouseCoord[1] = evt.pageY - canvas.offsetTop;
	}
}

function mouseDown(evt)
{
	if (touchCount == 0) {
		clickOn       = true;
		clicking      = true;
		mouseCoord[0] = evt.pageX - canvas.offsetLeft;
		mouseCoord[1] = evt.pageY - canvas.offsetTop;
	}
}

function mouseUp(evt)
{
	if (touchCount == 0) {
		clickOff      = true;
		clicking      = true;
		mouseCoord[0] = evt.pageX - canvas.offsetLeft;
		mouseCoord[1] = evt.pageY - canvas.offsetTop;
	}
}

function updateCamera()
{
	if (pinching) {
		const pinchDist
		 = getDistance(pinch[0], pinch[1], pinch[2], pinch[3]);
		newZoom = startZoom * (pinchDist / startPinchDist);

		const midX   = (pinch[0] + pinch[2]) / 2;
		const midY   = (pinch[1] + pinch[3]) / 2;
		const deltaX = (midX - startMidX) / zoom;
		const deltaY = (midY - startMidY) / zoom;
		deltaCamX    = startCamX - deltaX - camX;
		deltaCamX    = startCamY - deltaY - camY;
		newCamX      = startCamX - deltaX;
		newCamY      = startCamY - deltaY;
	} else if (deltaCamX != 0.0 || deltaCamY != 0.0) {
		newCamX = camX + deltaCamX;
		newCamY = camY + deltaCamY;
		deltaCamX *= 0.9;
		deltaCamY *= 0.9;
	}

	if (newCamX < minCamX) { newCamX = minCamX; }
	if (newCamX > maxCamX) { newCamX = maxCamX; }
	if (newCamY < minCamY) { newCamY = minCamY; }
	if (newCamY > maxCamY) { newCamY = maxCamY; }
	if (newZoom < minZoom) { newZoom = minZoom; }
	if (newZoom > maxZoom) { newZoom = maxZoom; }

	if (camX != newCamX || camY != newCamY || zoom != newZoom) {
		camX = newCamX;
		camY = newCamY;
		zoom = newZoom;

		camOffLeft = (canvas.width / 2) - (camX * zoom);
		camOffTop  = (canvas.height / 2) - (camY * zoom);
	}
}

function cleanupFlags()
{
	clickOn = false;
	if (clickOff) {
		clicking = flse;
		clickOff = false;
	}
}

window.addEventListener("touchstart", incTouch);
window.addEventListener("touchend", decTouch);
window.addEventListener("touchmove", moveTouch);
window.addEventListener("mousemove", moveMouse);
window.addEventListener("mousedown", mouseDown);
window.addEventListener("mouseup", mouseUp);

function drawLine(line)
{
	ctx.strokeStyle = line[0];
	ctx.beginPath();
	ctx.moveTo(line[1], line[2]);
	ctx.lineTo(line[3], line[4]);
	ctx.stroke();
}

function drawZoomedLine(line)
{
	ctx.strokeStyle = line[0];
	ctx.beginPath();
	ctx.moveTo(camOffLeft + zoom * line[1], camOffTop + zoom * line[2]);
	ctx.lineTo(camOffLeft + zoom * line[3], camOffTop + zoom * line[4]);
	ctx.stroke();
}
