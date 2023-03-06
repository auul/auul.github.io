const canvas = document.getElementById("Canvas");
const ctx    = canvas.getContext("2d");

const firstTouch  = [0, 0];
const secondTouch = [0, 0];
const touches     = [null, null];

function getTouches(evt)
{
	switch (evt.targetTouches.length) {
	case 0:
		touches[0] = null;
		touches[1] = null;
		break;
	case 1:
		firstTouch[0] = evt.targetTouches[0].pageX - canvas.offsetLeft;
		firstTouch[1] = evt.targetTouches[0].pageY - canvas.offsetTop;

		touches[0] = firstTouch;
		touches[1] = null;
		break;
	default:
		firstTouch[0]  = evt.targetTouches[0].pageX - canvas.offsetLeft;
		firstTouch[1]  = evt.targetTouches[0].pageY - canvas.offsetTop;
		secondTouch[0] = evt.targetTouches[1].pageX - canvas.offsetLeft;
		secondTouch[1] = evt.targetTouches[1].pageY - canvas.offsetTop;

		touches[0] = firstTouch;
		touches[1] = secondTouch;
		break;
	}
}

function drawAll()
{
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font      = "16px sans-serif";
	if (touches[0]) {
		if (touches[1]) {
			ctx.fillText(
			 "[[" + touches[0][0] + ", " + touches[0][1] + "], [",
			 touches[1][0] + ", " + touches[1][1] + "]]", 0, 20);
		} else {
			ctx.fillText("[[" + touches[0][0] + ", " + touches[0][1]
				      + "], null]",
				     0, 20);
		}
	} else {
		ctx.fillText("[null, null]", 0, 20);
	}
}

window.addEventListener("touchstart", (evt) => getTouches);
window.addEventListener("touchend", (evt) => getTouches);
window.addEventListener("touchmove", (evt) => getTouches);
setInterval(drawAll, 16.7);
