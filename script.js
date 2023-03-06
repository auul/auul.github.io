var canvas  = document.getElementById("Canvas");
var ctx     = canvas.getContext("2d");

const firstTouch = [0, 0];
const lastTouch  = [0, 0];
const touches    = [null, null];

function getTouches(evt)
{
    switch (evt.targetTouches.length) {
    case 0:
        touches[0] = null;
        touches[1] = null;
        break;
    case 1:
        touches[0] = firstTouch;
        touches[1] = null;
        break;
    default:
        touches[0] = firstTouch;
        touches[1] = lastTouch;
        break;
    }

    /*
    touches = new Array(evt.targetTouches.length);
    for (let i = 0; i < evt.targetTouches.length; i++) {
        touches[i] = [evt.targetTouches[i].pageX - canvas.offsetLeft,
                      evt.targetTouches[i].pageY - canvas.offsetTop];
    }
    */
}

function drawAll()
{
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "20px sans-serif";
    for (let i = 0; touches[i]; i++) {
        ctx.fillText("Touch " + i + ": " + touches[i][0] + ", " + touches[i][1], 0, i * 30 + 30);
    }
}

window.addEventListener("touchmove", getTouches);
window.addEventListener("touchstart", getTouches);
window.addEventListener("touchend", getTouches);
setInterval(drawAll, 16.7);
