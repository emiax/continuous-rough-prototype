CALC.FunctionSurfaceGeometry = function (expr, boundingRect, resolution) {

	//var data = expression.tesselate(expr, boundingRect, 10);
	//console.log(vertices[5]);
	var x = new CALC.Variable({symbol: 'x'});
	var y = new CALC.Variable({symbol: 'y'});

	CALC.ParametricSurfaceGeometry.call(this, x, y, expr, {x: [boundingRect[0], boundingRect[2]], y: [boundingRect[1], boundingRect[3]]}, null, resolution);
	
	var scope = this;
	
	this.computeCentroids();
	this.mergeVertices();

};



CALC.FunctionSurfaceGeometry.prototype = new CALC.ParametricSurfaceGeometry();
CALC.FunctionSurfaceGeometry.prototype.constructor = CALC.FunctionSurfaceGeometry;