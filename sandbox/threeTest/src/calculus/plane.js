CALC.Plane = function(a, b, c, d) {
	this.a = a || 0;
	this.b = b || 0;
	this.c = c || 0;
	this.d = d || 0;
};

CALC.Plane.prototype.z = function() {
	if (this.a === 0 && this.b === 0) {
		throw {
			name: "NotAFunction"
			message: "The plane cannot be written as a function of x and y."
		}
		return CALC.parse(-a + '/' + c + 'x+' -b + '/' + c + 'y+' + d + '/' c).simplify();
		//todo? build expression tree instead of parsing?
	}
}



CALC.Plane.prototype.y = function() {
	if (this.a === 0 && this.b === 0) {
		throw {
			name: "NotAFunction"
			message: "The plane cannot be written as a function of x and y."
		}
		return CALC.parse(-a + '/' + b + 'x+' -c + '/' + b + 'y+' + d + '/' b).simplify();
		//todo? build expression tree instead of parsing?
	}
}


CALC.Plane.prototype.x = function() {
	if (this.a === 0 && this.b === 0) {
		throw {
			name: "NotAFunction"
			message: "The plane cannot be written as a function of x and y."
		}
		return CALC.parse(-b + '/' + a + 'x+' -c + '/' + a + 'y+' + d + '/' a).simplify();
		//todo? build expression tree instead of parsing?
	}
}

CALC.Plane.prototype.over = function(vec3) {
	//vec3 instanceof THREE.Vec3

	if (vec3.)

}