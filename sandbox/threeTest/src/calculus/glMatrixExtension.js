// glMatrix plugin

vec3.linear = function(a, b, t) {
	return [a[0]*(1-t) + b[0]*t, a[1]*(1-t) + b[1]*t, a[2]*(1-t) + b[2]*t];		
}

vec3.norm = function(a) {
	return (Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]));
}
vec3.distance = function(a, b) {
	return (Math.sqrt((a[0]-b[0])*(a[0]-b[0]) + (a[1]-b[1])*(a[1]-b[1]) + (a[2]-b[2])*(a[2]-b[2])));
}


mat3.pointwiseProduct = function(a, b) {
	return [a[0]*b[0], a[1]*b[1], a[2]*b[2], a[3]*b[3], a[4]*b[4], a[5]*b[5], a[6]*b[6], a[7]*b[7], a[8]*b[8]];
}

mat3.sum = function(a) {
	var sum = 0;
	for(var i = 0; i < a.length; i++) {
		sum += a[i];
	}
	return sum;
}
