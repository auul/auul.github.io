const canvas = document.getElementById("Canvas");
const ctx    = canvas.getContext("2d");

var mousing   = true;
var clickOn   = false;
var clickOff  = false;
var clicking  = false;
const mouseXY = [0, 0];

var touchCount      = 0;
var pinching        = false;
var startPinchDelta = 0;
var endPinchDelta   = 0;
const startPinchMid = [0, 0];
const endPinchMid   = [0, 0];
const pinch         = [0, 0, 0, 0];

var updateCamFlag = false;
const startCamXYZ = [0, 0, 0];
const camXYZ      = [0, 0, 2];
const camOffset   = [-10, 0];

function getDistance(fromX, fromY, toX, toY)
{
	return Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
}

function onMouseDown(evt)
{
	mouseXY[0] = evt.pageX - canvas.offsetLeft;
	mouseXY[1] = evt.pageY - canvas.offsetTop;

	clickOn  = true;
	clicking = true;
}

function onMouseUp(evt)
{
	mouseXY[0] = evt.pageX - canvas.offsetLeft;
	mouseXY[1] = evt.pageY - canvas.offsetTop;

	clickOff = true;
}

function onMouseMove(evt)
{
	mouseXY[0] = evt.pageX - canvas.offsetLeft;
	mouseXY[1] = evt.pageY - canvas.offsetTop;
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
		mouseXY[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		mouseXY[1] = evt.targetTouches[0].pageY - canvas.offsetTop;

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
		endPinchDelta = startPinchDelta;

		startPinchMid[0] = (pinch[0] + pinch[2]) / 2;
		startPinchMid[1] = (pinch[1] + pinch[3]) / 2;
		endPinchMid[0]   = startPinchMid[0];
		endPinchMid[1]   = startPinchMid[1];

		startCamXYZ[0] = camXYZ[0];
		startCamXYZ[1] = camXYZ[1];
		startCamXYZ[2] = camXYZ[2];
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

		mouseXY[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		mouseXY[1] = evt.targetTouches[1].pageY - canvas.offsetTop;
	} else if (pinching) {
		updateCamFlag = true;

		pinch[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		pinch[1] = evt.targetTouches[0].pageY - canvas.offsetTop;
		pinch[2] = evt.targetTouches[1].pageX - canvas.offsetLeft;
		pinch[3] = evt.targetTouches[1].pageY - canvas.offsetTop;

		endPinchDelta
		 = getDistance(pinch[0], pinch[1], pinch[2], pinch[3]);

		endPinchMid[0] = (pinch[0] + pinch[2]) / 2;
		endPinchMid[1] = (pinch[1] + pinch[3]) / 2;
	}
}

function onTouchMove(evt)
{
	if (touchCount == 1) {
		mouseXY[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		mouseXY[1] = evt.targetTouches[0].pageY - canvas.offsetTop;
	} else if (pinching) {
		updateCamFlag = true;

		pinch[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		pinch[1] = evt.targetTouches[0].pageY - canvas.offsetTop;
		pinch[2] = evt.targetTouches[1].pageX - canvas.offsetLeft;
		pinch[3] = evt.targetTouches[1].pageY - canvas.offsetTop;

		endPinchDelta
		 = getDistance(pinch[0], pinch[1], pinch[2], pinch[3]);

		endPinchMid[0] = (pinch[0] + pinch[2]) / 2;
		endPinchMid[1] = (pinch[1] + pinch[3]) / 2;
	}
}

function updateCamera()
{
	updateCamFlag = false;

	camXYZ[2] = startCamXYZ[2] * (endPinchDelta / startPinchDelta);
	camXYZ[0]
	 = camXYZ[0] + ((endPinchMid[0] - startPinchMid[0]) / camXYZ[2]);
	camXYZ[1]
	 = camXYZ[1] + ((endPinchMid[1] - startPinchMid[1]) / camXYZ[2]);

	startPinchMid[0] = endPinchMid[0];
	startPinchMid[1] = endPinchMid[1];
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

window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchstart", onTouchStart);
window.addEventListener("touchend", onTouchEnd);
window.addEventListener("touchmove", onTouchMove);
