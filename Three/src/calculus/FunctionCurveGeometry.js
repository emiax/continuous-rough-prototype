CALC.FunctionCurveGeometry = function (expr, domain, resolution) {

	//var data = expression.tesselate(expr, boundingRect, 10);
	//console.log(vertices[5]);

	THREE.Geometry.call( this );
	this.expression = expr;
	var scope = this;
	this.materials = [];

	resolution = resolution || 1;

	var res = resolution;


	if (expr && domain) {
		for (var x = domain[0]; x<domain[1]-res; x+=res) {
			scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x, expr.evaluate({x: x}), 0)));
		}
	}

};



CALC.FunctionCurveGeometry.prototype = new THREE.Geometry();
CALC.FunctionCurveGeometry.prototype.constructor = CALC.FunctionCurveGeometry;