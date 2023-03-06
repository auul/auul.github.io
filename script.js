const canvas   = document.getElementById("Canvas");
const ctx      = canvas.getContext("2d");
var touchCount = 0;

function getTouches(evt) { touchCount = evt.targetTouches.length; }

function drawAll()
{
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font      = "16px sans-serif";
	ctx.fillText("Touches: " + touchCount, 0, 30);
}

window.addEventListener("touchstart", getTouches);
window.addEventListener("touchend", getTouches);
window.addEventListener("touchmove", getTouches);
setInterval(drawAll, 16.7);
