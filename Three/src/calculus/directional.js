SYM.Node.prototype.directionalFunction = function(x, y) {
	return SYM.directionalFunction(this, x, y);
}

SYM.directionalFunction = function(expr, x, y) {
		
	var dzdx = expr.differentiate('x').evaluate({x: x, y: y});
	var dzdy = expr.differentiate('y').evaluate({x: x, y: y});
	

	var a = new THREE.Vector3(1, 0, dzdx);
	var b = new THREE.Vector3(0, 1, dzdy);
	var n = new THREE.Vector3();
	n.cross(a, b);

	var d = - n.x*x - n.y*y - n.z*expr.evaluate({x: x, y: y});
			
	return new SYM.Addition({	
		left: new SYM.Addition({
			left: new SYM.Multiplication({
				left: new SYM.Constant({value: -n.x/n.z}),
				right: new SYM.Variable({symbol: 'x'})
			}),
			right: new SYM.Multiplication({
				left: new SYM.Constant({value: -n.y/n.z}),
				right: new SYM.Variable({symbol: 'y'})
			})
		}),
		right: new SYM.Constant({value: -d/n.z})
	});
};