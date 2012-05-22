

CALC.ParametricCurveGeometry = function (x, y, z, domain, range, resolution) {

	THREE.Geometry.call(this);
	this.xExpr = x;
	this.yExpr = y;
	this.zExpr = z;

	var scope = this;
	this.materials = [];

	resolution = resolution || 1;
	
	if (x && y && z && domain) {

		var variable, parameter;
		
		for (p in domain) {
			if (domain.hasOwnProperty(p)) {
				variable = p;
				break;
			}
		}

		for (var s = domain[variable][0]; s < domain[variable][1]; s += resolution) {
		
			parameter = {};
			parameter[variable] = s;
		
			var x0 = this.xExpr.evaluate(parameter);
			var y0 = this.yExpr.evaluate(parameter);
			var z0 = this.zExpr.evaluate(parameter);

			scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x0, y0, z0)));
		}
		
		parameter = {};
		parameter[variable] = domain[variable][1];
		
		var x0 = this.xExpr.evaluate(parameter);
		var y0 = this.yExpr.evaluate(parameter);
		var z0 = this.zExpr.evaluate(parameter);

		scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x0, y0, z0)));

	}

};



CALC.ParametricCurveGeometry.prototype = new THREE.Geometry();
CALC.ParametricCurveGeometry.prototype.constructor = CALC.ParametricCurveGeometry;