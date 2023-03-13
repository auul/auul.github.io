const canvas = document.getElementById("Canvas");
const ctx    = canvas.getContext("2d");

var mousing     = true;
var clickOn     = false;
var clickOff    = false;
var clicking    = false;
const mouseXY   = [0, 0];
const mouseZoom = [0, 0];

var touchCount      = 0;
var pinching        = false;
var startPinchDelta = 0;
const startPinchMid = [0, 0];
const pinch         = [0, 0, 0, 0];

var updateCamFlag = true;
const playRect    = [0, 0, 640, 480];
const camXYZ      = [0, 0, 2];
const startCam    = [0, 0, 0];
const camOffset   = [0, 0];

function getDistance(fromX, fromY, toX, toY)
{
	return Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
}

function onMouseDown(evt)
{
	mouseXY[0]   = evt.pageX - canvas.offsetLeft;
	mouseXY[1]   = evt.pageY - canvas.offsetTop;
	mouseZoom[0] = (mouseXY[0] - camOffset[0]) / camXYZ[2];
	mouseZoom[1] = (mouseXY[1] - camOffset[1]) / camXYZ[2];

	clickOn  = true;
	clicking = true;
}

function onMouseUp(evt)
{
	mouseXY[0]   = evt.pageX - canvas.offsetLeft;
	mouseXY[1]   = evt.pageY - canvas.offsetTop;
	mouseZoom[0] = (mouseXY[0] - camOffset[0]) / camXYZ[2];
	mouseZoom[1] = (mouseXY[1] - camOffset[1]) / camXYZ[2];

	clickOff = true;
}

function onMouseMove(evt)
{
	mouseXY[0]   = evt.pageX - canvas.offsetLeft;
	mouseXY[1]   = evt.pageY - canvas.offsetTop;
	mouseZoom[0] = (mouseXY[0] - camOffset[0]) / camXYZ[2];
	mouseZoom[1] = (mouseXY[1] - camOffset[1]) / camXYZ[2];
}

function onTouchStart(evt)
{
	if (mousing) {
		mousing = false;
		removeEventListener("mousedown", onMouseDown);
		removeEventListener("mouseup", onMouseUp);
		removeEventListener("mousemove", onMouseMove);
	}

	touchCount++;
	if (touchCount == 1) {
		mouseXY[0]   = evt.targetTouches[0].pageX - canvas.offsetLeft;
		mouseXY[1]   = evt.targetTouches[0].pageY - canvas.offsetTop;
		mouseZoom[0] = (mouseXY[0] - camOffset[0]) / camXYZ[2];
		mouseZoom[1] = (mouseXY[1] - camOffset[1]) / camXYZ[2];

		clickOn  = true;
		clicking = true;
	} else if (touchCount = 2) {
		pinching = true;
		clickOff = true;

		pinch[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		pinch[1] = evt.targetTouches[0].pageY - canvas.offsetTop;
		pinch[2] = evt.targetTouches[1].pageX - canvas.offsetLeft;
		pinch[3] = evt.targetTouches[1].pageY - canvas.offsetTop;

		startPinchDelta
		 = getDistance(pinch[0], pinch[1], pinch[2], pinch[3]);

		startPinchMid[0] = (pinch[0] + pinch[2]) / 2;
		startPinchMid[1] = (pinch[1] + pinch[3]) / 2;

		startCam[0] = camXYZ[0];
		startCam[1] = camXYZ[1];
		startCam[2] = camXYZ[2];
	}
}

function onTouchEnd(evt)
{
	touchCount--;
	if (touchCount == 0) {
		clickOff = true;
	} else if (touchCount == 1) {
		pinching = false;
		clickOn  = true;

		mouseXY[0]   = evt.targetTouches[0].pageX - canvas.offsetLeft;
		mouseXY[1]   = evt.targetTouches[1].pageY - canvas.offsetTop;
		mouseZoom[0] = (mouseXY[0] - camOffset[0]) / camXYZ[2];
		mouseZoom[1] = (mouseXY[1] - camOffset[1]) / camXYZ[2];
	} else if (pinching) {
		pinch[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		pinch[1] = evt.targetTouches[0].pageY - canvas.offsetTop;
		pinch[2] = evt.targetTouches[1].pageX - canvas.offsetLeft;
		pinch[3] = evt.targetTouches[1].pageY - canvas.offsetTop;
	}
}

function onTouchMove(evt)
{
	if (touchCount == 1) {
		mouseXY[0]   = evt.targetTouches[0].pageX - canvas.offsetLeft;
		mouseXY[1]   = evt.targetTouches[0].pageY - canvas.offsetTop;
		mouseZoom[0] = (mouseXY[0] - camOffset[0]) / camXYZ[2];
		mouseZoom[1] = (mouseXY[1] - camOffset[1]) / camXYZ[2];
	} else if (pinching) {
		updateCamFlag = true;

		pinch[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		pinch[1] = evt.targetTouches[0].pageY - canvas.offsetTop;
		pinch[2] = evt.targetTouches[1].pageX - canvas.offsetLeft;
		pinch[3] = evt.targetTouches[1].pageY - canvas.offsetTop;

		camXYZ[2]
		 = startCam[2]
		   * (getDistance(pinch[0], pinch[1], pinch[2], pinch[3])
		      / startPinchDelta);
		camXYZ[0] = startCam[0]
			    - (((pinch[0] + pinch[2]) / 2) - startPinchMid[0])
			       / camXYZ[2];
		camXYZ[1] = startCam[1]
			    - (((pinch[1] + pinch[3]) / 2) - startPinchMid[1])
			       / camXYZ[2];
	}
}

function updateCamera()
{
	updateCamFlag = false;

	var minZoom;
	const minZoomX = canvas.width / (playRect[2] - playRect[0]);
	const minZoomY = canvas.height / (playRect[3] - playRect[1]);

	if (minZoomX > minZoomY) {
		minZoom = minZoomX;
	} else {
		minZoom = minZoomY;
	}

	if (camXYZ[2] < minZoom) { camXYZ[2] = minZoom; }

	const minCamX = (canvas.width / 2) / camXYZ[2];
	const minCamY = (canvas.height / 2) / camXYZ[2];
	const maxCamX = playRect[2] - minCamX;
	const maxCamY = playRect[3] - minCamY;

	if (camXYZ[0] < minCamX) {
		camXYZ[0] = minCamX;
	} else if (camXYZ[0] > maxCamX) {
		camXYZ[0] = maxCamX;
	}
	if (camXYZ[1] < minCamY) {
		camXYZ[1] = minCamY;
	} else if (camXYZ[1] > maxCamY) {
		camXYZ[1] = maxCamY;
	}

	camOffset[0] = (canvas.width / 2) - (camXYZ[0] * camXYZ[2]);
	camOffset[1] = (canvas.height / 2) - (camXYZ[1] * camXYZ[2]);

	mouseZoom[0] = (mouseXY[0] - camOffset[0]) / camXYZ[2];
	mouseZoom[1] = (mouseXY[1] - camOffset[1]) / camXYZ[2];
}

function cleanupFlags()
{
	clickOn = false;
	if (clickOff) {
		clickOff = false;
		clicking = false;
	}
}

function drawLine(line)
{
	ctx.strokeStyle = line[0];
	ctx.beginPath();
	ctx.moveTo(line[1], line[2]);
	ctx.lineTo(line[3], line[4]);
	ctx.stroke();
}

function drawZoomLine(line)
{
	ctx.strokeStyle = line[0];
	ctx.beginPath();
	ctx.moveTo(camOffset[0] + camXYZ[2] * line[1],
		   camOffset[1] + camXYZ[2] * line[2]);
	ctx.lineTo(camOffset[0] + camXYZ[2] * line[3],
		   camOffset[1] + camXYZ[2] * line[4]);
	ctx.stroke();
}

function doJit(jit) { return Math.random() * 2 * jit - jit; }

function drawJitteryLine(line, jit)
{
	ctx.strokeStyle = line[0];
	ctx.beginPath();
	ctx.moveTo(line[1] + doJit(jit), line[2] + doJit(jit));
	ctx.lineTo(line[3] + doJit(jit), line[4] + doJit(jit));
	ctx.stroke();
}

function drawJitteryZoomLine(line, jit)
{
	ctx.strokeStyle = line[0];
	ctx.beginPath();
	ctx.moveTo(camOffset[0] + camXYZ[2] * line[1] + doJit(jit),
		   camOffset[1] + camXYZ[2] * line[2] + doJit(jit));
	ctx.lineTo(camOffset[0] + camXYZ[2] * line[3] + doJit(jit),
		   camOffset[1] + camXYZ[2] * line[4] + doJit(jit));
	ctx.stroke();
}

window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchstart", onTouchStart);
window.addEventListener("touchend", onTouchEnd);
window.addEventListener("touchmove", onTouchMove);
