var quadratic = {}

quadratic.z = function(mat, x, y) {
	var a = mat3.create([x*x*y*y, x*x*y, x*x, x*y*y, x*y, x, y*y, y, 1]);
	var terms = mat3.pointwiseProduct(a, mat);

	return mat3.sum(terms);
};

quadratic.dzdx = function(mat, x, y) {
	var a = mat3.create([2*x*y*y, 2*x*y, 2*x, y*y, y, 1, 0, 0, 0]);
	var terms = mat3.pointwiseProduct(a, mat);
	return mat3.sum(terms);
};

quadratic.dzdy = function(mat, x, y) {
	var a = mat3.create([2*x*x*y, 2*x*y, 0, 2*x*y, x, 0, 2*y, 1, 0]);
	var terms = mat3.pointwiseProduct(a, mat);
	return mat3.sum(terms);
};




quadratic.tesselate = function(mat, boundingRect, res) {

	var vertices = [];

	var pushVertex = function(a, vertex) {
		for(i in vertex) {
			a.push(vertex[i]);
		}
	};

	var xRes = res, yRes = res;

	for (var y = boundingRect[1]; y<boundingRect[2]-yRes; y+=yRes) {
		for (var x = boundingRect[0]; x<boundingRect[3]-xRes; x+=xRes) {
			//first triangle of square
			pushVertex(vertices, [x, y, quadratic.z(mat, x, y)]);
			pushVertex(vertices, [x+xRes, y, quadratic.z(mat, x+xRes, y)]);
			pushVertex(vertices, [x, y+yRes, quadratic.z(mat, x, y+yRes)]);
			//second triangle of square
			pushVertex(vertices, [x+xRes, y, quadratic.z(mat, x+xRes, y)]);
			pushVertex(vertices, [x, y+yRes, quadratic.z(mat, x, y+yRes)]);
			pushVertex(vertices, [x+xRes, y+yRes, quadratic.z(mat, x+xRes, y+yRes)]);
		}
	}

    return vertices;
};


quadratic.tangentialPlane = function(mat, x, y) {

	var dzdx = quadratic.dzdx(mat, x, y),
		dzdy = quadratic.dzdy(mat, x, y);
	var n = vec3.cross([1, 0, dzdx], [0, 1, dzdy]);
	var a = n[0], b = n[1], c = n[2];
	var d = - a*x - b*y - c*quadratic.z(mat, x, y);
	return [-a/c, -b/c, -d/c];
};


var plane = {}

plane.z = function(p, x, y) {
	return p[0]*x + p[1]*y + p[2];
}

plane.dzdx = function(p) {
	return p[0];
}

plane.dzdy = function(p) {
	return p[1];
}

plane.tesselate = function(p, boundingRect) {
	var vertices = [];
	var pushVertex = function(a, vertex) {
		for(i in vertex) {
			a.push(vertex[i]);
		}
	};
	var x1 = boundingRect[0], y1 = boundingRect[1], x2 = boundingRect[2], y2 = boundingRect[3];

	pushVertex(vertices, [x1, y1, plane.z(p, x1, y1)]);
	pushVertex(vertices, [x2, y1, plane.z(p, x2, y1)]);
	pushVertex(vertices, [x1, y2, plane.z(p, x1, y2)]);
	pushVertex(vertices, [x2, y1, plane.z(p, x2, y1)]);
	pushVertex(vertices, [x1, y2, plane.z(p, x1, y2)]);
	pushVertex(vertices, [x2, y2, plane.z(p, x2, y2)]);
	
	return vertices;
};



