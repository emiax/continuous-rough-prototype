SYM.Node.prototype.tangentialPlane = function(x, y) {
	return SYM.tangentialPlane(this, x, y);
}

SYM.tangentialPlane = function(expr, x, y) {
		
	var dzdx = expr.differentiate('x').evaluate({x: x, y: y});
	var dzdy = expr.differentiate('y').evaluate({x: x, y: y});
	
	console.log("dzdx = " + expr.differentiate('x'));
	console.log("dzdy = " + expr.differentiate('y'));

	var a = new THREE.Vector3(1, 0, dzdx);
	console.log(a);
	var b = new THREE.Vector3(0, 1, dzdy);
	console.log(b);
	var n = new THREE.Vector3();
	n.cross(a, b);
	console.log(n);

	// ax + by + cz + d = 0
	// => d = -ax - by - cz
	var d = - n.x*x - n.y*y - n.z*expr.evaluate({x: x, y: y});
	
	// => z = 
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