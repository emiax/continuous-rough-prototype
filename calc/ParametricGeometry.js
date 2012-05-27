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

THREE.ParametricGeometry = function (x, y, z, domain, range, resolution) {

	THREE.Geometry.call(this);
	this.xExpr = x;
	this.yExpr = y;
	this.zExpr = z;

	var scope = this;
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
			throw new CALC.NotImplementedYetException();
		}

		var res0 = resolution, res1 = resolution, i = 0,
			p0 = parameters[0], p1 = parameters[1], variables = {};

		for (var v0 = domain[p0][0]; v0 < domain[p0][1]; v0 += res0) {
			for (var v1 = domain[p1][0]; v1 < domain[p1][1]; v1 += res1) {
				
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
				

				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x0, y0, z0)));
				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x1, y1, z1)));
				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x2, y2, z2)));
				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x3, y3, z3)));
				
				var face = new THREE.Face4(i*4, i*4 + 1, i*4 + 2, i*4 + 3);
				face.normal = new THREE.Vector3(0, 0, 1); // todo: fix normals
				scope.faces.push(face);

				i++;
			}
		}

	}

	this.facesXasc = scope.faces.slice(0);
	this.facesYasc = scope.faces.slice(0);
	this.facesZasc = scope.faces.slice(0);

	this.computeCentroids();
	this.mergeVertices();

	var cmpFace = function (a, b, axis) {
		return a.centroid[axis] === b.centroid[axis] ? 0 :
			   a.centroid[axis] < b.centroid[axis] ? -1 :
			   1;
	}


	this.facesXasc.sort(function(a, b) { cmpFace(a, b, 'x') });
	this.facesXasc.sort(function(a, b) { cmpFace(a, b, 'y') });
	this.facesXasc.sort(function(a, b) { cmpFace(a, b, 'z') });

	this.facesXdesc = scope.facesXasc.slice(0).reverse();
	this.facesYdesc = scope.facesYasc.slice(0).reverse();
	this.facesZdesc = scope.facesZasc.slice(0).reverse();

	console.log(this.facesXdesc);



};



THREE.ParametricGeometry.prototype = new THREE.Geometry();
THREE.ParametricGeometry.prototype.constructor = THREE.ParametricGeometry;

