CALC.Node.prototype.tangentialPlane = function(x, y) {
	return CALC.tangentialPlane(this, x, y);
}

CALC.tangentialPlane = function(expr, x, y) {
		
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
	return new CALC.Addition({	
		left: new CALC.Addition({
			left: new CALC.Multiplication({
				left: new CALC.Constant({value: -n.x/n.z}),
				right: new CALC.Variable({symbol: 'x'})
			}),
			right: new CALC.Multiplication({
				left: new CALC.Constant({value: -n.y/n.z}),
				right: new CALC.Variable({symbol: 'y'})
			})
		}),
		right: new CALC.Constant({value: -d/n.z})
	});
};