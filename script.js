const objList = [];

class Obj
{
	recalcLines()
	{
		for (let i = 0; i < this.unitList.length; i++) {
			if (this.unitList[i][0]) {
				this.lineList[i] = [
					this.unitList[i][0],
					this._x
					 + this._scale
					    * (this.unitList[i][1]
						* Math.cos(this._theta)
					       - this.unitList[i][2]
						  * Math.sin(this._theta)),
					this._y
					 + this._scale
					    * (this.unitList[i][2]
						* Math.cos(this._theta)
					       + this.unitList[i][1]
						  * Math.sin(this._theta)),
					this._x
					 + this._scale
					    * (this.unitList[i][3]
						* Math.cos(this._theta)
					       - this.unitList[i][4]
						  * Math.sin(this._theta)),
					this._y
					 + this._scale
					    * (this.unitList[i][4]
						* Math.cos(this._theta)
					       + this.unitList[i][3]
						  * Math.sin(this._theta))
				];
			} else {
				this.lineList[i] = [
					this._color,
					this._x
					 + this._scale
					    * (this.unitList[i][1]
						* Math.cos(this._theta)
					       - this.unitList[i][2]
						  * Math.sin(this._theta)),
					this._y
					 + this._scale
					    * (this.unitList[i][2]
						* Math.cos(this._theta)
					       + this.unitList[i][1]
						  * Math.sin(this._theta)),
					this._x
					 + this._scale
					    * (this.unitList[i][3]
						* Math.cos(this._theta)
					       - this.unitList[i][4]
						  * Math.sin(this._theta)),
					this._y
					 + this._scale
					    * (this.unitList[i][4]
						* Math.cos(this._theta)
					       + this.unitList[i][3]
						  * Math.sin(this._theta))
				];
			}
		}
	}

	constructor(unitList, color, scale, x, y, isZoomable, onDraw)
	{
		this.isZoomable = isZoomable;
		this.unitList   = new Array(unitList.length);
		this.lineList   = new Array(unitList.length);
		this.recalc     = true;

		this._color  = color;
		this._scale  = scale;
		this._theta  = 0.0;
		this._x      = x;
		this._y      = y;
		this._onDraw = onDraw;

		for (let i = 0; i < unitList.length; i++) {
			this.unitList[i] = [
				unitList[i][0], unitList[i][1], unitList[i][2],
				unitList[i][3], unitList[i][4]
			];
		}
	}

	draw()
	{
		if (this._onDraw) { this._onDraw(this); }

		if (this.recalc) {
			this.recalcLines();
			this.recalc = false;
		}

		if (this.isZoomable) {
			for (let i = 0; i < this.lineList.length; i++) {
				drawZoomedLine(this.lineList[i]);
			}
		} else {
			for (let i = 0; i < this.lineList.length; i++) {
				drawLine(this.lineList[i]);
			}
		}
	}

	get color() { return this._color; }
	set color(str)
	{
		this._color = str;
		this.recalc = true;
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
		this._theta = value % (2 * Math.PI);
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
	get onDraw() { return this._onDraw; }
	set onDraw(func) { this._onDraw = func; }
}

objList.push(new Obj(
 [
	 [null, minCamX, minCamY, maxCamX, minCamY],
	 [null, maxCamX, minCamY, maxCamX, maxCamY],
	 [null, maxCamX, maxCamY, minCamX, maxCamY],
	 [null, minCamX, maxCamY, minCamX, minCamY]
 ],
 "rgb(255, 255, 255)", 1, 0, 0, true, null));
objList.push(new Obj(polygon[5], "rgb(0, 255, 0)", 100, 0, 0, true,
		     (THIS) => { THIS.theta += 0.1; }));

function drawAll()
{
	updateCamera();

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < objList.length; i++) {
		objList[i].draw();
	}

	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font      = "16px sans-serif";

	cleanupFlags();
}

setInterval(drawAll, 16.7);
