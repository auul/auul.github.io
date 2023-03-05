var canvas       = document.getElementById("Canvas");
var ctx          = canvas.getContext("2d");

function drawAll()
{
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.font = "20px sans-serif";
    ctx.strokeText("Hello world", 0, 0);
}

setInterval(drawAll, 16.7);
