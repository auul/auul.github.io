const objList  = [];
const partList = [];
var debugText  = [""];

var gridRows     = 0;
var gridCols     = 0;
const gridOffset = [0, 0];
var grid         = null;

var pieceAt    = null;
var pieceTo    = null;
var pieceDir   = -1;
var hasWon     = false;
var wonTrigger = false;

class GridCell
{
	constructor(col, row, pieceValue)
	{
		const gridCoord = gridXY(col, row);
		this._cell = new Obj(polygon[6], true, "rgb(0, 0, 255)", 95,
				     gridCoord[0], gridCoord[1], null);
		this._cell.theta = Math.PI / 6;
		this._cell.jit   = 1;
		addObj(this._cell);

		if (pieceValue) {
			this._piece = addObj(pieceObj(pieceValue, col, row));
		} else {
			this._piece = null;
		}
		this._value      = pieceValue;
		this._cascadeDir = -1;
		this._target     = 0;
	}

	get cell() { return this._cell; }
	get piece() { return this._piece; }
	set piece(obj) { this._piece = obj; }
	get value() { return this._value; }
	set value(v) { this._value = v; }
	get cascadeDir() { return this._cascadeDir; }
	set cascadeDir(v) { this._cascadeDir = v; }
	get target() { return this._target; }
	set target(v)
	{
		this._target     = v;
		this._cell.color = "rgb(0, 128, 128)";
	}
}

function checkWin()
{
	for (let i = 0; i < gridCols * gridRows; i++) {
		if (grid[i] && grid[i].value != grid[i].target) {
			wonTrigger = false;
			hasWon     = false;

			return false;
		}
	}

	wonTrigger = true;
	hasWon     = true;

	return true;
}

function gridXY(col, row)
{
	if (col % 2) {
		return [
			gridOffset[0] + 50 + 75 * col,
			gridOffset[1] + 86.25 * (row + 1)
		];
	} else {
		return [
			gridOffset[0] + 50 + 75 * col,
			gridOffset[1] + 43.25 + 86.5 * row
		];
	}
}

function gridAt(x, y)
{
	const at = [(x - gridOffset[0] - 50) / 75, 0];

	if (at[0] % 2) {
		at[1] = ((y - gridOffset[1]) / 86.25) - 1;
	} else {
		at[1] = (y - gridOffset[1] - 43.25) / 86.5
	}

	return at;
}

function gridExists(col, row)
{
	if (col >= 0 && row >= 0 && col < gridCols && row < gridRows
	    && grid[col + row * gridCols]) {
		return true;
	} else {
		return false;
	}
}

function makeMove()
{
	const indexTo = pieceTo[0] + pieceTo[1] * gridCols;

	if (!gridExists(pieceTo[0], pieceTo[1]) || grid[indexTo].value == 0) {
		return;
	}

	const indexAt = pieceAt[0] + pieceAt[1] * gridCols;
	const atValue = grid[indexAt].value;
	const toValue = grid[indexAt].value + grid[indexTo].value;

	if (atValue == 8) {
		if (grid[indexTo].value > 0) { return; }
	}
	if (atValue == -8) {
		if (grid[indexTo].value < 0) { return; }
	}

	grid[indexAt].piece.destroy();
	grid[indexAt].piece = null;
	grid[indexAt].value = 0;

	grid[indexTo].piece.destroy();
	if (toValue == 0) {
		grid[indexTo].piece = null;
	} else {
		grid[indexTo].piece
		 = addObj(pieceObj(toValue, pieceTo[0], pieceTo[1]));
	}
	grid[indexTo].value = toValue;
	if (toValue > 8) { grid[indexTo].cascadeDir = pieceDir; }

	pieceAt = null;
	pieceTo = null;

	if (checkWin()) { debugText = ["You win"]; }
}

function getGridTo(fromCol, fromRow, dir)
{
	switch (dir) {
	case 0:
		if (fromCol % 2) {
			return [fromCol + 1, fromRow + 1];
		} else {
			return [fromCol + 1, fromRow];
		}
		break;
	case 1: return [fromCol, fromRow + 1]; break;
	case 2:
		if (fromCol % 2) {
			return [fromCol - 1, fromRow + 1];
		} else {
			return [fromCol - 1, fromRow];
		}
		break;
	case 3:
		if (fromCol % 2) {
			return [fromCol - 1, fromRow];
		} else {
			return [fromCol - 1, fromRow - 1];
		}
		break;
	case 4: return [fromCol, fromRow - 1]; break;
	case 5:
		if (fromCol % 2) {
			return [fromCol + 1, fromRow];
		} else {
			return [fromCol + 1, fromRow - 1];
		}
		break;
	}
}

function bounceDir(col, row, dir)
{
	const to = getGridTo(col, row, dir);

	if (gridExists(to[0], to[1])) { return dir; }

	return (dir + 3) % 6;
}

function cascadeFunc(THIS)
{
	const at      = gridAt(THIS.anchorX, THIS.anchorY);
	const indexAt = at[0] + at[1] * gridCols;
	const valueAt = grid[indexAt].value;
	const dir     = bounceDir(at[0], at[1], grid[indexAt].cascadeDir);

	const to      = getGridTo(at[0], at[1], dir);
	const indexTo = to[0] + to[1] * gridCols;
	const valueTo = grid[indexTo].value + valueAt - 8;

	THIS.destroy();
	grid[indexAt].piece      = addObj(pieceObj(8, at[0], at[1]));
	grid[indexAt].value      = 8;
	grid[indexAt].cascadeDir = -1;

	if (grid[indexTo].piece) { grid[indexTo].piece.destroy(); }
	grid[indexTo].piece = addObj(pieceObj(valueTo, to[0], to[1]));
	grid[indexTo].value = valueTo;
	if (valueTo > 8) { grid[indexTo].cascadeDir = dir; }
}

function pieceFunc(THIS)
{
	if (THIS.grabbed) {
		if (getDistance(THIS.anchorX, THIS.anchorY, THIS.mouseX,
				THIS.mouseY)
		    > 50) {
			const theta = getAngle(THIS.anchorX, THIS.anchorY,
					       THIS.mouseX, THIS.mouseY);

			THIS.x = THIS.anchorX + 50 * Math.cos(theta);
			THIS.y = THIS.anchorY + 50 * Math.sin(theta);
		} else {
			THIS.x = THIS.mouseX;
			THIS.y = THIS.mouseY;
		}
	} else if (THIS.grabOff) {
		const delta
		 = getDistance(THIS.anchorX, THIS.anchorY, THIS.x, THIS.y);

		if (delta > 40) {
			pieceDir
			 = Math.floor(
			    getAngle(THIS.anchorX, THIS.anchorY, THIS.x, THIS.y)
			    / (Math.PI / 3))
			   % 6;
			pieceAt = gridAt(THIS.anchorX, THIS.anchorY);
			pieceTo = getGridTo(pieceAt[0], pieceAt[1], pieceDir);
		}
	} else {
		if (THIS.x != THIS.anchorX || THIS.y != THIS.anchorY) {
			const delta = getDistance(THIS.anchorX, THIS.anchorY,
						  THIS.x, THIS.y);
			const theta = getAngle(THIS.anchorX, THIS.anchorY,
					       THIS.mouseX, THIS.mouseY);

			THIS.x = THIS.anchorX + (delta / 2) * Math.cos(theta);
			THIS.y = THIS.anchorY + (delta / 2) * Math.sin(theta);
		}
	}

	if (THIS.hoverOn) {
		THIS.jit = 3;
	} else if (THIS.hoverOff) {
		THIS.jit = 1;
	}
}

function pieceObj(value, col, row)
{
	gridCoord = gridXY(col, row);

	var piece;
	if (value > 0) {
		if (value < 8) {
			piece = new Obj(polygon[value], true,
					colorString([0, 255, 0]), 75,
					gridCoord[0], gridCoord[1], pieceFunc);
		} else if (value == 8) {
			piece = new Obj(polygon[value], true,
					colorString([0, 255, 255]), 75,
					gridCoord[0], gridCoord[1], pieceFunc);
		} else {
			piece = new Obj(
			 polygon[value], true, colorString([0, 255, 255]), 75,
			 gridCoord[0], gridCoord[1], cascadeFunc);
		}
	} else {
		if (value > -8) {
			piece = new Obj(polygon[-value], true,
					colorString([255, 0, 0]), 75,
					gridCoord[0], gridCoord[1], pieceFunc);
		} else if (value == -8) {
			piece = new Obj(polygon[-value], true,
					colorString([255, 255, 0]), 75,
					gridCoord[0], gridCoord[1], pieceFunc);
		} else {
			piece = new Obj(
			 polygon[-value], true, colorString([255, 255, 0]), 75,
			 gridCoord[0], gridCoord[1], cascadeFunc);
		}
	}
	piece.jit = 1;

	return piece;
}

function createGrid(rowArray, targetArray)
{
	gridRows = rowArray.length;
	gridCols = rowArray[0].length;

	grid = new Array(gridCols * gridRows);

	const gridWidth = 100 + 75 * (gridCols - 1);
	var gridHeight;
	if (gridCols > 1) {
		gridHeight = 43.25 + 86.5 * gridRows;
	} else {
		gridHeight = 86.5 * gridRows;
	}

	playRect[0] = 0;
	playRect[1] = 0;

	if (gridWidth < canvas.width) {
		gridOffset[0] = (canvas.width - gridWidth) / 2;
		playRect[2]   = canvas.width;
	} else {
		gridOffset[0] = 0;
		playRect[2]   = gridWidth;
	}

	if (gridHeight < canvas.height) {
		gridOffset[1] = (canvas.height - gridHeight) / 2;
		playRect[1]   = canvas.height;
	} else {
		gridOffset[1] = 0;
		playRect[2]   = gridHeight;
	}

	const zoomX = canvas.width / gridWidth;
	const zoomY = canvas.height / gridHeight;
	var zoom;
	if (zoomX < zoomY) {
		zoom = zoomX;
	} else {
		zoom = zoomY;
	}

	camXYZ[0] = 0;
	camXYZ[1] = 0;
	camXYZ[2] = 0;

	for (let j = 0; j < gridRows; j++) {
		for (let i = 0; i < gridCols; i++) {
			if (rowArray[j].charAt(i) == ".") {
				grid[i + j * gridCols] = new GridCell(i, j, 0);
			} else if (rowArray[j].charAt(i) == "1") {
				grid[i + j * gridCols] = new GridCell(i, j, 1);
			} else if (rowArray[j].charAt(i) == "2") {
				grid[i + j * gridCols] = new GridCell(i, j, 2);
			} else if (rowArray[j].charAt(i) == "3") {
				grid[i + j * gridCols] = new GridCell(i, j, 3);
			} else if (rowArray[j].charAt(i) == "4") {
				grid[i + j * gridCols] = new GridCell(i, j, 4);
			} else if (rowArray[j].charAt(i) == "5") {
				grid[i + j * gridCols] = new GridCell(i, j, 5);
			} else if (rowArray[j].charAt(i) == "6") {
				grid[i + j * gridCols] = new GridCell(i, j, 6);
			} else if (rowArray[j].charAt(i) == "7") {
				grid[i + j * gridCols] = new GridCell(i, j, 7);
			} else if (rowArray[j].charAt(i) == "8") {
				grid[i + j * gridCols] = new GridCell(i, j, 8);
			} else if (rowArray[j].charAt(i) == "a") {
				grid[i + j * gridCols] = new GridCell(i, j, -1);
			} else if (rowArray[j].charAt(i) == "b") {
				grid[i + j * gridCols] = new GridCell(i, j, -2);
			} else if (rowArray[j].charAt(i) == "c") {
				grid[i + j * gridCols] = new GridCell(i, j, -3);
			} else if (rowArray[j].charAt(i) == "d") {
				grid[i + j * gridCols] = new GridCell(i, j, -4);
			} else if (rowArray[j].charAt(i) == "e") {
				grid[i + j * gridCols] = new GridCell(i, j, -5);
			} else if (rowArray[j].charAt(i) == "f") {
				grid[i + j * gridCols] = new GridCell(i, j, -6);
			} else if (rowArray[j].charAt(i) == "g") {
				grid[i + j * gridCols] = new GridCell(i, j, -7);
			} else if (rowArray[j].charAt(i) == "h") {
				grid[i + j * gridCols] = new GridCell(i, j, -8);
			} else {
				grid[i + j * gridCols] = null;
			}
			if (targetArray[j].charAt(i) == "8") {
				grid[i + j * gridCols].target = 8;
			}
		}
	}
}

function drawAll()
{
	if (updateCamFlag) { updateCamera(); }
	if (pieceTo) { makeMove(); }

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < objList.length; i++) {
		objList[i].draw();
	}
	for (let i = 0; i < partList.length; i++) {
		partList[i].draw();
	}

	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font      = "16px sans-serif";
	for (let i = 0; i < debugText.length; i++) {
		ctx.fillText(debugText[i], 0, 20 * (i + 1));
	}

	cleanupFlags();
}

createGrid(["x..x", "....", "x..x"], ["x..x", "....", "x..x"]);

setInterval(drawAll, 16.7);
