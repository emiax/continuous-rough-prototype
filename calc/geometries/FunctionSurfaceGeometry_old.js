CALC.FunctionSurfaceGeometry = function (expr, boundingRect, resolution) {

	//var data = expression.tesselate(expr, boundingRect, 10);
	//console.log(vertices[5]);
	THREE.Geometry.call( this );
	this.expression = expr;
	var scope = this;
	this.materials = [];

	resolution = resolution || 10;

	var xRes = resolution, yRes = resolution;
	this.zInterval = [null, null];

	if (expr && boundingRect) {
		var i = 0;
		var x, y, z;
		for (y = boundingRect[1]; y<boundingRect[2]-yRes; y+=yRes) {
			for (x = boundingRect[0]; x<boundingRect[3]-xRes; x+=xRes) {
				//first triangle of square
				z = expr.evaluate({x: x, y: y})
				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, z)));
				
				if (this.zInterval[0] === null || z < this.zInterval[0]) {
					this.zInterval[0] = z;
				}

				if (this.zInterval[1] === null || z > this.zInterval[1]) {
					this.zInterval[1] = z;
				}

				z = expr.evaluate({x: x, y: y+yRes})
				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y+yRes, z)));

				if (z < this.zInterval[0]) {
					this.zInterval[0] = z;
				}

				if (z > this.zInterval[1]) {
					this.zInterval[1] = z;
				}

				z = expr.evaluate({x: x+xRes, y: y+yRes});
				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x+xRes, y+yRes, z)));

				if (z < this.zInterval[0]) {
					this.zInterval[0] = z;
				}

				if (z > this.zInterval[1]) {
					this.zInterval[1] = z;
				}

				z = expr.evaluate({x: x+xRes, y: y});
				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x+xRes, y, z)));
				
				if (z < this.zInterval[0]) {
					this.zInterval[0] = z;
				}

				if (z > this.zInterval[1]) {
					this.zInterval[1] = z;
				}
				
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



CALC.FunctionSurfaceGeometry.prototype = new THREE.Geometry();
CALC.FunctionSurfaceGeometry.prototype.constructor = CALC.FunctionSurfaceGeometry;