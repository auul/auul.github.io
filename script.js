const canvas = document.getElementById("Canvas");
const ctx    = canvas.getContext("2d");

var camX = 0.0;
var camY = 0.0;
var zoom = 1.0;

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
	if (touchCount == 2) {
		pinching = true;
		pinch[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		pinch[1] = evt.targetTouches[0].pageY - canvas.offsetTop;
		pinch[2] = evt.targetTouches[1].pageX - canvas.offsetLeft;
		pinch[3] = evt.targetTouches[1].pageY - canvas.offsetTop;

		startCamX = camX;
		startCamY = camY;
		startZoom = zoom;

		startMidX = (pinch[0] + pinch[2]) / 2;
		startMidY = (pinch[1] + pinch[3]) / 2;
		startPinchDist
		 = getDistance(pinch[0], pinch[1], pinch[2], pinch[3]);
	}
}

function moveTouch(evt)
{
	if (pinching) {
		pinch[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		pinch[1] = evt.targetTouches[0].pageY - canvas.offsetTop;
		pinch[2] = evt.targetTouches[1].pageX - canvas.offsetLeft;
		pinch[3] = evt.targetTouches[1].pageY - canvas.offsetTop;
	}
}

function decTouch(evt)
{
	touchCount--;
	if (touchCount == 1) { pinching = false; }
}

function doPinch()
{
	const pinchDist = getDistance(pinch[0], pinch[1], pinch[2], pinch[3]);
	zoom            = startZoom * (pinchDist / startPinchDist);

	const midX = (pinch[0] + pinch[2]) / 2;
	const midY = (pinch[1] + pinch[3]) / 2;
	//	camX       = startCamX + (((midX - startMidX) * zoom) /
	// startZoom);
	//	camY       = startCamY + (((midY - startMidY) * zoom) /
	// startZoom);
}

function drawAll()
{
	if (pinching) { doPinch(); }

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font      = "16px sans-serif";
	ctx.fillText("Cam: " + camX + ", " + camY, 0, 20);
	ctx.fillText("Zoom: " + zoom, 0, 40);

	ctx.strokeStyle = "rgb(0, 255, 0)";
	ctx.beginPath();
	ctx.moveTo((canvas.width / 2) - (camX * zoom) - (20 * zoom),
		   (canvas.height / 2) - (camY * zoom));
	ctx.lineTo((canvas.width / 2) - (camX * zoom) + (20 * zoom),
		   (canvas.height / 2) - (camY * zoom));
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo((canvas.width / 2) - (camX * zoom),
		   (canvas.height / 2) - (camY * zoom) - (10 * zoom));
	ctx.lineTo((canvas.width / 2) - (camX * zoom),
		   (canvas.height / 2) - (camY * zoom) + (10 * zoom));
	ctx.stroke();
}

window.addEventListener("touchstart", incTouch);
window.addEventListener("touchend", decTouch);
window.addEventListener("touchmove", moveTouch);
setInterval(drawAll, 16.7);
