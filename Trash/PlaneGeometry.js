
THREE.FunctionGeometry = function (expr, boundingRect, resolution) {

	//var data = expression.tesselate(expr, boundingRect, 10);
	//console.log(vertices[5]);

	THREE.Geometry.call( this );
	this.expression = expr;
	var scope = this;
	this.materials = [];

	resolution = resolution || 10;

	var xRes = resolution, yRes = resolution;

	var i = 0;
	for (var y = boundingRect[1]; y<boundingRect[2]-yRes; y+=yRes) {
		for (var x = boundingRect[0]; x<boundingRect[3]-xRes; x+=xRes) {
			
			//first triangle of square
			scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y, expr.evaluate({x: x, y: y}))));
			scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y+yRes, expr.evaluate({x: x, y: y+yRes}))));
			scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x+xRes, y, expr.evaluate({x: x+xRes, y: y}))));
			
			var face1 = new THREE.Face3(i*6, i*6 + 1, i*6 + 2);
			face1.normal = new THREE.Vector3(0, 0, 1); // todo: fix normals
			scope.faces.push(face1);

			
			scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x+xRes, y+yRes, expr.evaluate({x: x+xRes, y: y+yRes}))));
			scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x+xRes, y, expr.evaluate({x: x+xRes, y: y}))));
			scope.vertices.push(new THREE.Vertex(new THREE.Vector3(x, y+yRes, expr.evaluate({x: x, y: y+yRes}))));
			
			
			var face2 = new THREE.Face3(i*6 + 3, i*6 + 4, i*6 + 5);
			face2.normal = new THREE.Vector3(0, 0, 1);  // todo: fix normals
			scope.faces.push(face2);

			i++;
		}
	}

/*

	function buildPlane( u, v, udir, vdir, width, height, depth, material ) {

		var w, ix, iy,
		gridX = segmentsWidth || 1,
		gridY = segmentsHeight || 1,
		width_half = width / 2,
		height_half = height / 2,
		offset = scope.vertices.length;

		if ( ( u === 'x' && v === 'y' ) || ( u === 'y' && v === 'x' ) ) {

			w = 'z';

		} else if ( ( u === 'x' && v === 'z' ) || ( u === 'z' && v === 'x' ) ) {

			w = 'y';
			gridY = segmentsDepth || 1;

		} else if ( ( u === 'z' && v === 'y' ) || ( u === 'y' && v === 'z' ) ) {

			w = 'x';
			gridX = segmentsDepth || 1;

		}

		var gridX1 = gridX + 1,
		gridY1 = gridY + 1,
		segment_width = width / gridX,
		segment_height = height / gridY,
		normal = new THREE.Vector3();

		normal[ w ] = depth > 0 ? 1 : - 1;

		for ( iy = 0; iy < gridY1; iy ++ ) {

			for ( ix = 0; ix < gridX1; ix ++ ) {

				var vector = new THREE.Vector3();
				vector[ u ] = ( ix * segment_width - width_half ) * udir;
				vector[ v ] = ( iy * segment_height - height_half ) * vdir;
				vector[ w ] = depth;

				scope.vertices.push( new THREE.Vertex( vector ) );

			}

		}

		for ( iy = 0; iy < gridY; iy++ ) {

			for ( ix = 0; ix < gridX; ix++ ) {

				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				var face = new THREE.Face4( a + offset, b + offset, c + offset, d + offset );
				face.normal.copy( normal );
				face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone(), normal.clone() );
				face.materialIndex = material;

				scope.faces.push( face );
				scope.faceVertexUvs[ 0 ].push( [
							new THREE.UV( ix / gridX, iy / gridY ),
							new THREE.UV( ix / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, ( iy + 1 ) / gridY ),
							new THREE.UV( ( ix + 1 ) / gridX, iy / gridY )
						] );

			}

		}

	}
*/
	this.computeCentroids();
	this.mergeVertices();

};

THREE.FunctionGeometry.prototype = new THREE.Geometry();
THREE.FunctionGeometry.prototype.constructor = THREE.FunctionGeometry;
