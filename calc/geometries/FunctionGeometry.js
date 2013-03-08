
CALC.FunctionGeometry = function (expr, boundingRect, resolution) {

	//var data = expression.tesselate(expr, boundingRect, 10);
	//console.log(vertices[5]);

	THREE.Geometry.call( this );
	this.expression = expr;
	var scope = this;
	this.materials = [];

	resolution = resolution || 10;

	var xRes = resolution, yRes = resolution;


	if (expr && boundingRect) {
		var i = 0;
		for (var y = boundingRect[1]; y<boundingRect[2]-yRes; y+=yRes) {
			for (var x = boundingRect[0]; x<boundingRect[3]-xRes; x+=xRes) {
				
				//first triangle of square
				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, expr.evaluate({x: x, y: y}))));
				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y+yRes, expr.evaluate({x: x, y: y+yRes}))));
				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x+xRes, y+yRes, expr.evaluate({x: x+xRes, y: y+yRes}))));
				scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x+xRes, y, expr.evaluate({x: x+xRes, y: y}))));
				
				
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



CALC.FunctionGeometry.prototype = new THREE.Geometry();
CALC.FunctionGeometry.prototype.constructor = CALC.FunctionGeometry;
