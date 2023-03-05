var canvas       = document.getElementById("Canvas");
var ctx          = canvas.getContext("2d");
var mouseX       = 0;
var mouseY       = 0;
var click        = false;
var unclick      = false;
var objList      = [];
var particleList = [];

var gridWin   = [100, 50, 350, 400];
var gridWidth = 0;
var gridValue = null;
var gridPiece = null;
var gridLeftX = 0;
var gridTopY  = 0;
var gridScale = 0;
var startRow  = -1;
var startCol  = -1;
var endRow    = -1;
var endCol    = -1;

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

function untransformLine(line, scale, theta, deltaX, deltaY)
{
	return [
		line[0],
		((line[1] - deltaX) * Math.cos(theta)
		 - (line[2] - deltaY) * Math.sin(theta))
		 / scale,
		((line[2] - deltaX) * Math.cos(theta)
		 + (line[1] - deltaY) * Math.sin(theta))
		 / scale,
		((line[3] - deltaX) * Math.cos(theta)
		 - (line[4] - deltaY) * Math.sin(theta))
		 / scale,
		((line[4] - deltaX) * Math.cos(theta)
		 + (line[3] - deltaY) * Math.sin(theta))
		 / scale
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
		let radius = getDistance(x, y, startLine[3], startLine[4]);
		let theta  = getAngle(startLine[1], startLine[2], startLine[3],
                                     startLine[4]);

		let endRgb    = colorVector(endLine[0]);
		let endX      = (endLine[1] + endLine[3]) / 2;
		let endY      = (endLine[2] + endLine[4]) / 2;
		let endRadius = getDistance(endX, endY, endLine[3], endLine[4]);
		let endTheta
		 = getAngle(endLine[1], endLine[2], endLine[3], endLine[4]);

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

		this.recalc = true;
	}

	constructor(unitList, color, scale, theta, centerX, centerY, jit,
		    onDraw)
	{
		this._scale   = scale;
		this._theta   = theta;
		this._anchorX = centerX;
		this._anchorY = centerY;
		this._x       = centerX;
		this._y       = centerY;
		this._jit     = jit;
		this._onDraw  = onDraw;

		this.bbox       = [canvas.width, canvas.height, 0, 0];
		this.recalc     = false;
		this._hover     = false;
		this._startGrab = false;
		this._endGrab   = false;
		this._grabbed   = false;
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

	get anchorX() { return this._anchorX; }
	set anchorX(value) { this._anchorX = value; }

	get anchorY() { return this._anchorY; }
	set anchorY(value) { this._anchorY = value; }

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

	get hover() { return this._hover; }
	get startGrab() { return this._startGrab; }
	get endGrab() { return this._endGrab; }
	get grabbed() { return this._grabbed; }
	get released() { return this._mouseUp; }

	destroy()
	{
		var index = objList.indexOf(this);
		if (index >= 0) { objList.splice(index, 1); }
	}

	addLine(line)
	{
		this.unitList.push([line[0], 0, 0, 0, 0]);
		this.lineList.push(
		 [line[0], line[1], line[2], line[3], line[4]]);
		this.adjustBoundBox(line);
		this.recenter();
	}

	absorb(obj)
	{
		for (let i = 0; i < obj.lineList.length; i++) {
			this.addLine(obj.lineList[i]);
		}
	}

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
			this._hover = true;

			if (click) {
				this._startGrab = true;
				this._grabbed   = true;
			}
		} else {
			this._hover = false;
		}

		if (this._grabbed && unclick) {
			this._grabbed = false;
			this._endGrab = true;
		}

		if (this._onDraw) { this._onDraw(this); }

		for (let i = 0; i < this.lineList.length; i++) {
			drawJitteryLine(this.lineList[i], this._jit);
		}

		this._startGrab = false;
		this._endGrab   = false;
	}
}

function gridX(col, row)
{
	return gridLeftX + (gridScale * 0.5) + (col * gridScale * 0.75);
}

function gridY(col, row)
{
	if (col % 2) {
		return gridTopY + (gridScale * 0.870)
		       + (row * gridScale * 0.865);
	} else {
		return gridTopY + (gridScale * 0.435)
		       + (row * gridScale * 0.865);
	}
}

function gridCol(x, y)
{
	return (x - gridLeftX - (gridScale * 0.5)) / (gridScale * 0.75);
}

function gridRow(x, y)
{
	let col = gridCol(x, y);

	if (gridCol(x, y) % 2) {
		return (y - gridTopY - (gridScale * 0.870))
		       / (gridScale * 0.865);
	} else {
		return (y - gridTopY - (gridScale * 0.435))
		       / (gridScale * 0.865);
	}
}

function gridCell(col, row)
{
	let x = gridX(col, row);
	let y = gridY(col, row);

	return new Obj(polygon[6], "rgb(0, 0, 255)", gridScale, Math.PI / 6, x,
		       y, 0, null);
}

function pieceFunc(THIS)
{
	if (THIS.hover) {
		THIS.jit = 4;
	} else {
		THIS.jit = 1;
	}

	if (THIS.startGrab) {
		startCol = gridCol(THIS.anchorX, THIS.anchorY);
		startRow = gridRow(THIS.anchorX, THIS.anchorY);
	}
	if (THIS.endGrab) {
		startCol = -1;
		startRow = -1;
		endCol   = -1;
		endRow   = -1;
	}

	if (THIS.grabbed) {
		let grabDistance
		 = getDistance(THIS.anchorX, THIS.anchorY, mouseX, mouseY);
		let grabTheta
		 = getAngle(THIS.anchorX, THIS.anchorY, mouseX, mouseY);

		if (grabDistance > THIS.scale * 0.75) {
			THIS.x = THIS.anchorX
				 + THIS.scale * 0.75 * Math.cos(grabTheta);
			THIS.y = THIS.anchorY
				 + THIS.scale * 0.75 * Math.sin(grabTheta);

			if (grabTheta < Math.PI / 3) {
				endCol = startCol + 1;
				if (endCol % 2) {
					endRow = startRow;
				} else {
					endRow = startRow + 1;
				}
			} else if (grabTheta < 2 * Math.PI / 3) {
				endCol = startCol;
				endRow = startRow + 1;
			} else if (grabTheta < Math.PI) {
				endCol = startCol - 1;
				if (endCol % 2) {
					endRow = startRow;
				} else {
					endRow = startRow + 1;
				}
			} else if (grabTheta < 4 * Math.PI / 3) {
				endCol = startCol - 1;
				if (endCol % 2) {
					endRow = startRow - 1;
				} else {
					endRow = startRow;
				}
			} else if (grabTheta < 5 * Math.PI / 3) {
				endCol = startCol;
				endRow = startRow - 1;
			} else {
				endCol = startCol + 1;
				if (endCol % 2) {
					endRow = startRow - 1;
				} else {
					endRow = startRow;
				}
			}
		} else {
			THIS.x = mouseX;
			THIS.y = mouseY;
			endCol = startCol;
			endRow = startRow;
		}
	}

	if (THIS.x != THIS.anchorX || THIS.y != THIS.anchorY) {
		THIS.x
		 = THIS.anchorX
		   + 0.75
		      * getDistance(THIS.anchorX, THIS.anchorY, THIS.x, THIS.y)
		      * Math.cos(
		       getAngle(THIS.anchorX, THIS.anchorY, THIS.x, THIS.y));
		THIS.y
		 = THIS.anchorY
		   + 0.75
		      * getDistance(THIS.anchorX, THIS.anchorY, THIS.x, THIS.y)
		      * Math.sin(
		       getAngle(THIS.anchorX, THIS.anchorY, THIS.x, THIS.y));
	}
}

function pieceObj(value, col, row)
{
	return new Obj(polygon[value], "rgb(0, 255, 0)", gridScale * 0.75, 0.0,
		       gridX(col, row), gridY(col, row), 1, pieceFunc);
}

function constrainGrid(colCount, rowCount)
{
	let width  = gridWin[2] - gridWin[0];
	let height = gridWin[3] - gridWin[1];

	let widthScale = width / (1 + 0.75 * (colCount - 1));
	let heightScale;

	if (colCount > 1) {
		heightScale = height / (0.4325 + 0.865 * rowCount);
	} else {
		heightScale = height / (0.865 * rowCount);
	}

	if (widthScale < heightScale) {
		gridScale = widthScale;
	} else {
		gridScale = heightScale;
	}

	let gridWidth = gridScale * (1 + 0.75 * (colCount - 1));
	let gridHeight;

	if (colCount > 1) {
		gridHeight = gridScale * (0.4325 + 0.865 * rowCount);
	} else {
		gridHeight = gridScale * 0.865 * rowCount;
	}

	gridLeftX = gridWin[0] + (width - gridWidth) / 2;
	gridTopY  = gridWin[1] + (height - gridHeight) / 2;
}

function makeGrid(win, gridArray)
{
	gridWidth = gridArray[0].length;

	gridWin = win;
	constrainGrid(gridArray.length, gridWidth);

	gridValue = new Array(gridArray.length * gridWidth);
	gridPiece = new Array(gridArray.length * gridWidth);

	var obj;

	for (let row = 0; row < gridArray.length; row++) {
		for (let col = 0; col < gridArray[row].length; col++) {
			if (gridArray[row].charAt(col) == "x") {
				gridValue[col + row * gridWidth] = -1;
				gridPiece[col + row * gridWidth] = null;
			} else {
				objList.push(gridCell(col, row));
				gridValue[col + row * gridWidth] = 0;
				gridPiece[col + row * gridWidth] = null;
			}
			if (gridArray[row].charAt(col) == "1") {
				obj = pieceObj(1, col, row);
				objList.push(obj);
				gridValue[col + row * gridWidth] = 1;
				gridPiece[col + row * gridWidth] = obj;
			} else if (gridArray[row].charAt(col) == "2") {
				obj = pieceObj(2, col, row);
				objList.push(obj);
				gridValue[col + row * gridWidth] = 2;
				gridPiece[col + row * gridWidth] = obj;
			} else if (gridArray[row].charAt(col) == "3") {
				obj = pieceObj(3, col, row);
				objList.push(obj);
				gridValue[col + row * gridWidth] = 3;
				gridPiece[col + row * gridWidth] = obj;
			} else if (gridArray[row].charAt(col) == "4") {
				obj = pieceObj(4, col, row);
				objList.push(obj);
				gridValue[col + row * gridWidth] = 4;
				gridPiece[col + row * gridWidth] = obj;
			} else if (gridArray[row].charAt(col) == "5") {
				obj = pieceObj(5, col, row);
				objList.push(obj);
				gridValue[col + row * gridWidth] = 5;
				gridPiece[col + row * gridWidth] = obj;
			} else if (gridArray[row].charAt(col) == "6") {
				obj = pieceObj(6, col, row);
				objList.push(obj);
				gridValue[col + row * gridWidth] = 6;
				gridPiece[col + row * gridWidth] = obj;
			} else if (gridArray[row].charAt(col) == "7") {
				obj = pieceObj(7, col, row);
				objList.push(obj);
				gridValue[col + row * gridWidth] = 7;
				gridPiece[col + row * gridWidth] = obj;
			} else if (gridArray[row].charAt(col) == "8") {
				obj = pieceObj(8, col, row);
				objList.push(obj);
				gridValue[col + row * gridWidth] = 8;
				gridPiece[col + row * gridWidth] = obj;
			}
		}
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

	ctx.strokeStyle = "rgb(255, 255, 255)";
	ctx.beginPath();
	ctx.moveTo(gridWin[0], gridWin[1]);
	ctx.lineTo(gridWin[0], gridWin[3]);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(gridWin[0], gridWin[1]);
	ctx.lineTo(gridWin[2], gridWin[1]);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(gridWin[0], gridWin[3]);
	ctx.lineTo(gridWin[2], gridWin[3]);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(gridWin[2], gridWin[1]);
	ctx.lineTo(gridWin[2], gridWin[3]);
	ctx.stroke();

	click   = false;
	unclick = false;

	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font      = "48px sans-serif";
	if (startCol > -1) {
		ctx.fillText(
		 "Piece: " + gridValue[startCol + startRow * gridWidth], 0,
		 400);
	}
}

makeGrid([0, 0, 360, 600], ["xx.xx", "x.62x", "..5..", "x.3.x", "xx.xx"]);

window.addEventListener("mousemove", getMouseXY);
window.addEventListener("mousedown", (evt) => {
	getMouseXY(evt);
	click = true;
});
window.addEventListener("mouseup", (evt) => {
	getMouseXY(evt);
	unclick = true;
});
window.addEventListener("touchmove", getTouchXY);
window.addEventListener("touchstart", (evt) => {
	getTouchXY(evt);
	click = true;
});
window.addEventListener("touchend", (evt) => {
	unclick = true;
	mouseX  = -1;
	mouseY  = -1;
});
setInterval(drawAll, 16.7)
