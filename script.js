const objList = [];

class Obj
{
	recalcLines()
	{
		for (let i = 0; i < this.unitList.length; i++) {
			this.lineList[i][1]
			 = this._x
			   + this._scale
			      * (this.unitList[i][1] * Math.cos(this._theta)
				 - this.unitList[i][2] * Math.sin(this._theta));
			this.lineList[i][2]
			 = this._y
			   + this._scale
			      * (this.unitList[i][2] * Math.cos(this._theta)
				 + this.unitList[i][1] * Math.sin(this._theta));
			this.lineList[i][3]
			 = this._x
			   + this._scale
			      * (this.unitList[i][3] * Math.cos(this._theta)
				 - this.unitList[i][4] * Math.sin(this._theta));
			this.lineList[i][4]
			 = this._y
			   + this._scale
			      * (this.unitList[i][4] * Math.cos(this._theta)
				 + this.unitList[i][3] * Math.sin(this._theta));
		}
	}

	constructor(unitList, isZoomable, color, scale, x, y, onDraw)
	{
		this.isZoomable = isZoomable;
		this.unitList   = new Array(unitList.length);
		this.lineList   = new Array(unitList.length);
		this.bbox       = [0, 0, 0, 0];
		this.recalc     = true;

		this._color  = color;
		this._scale  = scale;
		this._theta  = 0;
		this._x      = x;
		this._y      = y;
		this._onDraw = onDraw;

		for (let i = 0; i < unitList.length; i++) {
			this.unitList[i] = [
				unitList[i][0], unitList[i][1], unitList[i][2],
				unitList[i][3], unitList[i][4]
			];

			if (unitList[i][0]) {
				this.lineList[i] = [unitList[i][0], 0, 0, 0, 0];
			} else {
				this.lineList[i] = [color, 0, 0, 0, 0];
			}
		}
	}

	draw()
	{
		if (this.recalc) { this.recalcLines(); }

		if (this._onDraw) { this._onDraw(this); }

		if (this.isZoomable) {
			for (let i = 0; i < this.lineList.length; i++) {
				drawZoomLine(this.lineList[i]);
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
		for (let i = 0; i < this.unitList.length; i++) {
			if (!unitList[i][0]) { this.lineList[i][0] = str; }
		};
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
		this._theta = value;
		this.recalc = true;
	}

	get x() { return this._x; }
	set x(value)
	{
		this._x      = value;
		this._recalc = true;
	}

	get y() { return this._y; }
	set y(value)
	{
		this._y      = value;
		this._recalc = true;
	}
}

function drawAll()
{
	if (updateCamFlag) { updateCamera(); }

	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < objList.length; i++) {
		objList[i].draw();
	}

	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font      = "16px sans-serif";
	ctx.fillText("2", 0, 20);

	cleanupFlags();
}

objList.push(new Obj(polygon[5], true, "rgb(255, 0, 0)", 100, 0, 0,
		     (THIS) => { THIS.theta += 0.1; }));
setInterval(drawAll, 16.7);
