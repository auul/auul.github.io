var canvas         = document.getElementById("Canvas");
var ctx            = canvas.getContext("2d");
var touchesStarted = 0;
var touchesEnded   = 0;

function drawAll()
{
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "20px sans-serif";
    ctx.fillText("Touches Started: " + touchesStarted, 0, 30);
    ctx.fillText("Touches Ended: " + touchesEnded, 0, 60);
}

window.addEventListener("touchmove", (evt) => {});
window.addEventListener("touchstart", (evt) => {
    touchesStarted++;
});
window.addEventListener("touchend", (evt) => {
    touchesEnded++;
});
setInterval(drawAll, 16.7);
