var canvas       = document.getElementById("Canvas");
var ctx          = canvas.getContext("2d");
var mouseX       = 0;
var mouseY       = 0;
var clickOn      = false;
var clickOff     = false;
var clicking     = false;
var objList      = [];
var particleList = [];

var gridWin   = [0, 0, canvas.width, canvas.height];
var gridLeftX = 0;
var gridTopY  = 0;
var gridScale = 0;
var gridCols  = 0;
var gridRows  = 0;
var grid      = null;
var gridValue = null;
var gridDir   = null;
var onGrid    = null;

var atObj    = null;
var atCell   = [-1, -1];
var moveDir  = 0;
var makeMove = false;

const type = {
	"A": [
		[null, -0.333, 0.5, -0.333, -0.25],
		[null, -0.333, -0.25, -0.167, -0.5],
		[null, -0.167, -0.5, 0.167, -0.5],
		[null, 0.167, -0.5, 0.333, -0.25],
		[null, 0.333, -0.25, 0.333, 0.5],
		[null, -0.333, 0.0, 0.333, 0.0]
	],
	"B": [
		[null, -0.333, 0.5, -0.333, -0.5],
		[null, -0.333, -0.5, 0.167, -0.5],
		[null, 0.167, -0.5, 0.333, -0.25],
		[null, 0.333, -0.25, 0.167, 0.0],
		[null, -0.333, 0.0, 0.167, 0.0],
		[null, 0.167, 0.0, 0.333, 0.25],
		[null, 0.333, 0.25, 0.167, 0.5], [null, 0.167, 0.5, -0.333, 0.5]
	],
	"C": [
		[null, 0.333, -0.25, 0.167, -0.5],
		[null, 0.167, -0.5, -0.167, -0.5],
		[null, -0.167, -0.5, -0.333, -0.25],
		[null, -0.333, -0.25, -0.333, 0.25],
		[null, -0.333, 0.25, -0.167, 0.5],
		[null, -0.167, 0.5, 0.167, 0.5], [null, 0.167, 0.5, 0.333, 0.25]
	],
	"D": [
		[null, -0.333, -0.5, 0.167, -0.5],
		[null, 0.167, -0.5, 0.333, -0.25],
		[null, 0.333, -0.25, 0.333, 0.25],
		[null, 0.333, 0.25, 0.167, 0.5],
		[null, 0.167, 0.5, -0.333, 0.5],
		[null, -0.333, 0.5, -0.333, -0.5]
	],
	"E": [
		[null, -0.333, -0.5, 0.333, -0.5],
		[null, -0.333, -0.5, -0.333, 0.5],
		[null, -0.333, 0.0, 0.167, 0.0], [null, -0.333, 0.5, 0.333, 0.5]
	],
	"F": [
		[null, -0.333, -0.5, 0.333, -0.5],
		[null, -0.333, -0.5, -0.333, 0.5],
		[null, -0.333, 0.0, 0.167, 0.0]
	],
	"G": [
		[null, 0.333, -0.25, 0.167, -0.5],
		[null, 0.167, -0.5, -0.167, -0.5],
		[null, -0.167, -0.5, -0.333, -0.25],
		[null, -0.333, -0.25, -0.333, 0.25],
		[null, -0.333, 0.25, -0.167, 0.5],
		[null, -0.167, 0.5, 0.167, 0.5],
		[null, 0.167, 0.5, 0.333, 0.25],
		[null, 0.333, 0.25, 0.333, 0.0], [null, 0.333, 0.0, 0.0, 0.0]
	],
	"H": [
		[null, -0.333, -0.5, -0.333, 0.5],
		[null, -0.333, 0.0, 0.333, 0.0], [null, 0.333, -0.5, 0.333, 0.5]
	],
	"I": [
		[null, -0.333, -0.5, 0.333, -0.5], [null, 0.0, -0.5, 0.0, 0.5],
		[null, -0.333, 0.5, 0.333, 0.5]
	],
	"J": [
		[null, 0.333, -0.5, 0.333, 0.25],
		[null, 0.333, 0.25, 0.167, 0.5],
		[null, 0.167, 0.5, -0.167, 0.5],
		[null, -0.167, 0.5, -0.333, 0.25]
	],
	"K": [
		[null, -0.333, -0.5, -0.333, 0.5],
		[null, -0.333, 0.0, 0.0, 0.0], [null, 0.0, 0.0, 0.333, -0.5],
		[null, 0.0, 0.0, 0.333, 0.5]
	],
	"L":
	 [[null, -0.333, -0.5, -0.333, 0.5], [null, -0.333, 0.5, 0.333, 0.5]],
	"M": [
		[null, -0.333, 0.5, -0.333, -0.5],
		[null, -0.333, -0.5, 0.0, 0.25], [null, 0.0, 0.25, 0.333, -0.5],
		[null, 0.333, -0.5, 0.333, 0.5]
	],
	"N": [
		[null, -0.333, 0.5, -0.333, -0.5],
		[null, -0.333, -0.5, 0.333, 0.5],
		[null, 0.333, 0.5, 0.333, -0.5]
	],
	"O": [
		[null, -0.167, -0.5, 0.167, -0.5],
		[null, 0.167, -0.5, 0.333, -0.25],
		[null, 0.333, -0.25, 0.333, 0.25],
		[null, 0.333, 0.25, 0.167, 0.5],
		[null, 0.167, 0.5, -0.167, 0.5],
		[null, -0.167, 0.5, -0.333, 0.25],
		[null, -0.333, 0.25, -0.333, -0.25],
		[null, -0.333, -0.25, -0.167, -0.5]
	],
	"P": [
		[null, -0.333, 0.5, -0.333, -0.5],
		[null, -0.333, -0.5, 0.167, -0.5],
		[null, 0.167, -0.5, 0.333, -0.25],
		[null, 0.333, -0.25, 0.167, 0.0],
		[null, 0.167, 0.0, -0.333, 0.0]
	],
	"Q": [
		[null, -0.167, -0.5, 0.167, -0.5],
		[null, 0.167, -0.5, 0.333, -0.25],
		[null, 0.333, -0.25, 0.333, 0.25],
		[null, 0.333, 0.25, 0.167, 0.5],
		[null, 0.167, 0.5, -0.167, 0.5],
		[null, -0.167, 0.5, -0.333, 0.25],
		[null, -0.333, 0.25, -0.333, -0.25],
		[null, -0.333, -0.25, -0.167, -0.5],
		[null, 0.0, 0.0, 0.333, 0.5]
	],
	"R": [
		[null, -0.333, 0.5, -0.333, -0.5],
		[null, -0.333, -0.5, 0.167, -0.5],
		[null, 0.167, -0.5, 0.333, -0.25],
		[null, 0.333, -0.25, 0.167, 0.0],
		[null, 0.167, 0.0, -0.333, 0.0], [null, 0.167, 0.0, 0.333, 0.5]
	],
	"S": [
		[null, 0.333, -0.333, 0.167, -0.5],
		[null, 0.167, -0.5, -0.167, -0.5],
		[null, -0.167, -0.5, -0.333, -0.333],
		[null, -0.333, -0.333, -0.333, -0.167],
		[null, -0.333, -0.167, -0.167, 0.0],
		[null, -0.167, 0.0, 0.167, 0.0],
		[null, 0.167, 0.0, 0.333, 0.167],
		[null, 0.333, 0.167, 0.333, 0.333],
		[null, 0.333, 0.333, 0.167, 0.5],
		[null, 0.167, 0.5, -0.167, 0.5],
		[null, -0.167, 0.5, -0.333, 0.333]
	],
	"T": [[null, -0.333, -0.5, 0.333, -0.5], [null, 0.0, -0.5, 0.0, 0.5]],
	"U": [
		[null, -0.333, -0.5, -0.333, 0.25],
		[null, -0.333, 0.25, -0.167, 0.5],
		[null, -0.167, 0.5, 0.167, 0.5],
		[null, 0.167, 0.5, 0.333, 0.25],
		[null, 0.333, 0.25, 0.333, -0.5]
	],
	"V": [
		[null, -0.333, -0.5, -0.333, 0.0],
		[null, -0.333, 0.0, 0.0, 0.5], [null, 0.0, 0.5, 0.333, 0.0],
		[null, 0.333, 0.0, 0.333, -0.5]
	],
	"W": [
		[null, -0.333, -0.5, -0.333, 0.5],
		[null, -0.333, 0.5, 0.0, -0.25], [null, 0.0, -0.25, 0.333, 0.5],
		[null, 0.333, 0.5, 0.333, -0.5]
	],
	"X": [
		[null, -0.333, -0.5, -0.333, -0.25],
		[null, -0.333, -0.25, 0.333, 0.25],
		[null, 0.333, 0.25, 0.333, 0.5],
		[null, -0.333, 0.5, -0.333, 0.25],
		[null, -0.333, 0.25, 0.333, -0.25],
		[null, 0.333, -0.25, 0.333, -0.5]
	],
	"Y": [
		[null, -0.333, -0.5, -0.333, -0.25],
		[null, -0.333, -0.25, 0.0, 0.0], [null, 0.0, 0.0, 0.333, -0.25],
		[null, 0.333, -0.25, 0.333, -0.5], [null, 0.0, 0.0, 0.0, 0.5]
	],
	"Z": [
		[null, -0.333, -0.5, 0.333, -0.5],
		[null, 0.333, -0.5, -0.333, 0.5],
		[null, -0.333, 0.5, 0.333, 0.5]
	],

	"1": [
		[null, -0.167, -0.25, 0.0, -0.5], [null, 0.0, -0.5, 0.0, 0.5],
		[null, -0.167, 0.5, 0.167, 0.5]
	],
	"2": [
		[null, -0.333, -0.25, -0.167, -0.5],
		[null, -0.167, -0.5, 0.167, -0.5],
		[null, 0.167, -0.5, 0.333, -0.25],
		[null, 0.333, -0.25, -0.333, 0.5],
		[null, -0.333, 0.5, 0.333, 0.5]
	],
	"3": [
		[null, -0.333, -0.333, -0.167, -0.5],
		[null, -0.167, -0.5, 0.167, -0.5],
		[null, 0.167, -0.5, 0.333, -0.333],
		[null, 0.333, -0.333, 0.333, -0.167],
		[null, 0.333, -0.167, 0.167, 0.0], [null, 0.167, 0.0, 0.0, 0.0],
		[null, 0.167, 0.0, 0.333, 0.167],
		[null, 0.333, 0.167, 0.333, 0.333],
		[null, 0.333, 0.333, 0.167, 0.5],
		[null, 0.167, 0.5, -0.167, 0.5],
		[null, -0.167, 0.5, -0.333, 0.333]
	],
	"4": [
		[null, 0.167, 0.5, 0.167, -0.5],
		[null, 0.167, -0.5, -0.333, 0.167],
		[null, -0.333, 0.167, 0.333, 0.167]
	],
	"5": [
		[null, 0.333, -0.5, -0.333, -0.5],
		[null, -0.333, -0.5, -0.333, 0.0],
		[null, -0.333, 0.0, -0.167, -0.167],
		[null, -0.167, -0.167, 0.167, -0.167],
		[null, 0.167, -0.167, 0.333, 0.0],
		[null, 0.333, 0.0, 0.333, 0.333],
		[null, 0.333, 0.333, 0.167, 0.5],
		[null, 0.167, 0.5, -0.167, 0.5],
		[null, -0.167, 0.5, -0.333, 0.333]
	],
	"6": [
		[null, 0.333, -0.33, 0.167, -0.5],
		[null, 0.167, -0.5, -0.167, -0.5],
		[null, -0.167, -0.5, -0.333, -0.333],
		[null, -0.333, -0.333, -0.333, 0.333],
		[null, -0.333, 0.333, -0.167, 0.5],
		[null, -0.167, 0.5, 0.167, 0.5],
		[null, 0.167, 0.5, 0.333, 0.333],
		[null, 0.333, 0.333, 0.333, 0.167],
		[null, 0.333, 0.167, 0.167, 0.0],
		[null, 0.167, 0.0, -0.167, 0.0],
		[null, -0.167, 0.0, -0.333, 0.167]
	],
	"7": [
		[null, -0.333, -0.5, 0.333, -0.5],
		[null, 0.333, -0.5, -0.167, 0.333],
		[null, -0.167, 0.333, -0.167, 0.5]
	],
	"8": [
		[null, -0.333, -0.333, -0.167, -0.5],
		[null, -0.167, -0.5, 0.167, -0.5],
		[null, 0.167, -0.5, 0.333, -0.333],
		[null, 0.333, -0.333, 0.333, -0.167],
		[null, 0.333, -0.167, 0.167, 0.0],
		[null, 0.167, 0.0, 0.333, 0.167],
		[null, 0.333, 0.167, 0.333, 0.333],
		[null, 0.333, 0.3333, 0.167, 0.5],
		[null, 0.167, 0.5, -0.167, 0.5],
		[null, -0.167, 0.5, -0.333, 0.333],
		[null, -0.333, 0.333, -0.333, 0.167],
		[null, -0.333, 0.167, -0.167, 0.0],
		[null, -0.167, 0.0, 0.167, 0.0],
		[null, -0.167, 0.0, -0.333, -0.167],
		[null, -0.333, -0.167, -0.333, -0.333]
	],
	"9": [
		[null, 0.333, -0.167, 0.167, 0.0],
		[null, 0.167, 0.0, -0.167, 0.0],
		[null, -0.167, 0.0, -0.333, -0.167],
		[null, -0.333, -0.167, -0.333, -0.333],
		[null, -0.333, -0.333, -0.167, -0.5],
		[null, -0.167, -0.5, 0.167, -0.5],
		[null, 0.167, -0.5, 0.333, -0.333],
		[null, 0.333, -0.333, 0.333, 0.333],
		[null, 0.333, 0.333, 0.167, 0.5],
		[null, 0.167, 0.5, -0.167, 0.5],
		[null, -0.167, 0.5, -0.333, 0.333]
	],

	" ": []
};

const polygon = new Array(17);
function initPolygons()
{
	polygon[1] =
	 [[null, 0.0, -0.333, 0.0, 0.333], [null, -0.1, 0.0, 0.1, 0.0]];
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

function getMouseXY(evt)
{
	mouseX = evt.pageX - canvas.offsetLeft;
	mouseY = evt.pageY - canvas.offsetTop;
}

function getTouchXY(evt)
{
	evt.preventDefault();
	mouseX = evt.targetTouches[0].pageX - canvas.offsetLeft;
	mouseY = evt.targetTouches[0].pageY - canvas.offsetTop;
}

function getDistance(fromX, fromY, toX, toY)
{
	return Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
}

function getAngle(fromX, fromY, toX, toY)
{
	if (toY < fromY) {
		return Math.PI
		       + Math.acos(-(toX - fromX)
				   / getDistance(fromX, fromY, toX, toY));
	} else {
		return Math.acos((toX - fromX)
				 / getDistance(fromX, fromY, toX, toY));
	}
}

function getJit(jit) { return (Math.random() * 2 * jit) - jit; }

function drawVector(color, fromX, fromY, toX, toY)
{
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(fromX, fromY);
	ctx.lineTo(toX, toY);
	ctx.stroke();
}

function drawLine(line)
{
	drawVector(line[0], line[1], line[2], line[3], line[4]);
}

function drawJitteryLine(line, jit)
{
	drawVector(line[0], line[1] + getJit(jit), line[2] + getJit(jit),
		   line[3] + getJit(jit), line[4] + getJit(jit));
}

function transformUnit(unit, color, scale, theta, x, y)
{
	if (unit[0]) {
		return [
			unit[0],
			x
			 + scale
			    * (unit[1] * Math.cos(theta)
			       - unit[2] * Math.sin(theta)),
			y
			 + scale
			    * (unit[2] * Math.cos(theta)
			       + unit[1] * Math.sin(theta)),
			x
			 + scale
			    * (unit[3] * Math.cos(theta)
			       - unit[4] * Math.sin(theta)),
			y
			 + scale
			    * (unit[4] * Math.cos(theta)
			       + unit[3] * Math.sin(theta))
		];
	} else {
		return [
			color,
			x
			 + scale
			    * (unit[1] * Math.cos(theta)
			       - unit[2] * Math.sin(theta)),
			y
			 + scale
			    * (unit[2] * Math.cos(theta)
			       + unit[1] * Math.sin(theta)),
			x
			 + scale
			    * (unit[3] * Math.cos(theta)
			       - unit[4] * Math.sin(theta)),
			y
			 + scale
			    * (unit[4] * Math.cos(theta)
			       + unit[3] * Math.sin(theta))
		];
	}
}

function colorArray(str)
{
	let colorSplit = str.split(",");
	return [
		parseInt(colorSplit[0].slice(4, colorSplit[0].length)),
		parseInt(colorSplit[1]),
		parseInt(colorSplit[2].slice(0, colorSplit[2].length - 1))
	];
}

function colorString(array)
{
	return `rgb(${Math.floor(array[0])}, ${Math.floor(array[1])}, ${
	 Math.floor(array[2])})`;
}

class Particle
{
	constructor(startLine, endLine, spinCount, frameCount, onDestroy,
		    onDestroyArg)
	{
		this.frames       = new Array(frameCount);
		this.frameAt      = 0;
		this.onDestroy    = onDestroy;
		this.onDestroyArg = onDestroyArg;

		let rgb    = colorArray(startLine[0]);
		let x      = (startLine[1] + startLine[3]) / 2;
		let y      = (startLine[2] + startLine[4]) / 2;
		let radius = getDistance(x, y, startLine[3], startLine[4]);
		let theta  = getAngle(x, y, startLine[3], startLine[4]);

		let rgbEnd    = colorArray(endLine[0]);
		let xEnd      = (endLine[1] + endLine[3]) / 2;
		let yEnd      = (endLine[2] + endLine[4]) / 2;
		let radiusEnd = getDistance(xEnd, yEnd, endLine[3], endLine[4]);
		let thetaEnd  = getAngle(xEnd, yEnd, endLine[3], endLine[4])
			       + spinCount * Math.PI;

		let rgbStep = [
			(rgbEnd[0] - rgb[0]) / frameCount,
			(rgbEnd[1] - rgb[1]) / frameCount,
			(rgbEnd[2] - rgb[2]) / frameCount
		];
		let xStep      = (xEnd - x) / frameCount;
		let yStep      = (yEnd - y) / frameCount;
		let radiusStep = (radiusEnd - radius) / frameCount;
		let thetaStep  = (thetaEnd - theta) / frameCount;

		for (let i = 0; i < frameCount - 1; i++) {
			this.frames[i] = [
				colorString(rgb), x - radius * Math.cos(theta),
				y - radius * Math.sin(theta),
				x + radius * Math.cos(theta),
				y + radius * Math.sin(theta)
			];

			rgb[0] += rgbStep[0];
			rgb[1] += rgbStep[1];
			rgb[2] += rgbStep[2];
			x += xStep;
			y += yStep;
			radius += radiusStep;
			theta += thetaStep;
		}

		this.frames[frameCount - 1] = [
			colorString(rgbEnd), endLine[1], endLine[2], endLine[3],
			endLine[4]
		];
	}

	destroy()
	{
		var index = particleList.indexOf(this);
		if (this.onDestroy) { this.onDestroy(this.onDestroyArg); }
		if (index >= 0) { particleList.splice(index, 1); }
	}

	draw()
	{
		drawLine(this.frames[this.frameAt]);
		this.frameAt++;

		if (this.frameAt >= this.frames.length) { this.destroy(); }
	}
}

class Obj
{
	adjustBound(line)
	{
		if (line[1] < this.bbox[0]) { this.bbox[0] = line[1]; }
		if (line[3] < this.bbox[0]) { this.bbox[0] = line[3]; }
		if (line[2] < this.bbox[1]) { this.bbox[1] = line[2]; }
		if (line[4] < this.bbox[1]) { this.bbox[1] = line[4]; }
		if (line[1] > this.bbox[2]) { this.bbox[2] = line[1]; }
		if (line[3] > this.bbox[2]) { this.bbox[2] = line[3]; }
		if (line[2] > this.bbox[3]) { this.bbox[3] = line[2]; }
		if (line[4] > this.bbox[3]) { this.bbox[3] = line[4]; }
	}

	reconstruct()
	{
		this.bbox[0] = canvas.width;
		this.bbox[1] = canvas.height;
		this.bbox[2] = 0;
		this.bbox[3] = 0;

		for (let i = 0; i < this.unitList.length; i++) {
			this.lineList[i] = transformUnit(
			 this.unitList[i], this._color, this._scale,
			 this._theta, this._x, this._y);
			this.adjustBound(this.lineList[i]);
		}
	}

	recenter()
	{
		let midX = (this.bbox[0] + this.bbox[2]) / 2;
		let midY = (this.bbox[1] + this.bbox[3]) / 2;

		this._anchorX = midX;
		this._anchorY = midY;
		this._x       = midX;
		this._y       = midY;
		this._scale   = 1.0;
		this._theta   = 0.0;

		for (let i = 0; i < this.unitList.length; i++) {
			this.unitList[i][1] = this.lineList[i][1] - midX;
			this.unitList[i][2] = this.lineList[i][2] - midY;
			this.unitList[i][3] = this.lineList[i][3] - midX;
			this.unitList[i][4] = this.lineList[i][4] - midY;
		}

		this.redo = true;
	}

	constructor(unitList, color, scale, x, y, onDraw)
	{
		this.unitList = new Array(unitList.length);
		for (let i = 0; i < unitList.length; i++) {
			this.unitList[i] = [
				unitList[i][0], unitList[i][1], unitList[i][2],
				unitList[i][3], unitList[i][4]
			];
		}

		this.lineList = new Array(unitList.length);
		this.bbox     = [canvas.width, canvas.height, 0, 0];
		this.redo     = true;

		this._color   = color;
		this._scale   = scale;
		this._theta   = 0.0;
		this._anchorX = x;
		this._anchorY = y;
		this._x       = x;
		this._y       = y;
		this._jit     = 0;
		this._onDraw  = onDraw;

		this._hoverOn  = false;
		this._hoverOff = false;
		this._hover    = false;
		this._grabOn   = false;
		this._grabOff  = false;
		this._grabbed  = false;

		this.reconstruct();
	}

	addLine(line)
	{
		this.unitList.push([line[0], 0, 0, 0, 0]);
		if (line[0]) {
			this.lineList.push(
			 [line[0], line[1], line[2], line[3], line[4]]);
		} else {
			this.lineList.push(
			 [this._color, line[1], line[2], line[3], line[4]]);
		}
		this.adjustBound(line);
		this.recenter();
	}

	destroy()
	{
		var index = objList.indexOf(this);
		if (index >= 0) { objList.splice(index, 1); }
	}

	absorb(obj)
	{
		for (let i = 0; i < obj.lineList.length; i++) {
			this.addLine(obj.lineList[i]);
		}
		obj.destroy();
	}

	explode()
	{
		for (let i = 0; i < this.lineList.length; i++) {
			let theta = Math.random() * 2 * Math.PI;

			particleList.push(new Particle(
			 this.lineList[i],
			 [
				 "rgb(0, 0, 0)",
				 this._x + canvas.height * Math.cos(theta),
				 this._y + canvas.height * Math.sin(theta),
				 this._x + canvas.height * Math.cos(theta) + 1,
				 this._y + canvas.height * Math.sin(theta) + 1
			 ],
			 Math.floor(Math.random() * 10), 50, null, null));
		}

		this.destroy();
	}

	shuffleLines()
	{
		let newI;
		let swapVar;

		for (let i = 0; i < this.lineList.length; i++) {
			newI = Math.floor(Math.random() * this.lineList.length);
			swapVar             = this.lineList[i];
			this.lineList[i]    = this.lineList[newI];
			this.lineList[newI] = swapVar;
		}
	}

	getLine(index) { return this.lineList[index]; }

	get color() { return this._color; }
	set color(str)
	{
		this._color = str;
		this.redo   = true;
	}
	get scale() { return this._scale; }
	set scale(value)
	{
		this._scale = value;
		this.redo   = true;
	}
	get theta() { return this._theta; }
	set theta(value)
	{
		this._theta = value % (2 * Math.PI);
		this.redo   = true;
	}
	get anchorX() { return this._anchorX; }
	set anchorX(value) { this._anchorX = value; }
	get anchorY() { return this._anchorY; }
	set anchorY(value) { this._anchorY = value; }
	get x() { return this._x; }
	set x(value)
	{
		this._x   = value;
		this.redo = true;
	}
	get y() { return this._y; }
	set y(value)
	{
		this._y   = value;
		this.redo = true;
	}
	get jit() { return this._jit; }
	set jit(value) { this._jit = value; }

	get hoverOn() { return this._hoverOn; }
	get hoverOff() { return this._hoverOff; }
	get hover() { return this._hover; }
	get grabOn() { return this._grabOn; }
	get grabOff() { return this._grabOff; }
	get grabbed() { return this._grabbed; }

	draw()
	{
		if (this.redo) {
			this.reconstruct();
			this.shuffleLines();
			this.redo = false;
		}

		if (this._grabbed) {
			if (clickOff) {
				this._grabOff = true;
				this._grabbed = false;
				if (mouseX < this.bbox[0]
				    || mouseY < this.bbox[1]
				    || mouseX > this.bbox[2]
				    || mouseY > this.bbox[3]) {
					this._hoverOff = true;
					this._hover    = false;
				}
			}
		} else if (clickOn && mouseX > this.bbox[0]
			   && mouseY > this.bbox[1] && mouseX < this.bbox[2]
			   && mouseY < this.bbox[3]) {
			if (!this._hover) {
				this._hoverOn = true;
				this._hover   = true;
			}
			this._grabOn  = true;
			this._grabbed = true;
		} else if (this._hover) {
			if (mouseX < this.bbox[0] || mouseY < this.bbox[1]
			    || mouseX > this.bbox[2] || mouseY > this.bbox[3]) {
				this._hoverOff = true;
				this._hover    = false;
			}
		} else if (mouseX > this.bbox[0] && mouseY > this.bbox[1]
			   && mouseX < this.bbox[2] && mouseY < this.bbox[3]) {
			this._hoverOn = true;
			this._hover   = true;
		}

		if (this._onDraw) { this._onDraw(this); }

		this._hoverOn  = false;
		this._hoverOff = false;
		this._grabOn   = false;
		this._grabOff  = false;

		if (this._jit) {
			for (let i = 0; i < this.lineList.length; i++) {
				drawJitteryLine(this.lineList[i], this._jit);
			}
		} else {
			for (let i = 0; i < this.lineList.length; i++) {
				drawLine(this.lineList[i]);
			}
		}
	}
}

function nextCell(cell, dir)
{
	if (dir == 0) {
		if (cell[0] % 2) {
			return [cell[0] + 1, cell[1] + 1];
		} else {
			return [cell[0] + 1, cell[1]];
		}
	} else if (dir == 1) {
		return [cell[0], cell[1] + 1];
	} else if (dir == 2) {
		if (cell[0] % 2) {
			return [cell[0] - 1, cell[1] + 1];
		} else {
			return [cell[0] - 1, cell[1]];
		}
	} else if (dir == 3) {
		if (cell[0] % 2) {
			return [cell[0] - 1, cell[1]];
		} else {
			return [cell[0] - 1, cell[1] - 1];
		}
	} else if (dir == 4) {
		return [cell[0], cell[1] - 1];
	} else {
		if (cell[0] % 2) {
			return [cell[0] + 1, cell[1]];
		} else {
			return [cell[0] + 1, cell[1] - 1];
		}
	}
}

function registerObj(obj) { objList.push(obj); }

function pieceCoord(piece)
{
	let atIndex = grid.indexOf(piece);
	return [Math.floor(atIndex % gridCols), Math.floor(atIndex / gridCols)];
}

function pieceValue(piece)
{
	var cell = pieceCoord(piece);
	return gridValue[cell[0] + cell[1] * gridCols];
}

function cascadeFunc(THIS)
{
	var fromCoord = pieceCoord(THIS);
	var fromObj   = THIS;
	var fromValue = gridValue[fromCoord[0] + fromCoord[1] * gridCols];

	var dir = gridDir[fromCoord[0] + fromCoord[1] * gridCols];
	gridDir[fromCoord[0] + fromCoord[1] * gridCols] = -1;
	var toCoord = nextCell(fromCoord, dir);
	if (toCoord[0] < 0 || toCoord[1] < 0 || toCoord[0] > gridCols
	    || toCoord[1] > gridRows
	    || !onGrid[toCoord[0] + toCoord[1] * gridCols]) {
		gridDir[fromCoord[0] + fromCoord[1] * gridCols] = (dir + 3) % 6;
		cascadeFunc(THIS);
		return;
	}

	var toObj   = grid[toCoord[0] + toCoord[1] * gridCols];
	var toValue = gridValue[toCoord[0] + toCoord[1] * gridCols];

	var remainValue;
	if (fromValue < 0) {
		remainValue = -8;
	} else {
		remainValue = 8;
	}
	var remainObj = pieceObj(remainValue, fromCoord[0], fromCoord[1]);

	var mergeValue = fromValue + toValue - remainValue;
	var mergeObj;
	if (mergeValue == 0) {
		mergeObj = null;
	} else {
		mergeObj = pieceObj(mergeValue, toCoord[0], toCoord[1]);
	}

	grid[fromCoord[0] + fromCoord[1] * gridCols]      = remainObj;
	grid[toCoord[0] + toCoord[1] * gridCols]          = mergeObj;
	gridValue[fromCoord[0] + fromCoord[1] * gridCols] = remainValue;
	gridValue[toCoord[0] + toCoord[1] * gridCols]     = mergeValue;
	if (mergeValue > 8 || mergeValue < -8) {
		gridDir[toCoord[0] + toCoord[1] * gridCols] = dir;
	}

	registerObj(remainObj);
	fromObj.destroy();
	if (mergeObj) { registerObj(mergeObj); }
	if (toObj) { toObj.destroy(); }
}

function mergePieces(fromCoord, toCoord, dir)
{
	var fromObj   = grid[fromCoord[0] + fromCoord[1] * gridCols];
	var fromValue = gridValue[fromCoord[0] + fromCoord[1] * gridCols];

	var toObj   = grid[toCoord[0] + toCoord[1] * gridCols];
	var toValue = gridValue[toCoord[0] + toCoord[1] * gridCols];

	if ((fromValue == 8 && toValue > 0)
	    || (fromValue == -8 && toValue < 0)) {
		return;
	}

	var mergeValue = fromValue + toValue;
	var mergeObj;
	if (mergeValue == 0) {
		mergeObj = null;
	} else {
		mergeObj = pieceObj(mergeValue, toCoord[0], toCoord[1]);
	}

	grid[fromCoord[0] + fromCoord[1] * gridCols]      = null;
	grid[toCoord[0] + toCoord[1] * gridCols]          = mergeObj;
	gridValue[fromCoord[0] + fromCoord[1] * gridCols] = 0;
	gridValue[toCoord[0] + toCoord[1] * gridCols]     = mergeValue;
	gridDir[fromCoord[0] + fromCoord[1] * gridCols]   = -1;
	if (mergeValue > 8 || mergeValue < -8) {
		gridDir[toCoord[0] + toCoord[1] * gridCols] = dir;
	}

	if (mergeObj) { registerObj(mergeObj); };
	fromObj.destroy();
	toObj.destroy();
}

function tryMove()
{
	var toCell = nextCell(atCell, moveDir);
	if (toCell[0] < 0 || toCell[1] < 0 || toCell[0] >= gridCols
	    || toCell[1] >= gridRows
	    || !grid[toCell[0] + toCell[1] * gridRows]) {
		return;
	}

	mergePieces(atCell, toCell, moveDir);
}

function drawAll()
{
	if (makeMove) {
		tryMove();

		makeMove  = false;
		atObj     = null;
		atCell[0] = -1;
		atCell[1] = -1;
	}

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < objList.length; i++) {
		objList[i].draw();
	}
	for (let i = 0; i < particleList.length; i++) {
		particleList[i].draw();
	}

	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font      = "16px sans-serif";

	clickOn  = false;
	clickOff = false;

	drawVector("rgb(255, 255, 255)", gridWin[0], gridWin[1], gridWin[2],
		   gridWin[1]);
	drawVector("rgb(255, 255, 255)", gridWin[0], gridWin[1], gridWin[0],
		   gridWin[3]);
	drawVector("rgb(255, 255, 255)", gridWin[2], gridWin[1], gridWin[2],
		   gridWin[3]);
	drawVector("rgb(255, 255, 255)", gridWin[0], gridWin[3], gridWin[2],
		   gridWin[3]);
}

function gridX(col, row) { return gridLeftX + gridScale * (0.5 + 0.75 * col); }

function gridY(col, row)
{
	if (col % 2) {
		return gridTopY + gridScale * 0.865 * (row + 1);
	} else {
		return gridTopY + gridScale * (0.4325 + 0.865 * row);
	}
}

function gridConstrain()
{
	let width  = gridWin[2] - gridWin[0];
	let height = gridWin[3] - gridWin[1];

	let widthScale = width / (1 + 0.75 * (gridCols - 1))
	let heightScale;
	if (gridCols > 1) {
		heightScale = height / (0.4325 + gridRows * 0.865);
	} else {
		heightScale = height / (gridRows * 0.865);
	}

	if (widthScale < heightScale) {
		gridScale = widthScale;
	} else {
		gridScale = heightScale;
	}

	let gridWidth = gridScale * (1 + 0.75 * (gridCols - 1));
	let gridHeight;
	if (gridCols > 1) {
		gridHeight = gridScale * (0.4325 + 0.865 * gridRows);
	} else {
		gridHeight = gridScale * 0.865 * gridRows;
	}

	gridLeftX = Math.floor(gridWin[0] + (width - gridWidth) / 2);
	gridTopY  = Math.floor(gridWin[1] + (height - gridHeight) / 2);
}

function gridCell(col, row)
{
	let cell   = new Obj(polygon[6], "rgb(0, 0, 255)", gridScale,
                           gridX(col, row), gridY(col, row), null);
	cell.theta = Math.PI / 6;
	cell.jit   = 1;

	return cell;
}

function onePieceFunc(THIS)
{
	if (THIS.grabOn) { atCell = pieceCoord(THIS); }
	if (THIS.grabOff) {
		let toAngle
		 = getAngle(THIS.anchorX, THIS.anchorY, mouseX, mouseY);

		if (toAngle < Math.PI / 3) {
			moveDir = 0;
		} else if (toAngle < 2 * Math.PI / 3) {
			moveDir = 1;
		} else if (toAngle < Math.PI) {
			moveDir = 2;
		} else if (toAngle < 4 * Math.PI / 3) {
			moveDir = 3;
		} else if (toAngle < 5 * Math.PI / 3) {
			moveDir = 4;
		} else {
			moveDir = 5;
		}
		makeMove = true;
	}

	if (THIS.grabbed) {
		if (getDistance(THIS.anchorX, THIS.anchorY, mouseX, mouseY)
		    > gridScale * 0.4325) {
			let toAngle
			 = getAngle(THIS.anchorX, THIS.anchorY, mouseX, mouseY);

			THIS.x = THIS.anchorX
				 + gridScale * 0.4325 * Math.cos(toAngle);
			THIS.y = THIS.anchorY
				 + gridScale * 0.4325 * Math.sin(toAngle);
		} else {
			THIS.x = mouseX;
			THIS.y = mouseY;
		}
	} else if (THIS.x != THIS.anchorX || THIS.y != THIS.anchorY) {
		if (getDistance(THIS.anchorX, THIS.anchorY, THIS.x, THIS.y)
		    < 2) {
			THIS.x = THIS.anchorX;
			THIS.y = THIS.anchorY;
		} else {
			THIS.x
			 = THIS.anchorX
			   + 0.75
			      * getDistance(THIS.anchorX, THIS.anchorY, THIS.x,
					    THIS.y)
			      * Math.cos(getAngle(THIS.anchorX, THIS.anchorY,
						  THIS.x, THIS.y));
			THIS.y
			 = THIS.anchorY
			   + 0.75
			      * getDistance(THIS.anchorX, THIS.anchorY, THIS.x,
					    THIS.y)
			      * Math.sin(getAngle(THIS.anchorX, THIS.anchorY,
						  THIS.x, THIS.y));
		}
	} else {
		THIS.theta = Math.random() * 2 * Math.PI;
	}
}

function pieceFunc(THIS)
{
	if (THIS.grabOn) { atCell = pieceCoord(THIS); }
	if (THIS.grabOff) {
		let toAngle
		 = getAngle(THIS.anchorX, THIS.anchorY, mouseX, mouseY);

		if (toAngle < Math.PI / 3) {
			moveDir = 0;
		} else if (toAngle < 2 * Math.PI / 3) {
			moveDir = 1;
		} else if (toAngle < Math.PI) {
			moveDir = 2;
		} else if (toAngle < 4 * Math.PI / 3) {
			moveDir = 3;
		} else if (toAngle < 5 * Math.PI / 3) {
			moveDir = 4;
		} else {
			moveDir = 5;
		}
		makeMove = true;
	}

	if (THIS.grabbed) {
		if (getDistance(THIS.anchorX, THIS.anchorY, mouseX, mouseY)
		    > gridScale * 0.4325) {
			let toAngle
			 = getAngle(THIS.anchorX, THIS.anchorY, mouseX, mouseY);

			THIS.x = THIS.anchorX
				 + gridScale * 0.4325 * Math.cos(toAngle);
			THIS.y = THIS.anchorY
				 + gridScale * 0.4325 * Math.sin(toAngle);
		} else {
			THIS.x = mouseX;
			THIS.y = mouseY;
		}
	} else if (THIS.x != THIS.anchorX || THIS.y != THIS.anchorY) {
		if (getDistance(THIS.anchorX, THIS.anchorY, THIS.x, THIS.y)
		    < 2) {
			THIS.x = THIS.anchorX;
			THIS.y = THIS.anchorY;
		} else {
			THIS.x
			 = THIS.anchorX
			   + 0.75
			      * getDistance(THIS.anchorX, THIS.anchorY, THIS.x,
					    THIS.y)
			      * Math.cos(getAngle(THIS.anchorX, THIS.anchorY,
						  THIS.x, THIS.y));
			THIS.y
			 = THIS.anchorY
			   + 0.75
			      * getDistance(THIS.anchorX, THIS.anchorY, THIS.x,
					    THIS.y)
			      * Math.sin(getAngle(THIS.anchorX, THIS.anchorY,
						  THIS.x, THIS.y));
		}
	} else {
		THIS.theta += 0.05 - (Math.random() * 0.1);
	}
}

function pieceObj(value, col, row)
{
	var obj;

	if (value > 8) {
		obj
		 = new Obj(polygon[value], "rgb(0, 255, 0)", gridScale * 0.75,
			   gridX(col, row), gridY(col, row), cascadeFunc);
	} else if (value < -8) {
		obj = new Obj(polygon[-value], "rgb(255, 255, 0)",
			      gridScale * 0.75, gridX(col, row),
			      gridY(col, row), cascadeFunc);
	} else if (value == -1) {
		obj = new Obj(polygon[1], "rgb(255, 255, 0)", gridScale * 0.75,
			      gridX(col, row), gridY(col, row), onePieceFunc);
	} else if (value < 0) {
		obj = new Obj(polygon[-value], "rgb(255, 255, 0)",
			      gridScale * 0.75, gridX(col, row),
			      gridY(col, row), pieceFunc);
	} else if (value == 1) {
		obj = new Obj(polygon[1], "rgb(0, 255, 0)", gridScale * 0.75,
			      gridX(col, row), gridY(col, row), onePieceFunc);
	} else {
		obj
		 = new Obj(polygon[value], "rgb(0, 255, 0)", gridScale * 0.75,
			   gridX(col, row), gridY(col, row), pieceFunc);
	}

	obj.jit = 1;
	return obj;
}

function makeGrid(win, stringArray)
{
	gridWin  = win;
	gridRows = stringArray.length;
	gridCols = stringArray[0].length;
	gridConstrain();

	grid      = new Array(gridCols * gridRows);
	gridValue = new Array(gridCols * gridRows);
	gridDir   = new Array(gridCols * gridRows);
	onGrid    = new Array(gridCols * gridRows);

	for (let j = 0; j < gridRows; j++) {
		for (let i = 0; i < gridCols; i++) {
			grid[i + j * gridCols]      = null;
			gridValue[i + j * gridCols] = 0;

			if (stringArray[j].charAt(i) == "x") {
				onGrid[i + j * gridCols] = false;
			} else {
				objList.push(gridCell(i, j));
				onGrid[i + j * gridCols] = true;
			}

			if (stringArray[j].charAt(i) == "1") {
				grid[i + j * gridCols] = pieceObj(1, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = 1;
			}
			if (stringArray[j].charAt(i) == "2") {
				grid[i + j * gridCols] = pieceObj(2, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = 2;
			}
			if (stringArray[j].charAt(i) == "3") {
				grid[i + j * gridCols] = pieceObj(3, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = 3;
			}
			if (stringArray[j].charAt(i) == "4") {
				grid[i + j * gridCols] = pieceObj(4, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = 4;
			}
			if (stringArray[j].charAt(i) == "5") {
				grid[i + j * gridCols] = pieceObj(5, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = 5;
			}
			if (stringArray[j].charAt(i) == "6") {
				grid[i + j * gridCols] = pieceObj(6, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = 6;
			}
			if (stringArray[j].charAt(i) == "7") {
				grid[i + j * gridCols] = pieceObj(7, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = 7;
			}
			if (stringArray[j].charAt(i) == "8") {
				grid[i + j * gridCols] = pieceObj(8, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = 8;
			}
			if (stringArray[j].charAt(i) == "A") {
				grid[i + j * gridCols] = pieceObj(-1, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = -1;
			}
			if (stringArray[j].charAt(i) == "B") {
				grid[i + j * gridCols] = pieceObj(-2, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = -2;
			}
			if (stringArray[j].charAt(i) == "C") {
				grid[i + j * gridCols] = pieceObj(-3, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = -3;
			}
			if (stringArray[j].charAt(i) == "D") {
				grid[i + j * gridCols] = pieceObj(-4, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = -4;
			}
			if (stringArray[j].charAt(i) == "E") {
				grid[i + j * gridCols] = pieceObj(-5, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = -5;
			}
			if (stringArray[j].charAt(i) == "F") {
				grid[i + j * gridCols] = pieceObj(-6, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = -6;
			}
			if (stringArray[j].charAt(i) == "G") {
				grid[i + j * gridCols] = pieceObj(-7, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = -7;
			}
			if (stringArray[j].charAt(i) == "H") {
				grid[i + j * gridCols] = pieceObj(-8, i, j);
				objList.push(grid[i + j * gridCols]);
				gridValue[i + j * gridCols] = -8;
			}
		}
	}
}

function makeText(str, color, pitch, leftX, topY)
{
	var x    = leftX + (pitch / 2);
	var y    = topY + (pitch / 2);
	var text = new Obj(type[str.charAt(0)], color, pitch, x, y, null);

	for (let i = 1; i < str.length; i++) {
		x += pitch;
		text.absorb(
		 new Obj(type[str.charAt(i)], color, pitch, x, y, null));
	}

	text.jit = 1;

	return text;
}

window.addEventListener("mousemove", getMouseXY);
window.addEventListener("mousedown", (evt) => {
	getMouseXY(evt);
	clickOn  = true;
	clicking = true;
});
window.addEventListener("mouseup", (evt) => {
	getMouseXY(evt);
	clickOff = true;
	clicking = false;
});
window.addEventListener("touchmove", getTouchXY);
window.addEventListener("touchstart", (evt) => {
	getTouchXY(evt);
	clickOn  = true;
	clicking = true;
});
window.addEventListener("touchend", (evt) => {
	mouseX   = -canvas.width;
	mouseY   = -canvas.height;
	clickOff = true;
	clicking = false;
});
setInterval(drawAll, 16.7);

makeGrid([0, 0, canvas.width, canvas.height], ["x1x", "B34", "EF7"]);
registerObj(makeText("VALENCE", "rgb(0, 255, 0)", 50, 7, 10));
