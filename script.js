var canvas       = document.getElementById("Canvas");
var ctx          = canvas.getContext("2d");

function drawAll()
{
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

setInterval(drawAll, 16.7);
