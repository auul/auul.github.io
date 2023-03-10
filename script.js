const line = ["rgb(0, 255, 255)", 10, 10, 30, 30];

function drawAll()
{
	if (updateCamFlag) { updateCamera(); }

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawZoomLine(line);

	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font      = "16px sans-serif";

	cleanupFlags();
}

setInterval(drawAll, 16.7);
