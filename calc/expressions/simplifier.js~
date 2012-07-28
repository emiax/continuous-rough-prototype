CALC.Node.prototype.simplify = function() {
	//console.log(this);
	return CALC.simplify({node: this});
};


CALC.Simplifier = function(spec) {
	spec = spec || {};
	this.node = spec.node || null;
}.inheritsFrom(CALC.NodeVisitor);

CALC.simplify = function(spec) {
	var d = new CALC.Simplifier(spec);
	return d.simplify();
}

CALC.Simplifier.prototype.simplify = function() {
	return this.node.accept(this);
}


CALC.Simplifier.prototype.visitConstant = function(node) {
	return node.clone();
};

CALC.Simplifier.prototype.visitVariable = function(node) {
	return node.clone();
};

CALC.Simplifier.prototype.visitAddition = function(node) {
	var left = node.left.simplify();
	var right = node.right.simplify();
	var that = new CALC.Addition({
		left: left,
		right: right
	});	

	if (left instanceof CALC.Constant && right instanceof CALC.Constant) {
		var e = that.evaluate();
		if (e === Math.round(e)) {
			return new CALC.Constant({value: e});
		}	
	}

	if (left instanceof CALC.Constant && !left.value) {
		return right;
	} else if (right instanceof CALC.Constant && !right.value) {
		return left;
	}
	return that;
}

CALC.Simplifier.prototype.visitSubtraction = function(node) {
	var left = node.left.simplify();
	var right = node.right.simplify();
	var that = new CALC.Subtraction({
		left: left,
		right: right
	});

	if (left instanceof CALC.Constant && right instanceof CALC.Constant) {
		var e = that.evaluate();

		if (e === Math.round(e)) {
			return new CALC.Constant({value: e});
		}	
	}

	if (left instanceof CALC.Constant && !left.value) {
		return new CALC.Multiplication({
			left: new CALC.Constant({value: -1}),
			right: right
		});
	} else if (right instanceof CALC.Constant && !right.value) {
		return left;
	}
	return that;
};

CALC.Simplifier.prototype.visitMultiplication = function(node) {
	var left = node.left.simplify();
	var right = node.right.simplify();
	var that = new CALC.Multiplication({
		left: left,
		right: right
	});

	if (left instanceof CALC.Constant && right instanceof CALC.Constant) {
		var e = that.evaluate();
		if (e === Math.round(e)) {
			return new CALC.Constant({value: e});
		}	
	}

	// console.log("left: " + left);
	// console.log("right: " + right);
	if (left instanceof CALC.Constant) {
		if (!left.value) {
			return left;
		} else if (left.value === 1) {
			return right;
		} 
	} else if (right instanceof CALC.Constant) {
		if (!right.value) {
			return right;
		} else if (right.value === 1) {

			return left;
		} 
	}
	return that;
};

CALC.Simplifier.prototype.visitDivision = function(node) {
	var left = node.left.simplify();
	var right = node.right.simplify();
	var that = new CALC.Division({
		left: left,
		right: right
	});

	if (left instanceof CALC.Constant && right instanceof CALC.Constant) {
		var e = that.evaluate();
		if (e === Math.round(e)) {
			return new CALC.Constant({value: e});
		}	
	}

	if (left instanceof CALC.Constant) {
		if (!left.value) {
			return new CALC.Constant({value: 0});
		}
	} else if (right instanceof CALC.Constant) {
		if (right.value === 1) {
			return left;
		} 
	}
	return that;

};

CALC.Simplifier.prototype.visitPower = function(node) {
	var left = node.left.simplify();
	var right = node.right.simplify();
	var that = new CALC.Power({
		left: left,
		right: right
	});

	if (left instanceof CALC.Constant && right instanceof CALC.Constant) {
		var e = that.evaluate();
		if (e === Math.round(e)) {
			return new CALC.Constant({value: e});
		}	
	}

	if (left instanceof CALC.Constant) {
		if (!left.value) {
			return new CALC.Constant({value: 0});
		}
	} else if (right instanceof CALC.Constant) {
		if (right.value === 1) {
			return left;
		} 
	}

	return that;
	
};

CALC.Simplifier.prototype.visitExp = function(node) {
	return node.clone();
};

CALC.Simplifier.prototype.visitLn = function(node) {
	return node.clone();
};

CALC.Simplifier.prototype.visitSin = function(node) {
	return node.clone();
};

CALC.Simplifier.prototype.visitCos = function(node) {
	return node.clone();
};

