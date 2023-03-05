var canvas  = document.getElementById("Canvas");
var ctx     = canvas.getContext("2d");
var touches = [[15, 200], [350, 104]];

function drawAll()
{
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "20px sans-serif";
    if (touches) {
        for (let i = 0; i < touches.length; i++) {
            ctx.fillText("Touch " + i + ": " + touches[i][0] + ", " + touches[i][1], 0, i * 30 + 30);
        }
    }
}

window.addEventListener("touchmove", (evt) => {
});
window.addEventListener("touchstart", (evt) => {
});
window.addEventListener("touchend", (evt) => {
});
setInterval(drawAll, 16.7);
