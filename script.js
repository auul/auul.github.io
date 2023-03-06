const canvas = document.getElementById("Canvas");
const ctx    = canvas.getContext("2d");

var touchCount = 0;
var pinching   = false;

function incTouch(evt)
{
	touchCount++;
	if (touchCount == 2) { pinching = true; }
}

function decTouch(evt)
{
	touchCount--;
	if (touchCount == 1) { pinching = false; }
}

function drawAll()
{
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font      = "16px sans-serif";
	if (pinching) { ctx.fillText("Currently pinching.", 0, 20); }
}

window.addEventListener("touchstart", incTouch);
window.addEventListener("touchend", decTouch);
window.addEventListener("touchmove", (evt) => {});
setInterval(drawAll, 16.7);
