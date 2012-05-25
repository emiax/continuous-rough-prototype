	/*
		Example: of x
		
		var x = CALC.parse('t^2 - 2');

		Example of domain and range (temporary?)

		var domain = {
			s: [-1, 1],
			t: [-1, 1],
		};

		var range = {
			x: [-1, 1],
			y: [-1, 1],
			z: [-1, 1]
		};

		If no range is specified, then x, y, z will be calculated from the whole domain.
	
		Would this be a good interface? it would allow for open intervals
		as well as mathermatical expressions inside intervals.

		var domain = {
			s: CALC.Interval('[-1, 1['),
			t: CALC.Interval('[s^2, 4]') 
		};

	*/

CALC.ParametricSurfaceGeometry = function (x, y, z, domain, range, resolution) {


	THREE.Geometry.call(this);
	this.xExpr = x;
	this.yExpr = y;
	this.zExpr = z;

	var scope = this, v0, v1;
	this.materials = [];

	resolution = resolution || 10;	

	if (x && y && z && domain) {
	
		var parameters = [];
		for (p in domain) {
			if (domain.hasOwnProperty(p)) {
				parameters.push(p);
			}
		}

		if (parameters.length != 2) {
			throw new CALC.InvalidArgumentException();
		}

		var res0 = resolution, res1 = resolution, i = 0,
			p0 = parameters[0], p1 = parameters[1], variables = {};

		var updateBoundingBox = function (vector) {
			var x = vector.x,
				y = vector.y,
				z = vector.z;

			if (!scope.boundingBox) {
				scope.boundingBox = {min: new THREE.Vector3(x, y, z), max: new THREE.Vector3(x, y, z)};
			} else {
				if (x < scope.boundingBox.min.x) {
					scope.boundingBox.min.x = x;
				} else if (x > scope.boundingBox.max.x) {
					scope.boundingBox.max.x = x;
				}
				if (y < scope.boundingBox.min.y) {
					scope.boundingBox.min.y = y;
				} else if (y > scope.boundingBox.max.y) {
					scope.boundingBox.max.y = y;
				}
				if (z < scope.boundingBox.min.z) {
					scope.boundingBox.min.z = z;
				} else if (z > scope.boundingBox.max.z) {
					scope.boundingBox.max.z = z;
				}
			}
		};


		for (v0 = domain[p0][0]; v0 < domain[p0][1]; v0 += res0) {
			for (v1 = domain[p1][0]; v1 < domain[p1][1]; v1 += res1) {

				variables[p0] = v0;
				variables[p1] = v1;
				var x0 = this.xExpr.evaluate(variables);
				var y0 = this.yExpr.evaluate(variables);
				var z0 = this.zExpr.evaluate(variables);

				variables[p0] = v0 + res0;
				var x1 = this.xExpr.evaluate(variables);
				var y1 = this.yExpr.evaluate(variables);
				var z1 = this.zExpr.evaluate(variables);

				variables[p1] = v1 + res1;
				var x2 = this.xExpr.evaluate(variables);
				var y2 = this.yExpr.evaluate(variables);
				var z2 = this.zExpr.evaluate(variables);

				variables[p0] = v0;
				var x3 = this.xExpr.evaluate(variables);
				var y3 = this.yExpr.evaluate(variables);
				var z3 = this.zExpr.evaluate(variables);

				var u0 = new THREE.Vector3(x0, y0, z0);
				updateBoundingBox(u0);
				scope.vertices.push(new THREE.Vertex(u0));
				var u1 = new THREE.Vector3(x1, y1, z1)
				updateBoundingBox(u1);
				scope.vertices.push(new THREE.Vertex(u1));
				var u2 = new THREE.Vector3(x2, y2, z2);
				updateBoundingBox(u2);
				scope.vertices.push(new THREE.Vertex(u2));
				var u3 = new THREE.Vector3(x3, y3, z3);
				updateBoundingBox(u3);
				scope.vertices.push(new THREE.Vertex(u3));
				
				var face = new THREE.Face4(i*4, i*4 + 1, i*4 + 2, i*4 + 3);
				face.normal = new THREE.Vector3(0, 0, 1); // todo: fix normals
				scope.faces.push(face);

				i++;
			}
		}

	}

	this.computeCentroids();
	this.mergeVertices();

};



CALC.ParametricSurfaceGeometry.prototype = new THREE.Geometry();
CALC.ParametricSurfaceGeometry.prototype.constructor = CALC.ParametricSurfaceGeometry;

