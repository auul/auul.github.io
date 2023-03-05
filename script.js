var canvas       = document.getElementById("Canvas");
var ctx          = canvas.getContext("2d");

function drawAll()
{
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "16px sans-serif";
    ctx.fillText("Hello, World!", 0, 0);
}

setInterval(drawAll, 16.7);
