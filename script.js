var canvas       = document.getElementById("Canvas");
var ctx          = canvas.getContext("2d");

function drawAll()
{
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100, 100);
    ctx.stroke();

    ctx.font = "48px sans-serif";
    ctx.strokeText("Hello world", 0, 100);
}

setInterval(drawAll, 16.7);
