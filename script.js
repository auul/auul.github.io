var canvas       = document.getElementById("Canvas");
var ctx          = canvas.getContext("2d");
var mouseX       = 0;
var mouseY       = 0;
var click        = false;
var unclick      = false;
var objList      = [];
var particleList = [];

const polygon = new Array(17);
function initPolygons()
{
	polygon[1] = [[null, 0.0, -0.25, 0.0, 0.25]];
	polygon[2] =
	 [[null, 0.0, -0.333, 0.0, 0.333], [null, -0.333, 0.0, 0.333, 0.0]];
	for (let i = 3; i < polygon.length; i++) {
		polygon[i] = new Array(i);
		for (let j = 1; j <= i; j++) {
			polygon[i][j - 1] = [
				null,
				0.5
				 * Math.cos(-((Math.PI / 2)
					      - (2 * (j - 1) * Math.PI / i))),
				0.5
				 * Math.sin(-((Math.PI / 2)
					      - (2 * (j - 1) * Math.PI / i))),
				0.5
				 * Math.cos(
				  -((Math.PI / 2) - (2 * j * Math.PI / i))),
				0.5
				 * Math.sin(
				  -((Math.PI / 2) - (2 * j * Math.PI / i)))
			];
		}
	}
}
initPolygons();

function onMouseMove(evt)
{
	var bbox = canvas.getBoundingClientRect();
	mouseX   = evt.clientX - bbox.left;
	mouseY   = evt.clientY - bbox.top;
}

function onMouseDown(evt) { click = true; }

function onMouseUp(evt) { unclick = true; }

function drawJitteryLine(line, jit)
{
	ctx.strokeStyle = line[0];
	ctx.beginPath();
	ctx.moveTo(line[1] + (Math.random() - 1) * jit,
		   line[2] + (Math.random() - 1) * jit);
	ctx.lineTo(line[3] + (Math.random() - 1) * jit,
		   line[4] + (Math.random() - 1) * jit);
	ctx.stroke();
}

function drawLine(line)
{
	ctx.strokeStyle = line[0];
	ctx.beginPath();
	ctx.moveTo(line[1], line[2]);
	ctx.lineTo(line[3], line[4]);
	ctx.stroke();
}

function transformLine(line, scale, theta, deltaX, deltaY)
{
	return [
		line[0],
		scale * (line[1] * Math.cos(theta) - line[2] * Math.sin(theta))
		 + deltaX,
		scale * (line[2] * Math.cos(theta) + line[1] * Math.sin(theta))
		 + deltaY,
		scale * (line[3] * Math.cos(theta) - line[4] * Math.sin(theta))
		 + deltaX,
		scale * (line[4] * Math.cos(theta) + line[3] * Math.sin(theta))
		 + deltaY
	];
}

function colorVector(str)
{
	let colorSplit = str.split(",");
	return [
		parseInt(colorSplit[0].slice(4, colorSplit[0].length)),
		parseInt(colorSplit[1]),
		parseInt(colorSplit[2].slice(0, colorSplit[2].length - 1))
	];
}

function colorString(rgb)
{
	return `rgb(${Math.floor(rgb[0])}, ${Math.floor(rgb[1])}, ${
	 Math.floor(rgb[2])})`
}

class Particle
{
	constructor(startLine, endLine, spinCount, frameCount, triggerFunc)
	{
		this.frames      = new Array(frameCount);
		this.frameAt     = 0;
		this.triggerFunc = triggerFunc;

		let rgb    = colorVector(startLine[0]);
		let x      = (startLine[1] + startLine[3]) / 2;
		let y      = (startLine[2] + startLine[4]) / 2;
		let radius = Math.sqrt(Math.pow(startLine[3] - x, 2)
				       + Math.pow(startLine[4] - y, 2));
		let theta;
		if (startLine[3] < startLine[1]) {
			theta = Math.asin(-(startLine[4] - y) / radius);
		} else {
			theta = Math.asin((startLine[4] - y) / radius);
		}

		let endRgb    = colorVector(endLine[0]);
		let endX      = (endLine[1] + endLine[3]) / 2;
		let endY      = (endLine[2] + endLine[4]) / 2;
		let endRadius = Math.sqrt(Math.pow(endLine[3] - endX, 2)
					  + Math.pow(endLine[4] - endY, 2));
		let endTheta;
		if (endLine[3] < endLine[1]) {
			endTheta = Math.asin(-(endLine[4] - endY) / endRadius)
				   + spinCount * Math.PI;
		} else {
			endTheta = Math.asin((endLine[4] - endY) / endRadius)
				   + spinCount * Math.PI;
		}

		let stepRgb = [
			(endRgb[0] - rgb[0]) / (frameCount - 1),
			(endRgb[1] - rgb[1]) / (frameCount - 1),
			(endRgb[2] - rgb[2]) / (frameCount - 1)
		];
		let stepX      = (endX - x) / (frameCount - 1);
		let stepY      = (endY - y) / (frameCount - 1);
		let stepRadius = (endRadius - radius) / (frameCount - 1);
		let stepTheta  = (endTheta - theta) / (frameCount - 1);

		this.frames[0] = [
			startLine[0], x - radius * Math.cos(theta),
			y - radius * Math.sin(theta),
			x + radius * Math.cos(theta),
			y + radius * Math.sin(theta)
		];

		for (let i = 0; i < frameCount; i++) {
			rgb[0] += stepRgb[0];
			rgb[1] += stepRgb[1];
			rgb[2] += stepRgb[2];
			x += stepX;
			y += stepY;
			radius += stepRadius;
			theta += stepTheta;

			this.frames[i] = [
				colorString(rgb), x - radius * Math.cos(theta),
				y - radius * Math.sin(theta),
				x + radius * Math.cos(theta),
				y + radius * Math.sin(theta)
			];
		}
	}

	destroy()
	{
		var index = particleList.indexOf(this);
		if (index >= 0) { particleList.splice(index, 1); }
	}

	draw()
	{
		drawLine(this.frames[this.frameAt]);
		this.frameAt++;
		if (this.frameAt >= this.frames.length) {
			if (this.triggerFunc) { this.triggerFunc(); }
			this.destroy();
		}
	}
}

class Obj
{
	adjustBoundBox(line)
	{
		if (line[1] < this.bbox[0]) { this.bbox[0] = line[1]; }
		if (line[1] > this.bbox[2]) { this.bbox[2] = line[1]; }
		if (line[2] < this.bbox[1]) { this.bbox[1] = line[2]; }
		if (line[2] > this.bbox[3]) { this.bbox[3] = line[2]; }
		if (line[3] < this.bbox[0]) { this.bbox[0] = line[3]; }
		if (line[3] > this.bbox[2]) { this.bbox[2] = line[3]; }
		if (line[4] < this.bbox[1]) { this.bbox[1] = line[4]; }
		if (line[4] > this.bbox[3]) { this.bbox[3] = line[4]; }
	}

	constructor(unitList, color, scale, theta, centerX, centerY, jit,
		    onDraw)
	{
		this._scale  = scale;
		this._theta  = theta;
		this._x      = centerX;
		this._y      = centerY;
		this._jit    = jit;
		this._onDraw = onDraw;

		this.bbox       = [canvas.width, canvas.height, 0, 0];
		this.recalc     = false;
		this._mouseOver = false;
		this._mouseDown = false;
		this._mouseUp   = false;
		this.unitList   = new Array(unitList.length);
		this.lineList   = new Array(unitList.length);

		for (let i = 0; i < unitList.length; i++) {
			if (unitList[i][0] == null) {
				this.unitList[i] = [
					color, unitList[i][1], unitList[i][2],
					unitList[i][3], unitList[i][4]
				];
			} else {
				this.unitList[i] = [
					unitList[i][0], unitList[i][1],
					unitList[i][2], unitList[i][3],
					unitList[i][4]
				];
			}
			this.lineList[i] = transformLine(
			 this.unitList[i], scale, theta, centerX, centerY);
			this.adjustBoundBox(this.lineList[i]);
		}
	}

	get scale() { return this._scale; }
	set scale(value)
	{
		this._scale = value;
		this.recalc = true;
	}

	get theta() { return this._theta; }
	set theta(value)
	{
		while (value < 0) {
			value += 2 * Math.PI;
		}
		while (value > 2 * Math.PI) {
			value -= 2 * Math.PI;
		}

		this._theta = value;
		this.recalc = true;
	}

	get x() { return this._x; }
	set x(value)
	{
		this._x     = value;
		this.recalc = true;
	}

	get y() { return this._y; }
	set y(value)
	{
		this._y     = value;
		this.recalc = true;
	}

	get jit() { return this._jit; }
	set jit(value) { this._jit = value; }

	get onDraw() { return this._onDraw; }
	set onDraw(func) { this._onDraw = func; }

	get mouseOver() { return this._mouseOver; }
	get mouseDown() { return this._mouseDown; }
	get mouseUp() { return this._mouseUp; }

	draw()
	{
		if (this.recalc) {
			this.bbox[0] = canvas.width;
			this.bbox[1] = canvas.height;
			this.bbox[2] = 0;
			this.bbox[3] = 0;

			for (let i = 0; i < this.lineList.length; i++) {
				this.lineList[i]
				 = transformLine(this.unitList[i], this._scale,
						 this._theta, this._x, this._y);
				this.adjustBoundBox(this.lineList[i]);
			}
			this.recalc = false;
		}

		if (mouseX > this.bbox[0] && mouseY > this.bbox[1]
		    && mouseX < this.bbox[2] && mouseY < this.bbox[3]) {
			this._mouseOver = true;

			if (click) {
				this._mouseDown = true;
			} else if (unclick) {
				this._mouseDown = false;
				this._mouseUp   = true;
			}
		} else {
			this._mouseOver = false;
		}

		if (this._onDraw) { this._onDraw(this); }

		for (let i = 0; i < this.lineList.length; i++) {
			drawJitteryLine(this.lineList[i], this._jit);
		}

		this._mouseUp = false;
	}
}

function drawAll()
{
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < objList.length; i++) {
		objList[i].draw();
	}
	for (let i = 0; i < particleList.length; i++) {
		particleList[i].draw();
	}

	click   = false;
	unclick = false;
}

objList.push(
 new Obj(polygon[6], "rgb(0, 255, 255)", 100, 0.0, 200, 200, 1, (THIS) => {
	 if (THIS.mouseDown) {
		 THIS.x = mouseX;
		 THIS.y = mouseY;
	 }
 }));

window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);
setInterval(drawAll, 16.7)