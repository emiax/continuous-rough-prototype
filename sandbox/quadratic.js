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
	var n = vec3.cross(dzdx(mat, x, y), dzdy(mat, x, y));


};


var plane = {}

plane.z = function(vec, x, y) {
	return vec[0]*x + vec[1]*y + vec[2];
}

plane.dzdx = function(vec) {
	return vec[0];
}

plane.dzdy = function(vec) {
	return vec[1];
}




