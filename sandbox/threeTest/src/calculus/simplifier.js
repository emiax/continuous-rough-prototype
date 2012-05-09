SYM.Node.prototype.simplify = function() {
	//console.log(this);
	return SYM.simplify({node: this});
};


SYM.Simplifier = function(spec) {
	spec = spec || {};
	this.node = spec.node || null;
}.inheritsFrom(SYM.NodeVisitor);

SYM.simplify = function(spec) {
	var d = new SYM.Simplifier(spec);
	return d.simplify();
}

SYM.Simplifier.prototype.simplify = function() {
	return this.node.accept(this);
}


SYM.Simplifier.prototype.visitConstant = function(node) {
	return node.clone();
};

SYM.Simplifier.prototype.visitVariable = function(node) {
	return node.clone();
};

SYM.Simplifier.prototype.visitAddition = function(node) {
	var left = node.left.simplify();
	var right = node.right.simplify();
	var that = new SYM.Addition({
		left: left,
		right: right
	});	

	if (left instanceof SYM.Constant && right instanceof SYM.Constant) {
		var e = that.evaluate();
		if (e === Math.round(e)) {
			return new SYM.Constant({value: e});
		}	
	}

	if (left instanceof SYM.Constant && !left.value) {
		return right;
	} else if (right instanceof SYM.Constant && !right.value) {
		return left;
	}
	return that;
}

SYM.Simplifier.prototype.visitSubtraction = function(node) {
	var left = node.left.simplify();
	var right = node.right.simplify();
	var that = new SYM.Subtraction({
		left: left,
		right: right
	});

	if (left instanceof SYM.Constant && right instanceof SYM.Constant) {
		var e = that.evaluate();

		if (e === Math.round(e)) {
			return new SYM.Constant({value: e});
		}	
	}

	if (left instanceof SYM.Constant && !left.value) {
		return new SYM.Multiplication({
			left: new SYM.Constant({value: -1}),
			right: right
		});
	} else if (right instanceof SYM.Constant && !right.value) {
		return left;
	}
	return that;
};

SYM.Simplifier.prototype.visitMultiplication = function(node) {
	var left = node.left.simplify();
	var right = node.right.simplify();
	var that = new SYM.Multiplication({
		left: left,
		right: right
	});

	if (left instanceof SYM.Constant && right instanceof SYM.Constant) {
		var e = that.evaluate();
		if (e === Math.round(e)) {
			return new SYM.Constant({value: e});
		}	
	}

	// console.log("left: " + left);
	// console.log("right: " + right);
	if (left instanceof SYM.Constant) {
		if (!left.value) {
			return left;
		} else if (left.value === 1) {
			return right;
		} 
	} else if (right instanceof SYM.Constant) {
		if (!right.value) {
			return right;
		} else if (right.value === 1) {

			return left;
		} 
	}
	return that;
};

SYM.Simplifier.prototype.visitDivision = function(node) {
	var left = node.left.simplify();
	var right = node.right.simplify();
	var that = new SYM.Division({
		left: left,
		right: right
	});

	if (left instanceof SYM.Constant && right instanceof SYM.Constant) {
		var e = that.evaluate();
		if (e === Math.round(e)) {
			return new SYM.Constant({value: e});
		}	
	}

	if (left instanceof SYM.Constant) {
		if (!left.value) {
			return new SYM.Constant({value: 0});
		}
	} else if (right instanceof SYM.Constant) {
		if (right.value === 1) {
			return left;
		} 
	}
	return that;

};

SYM.Simplifier.prototype.visitPower = function(node) {
	var left = node.left.simplify();
	var right = node.right.simplify();
	var that = new SYM.Power({
		left: left,
		right: right
	});

	if (left instanceof SYM.Constant && right instanceof SYM.Constant) {
		var e = that.evaluate();
		if (e === Math.round(e)) {
			return new SYM.Constant({value: e});
		}	
	}

	if (left instanceof SYM.Constant) {
		if (!left.value) {
			return new SYM.Constant({value: 0});
		}
	} else if (right instanceof SYM.Constant) {
		if (right.value === 1) {
			return left;
		} 
	}

	return that;
	
};

SYM.Simplifier.prototype.visitExp = function(node) {
	return node.clone();
};

SYM.Simplifier.prototype.visitLn = function(node) {
	return node.clone();
};

SYM.Simplifier.prototype.visitSin = function(node) {
	return node.clone();
};

SYM.Simplifier.prototype.visitCos = function(node) {
	return node.clone();
};

