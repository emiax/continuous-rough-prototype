CALC.Node.prototype.differentiate = function(CALCbol) {
		return CALC.differentiate({node: this, CALCbol: CALCbol});
};


CALC.Differentiator = function(spec) {
	spec = spec || {};
	this.node = spec.node || null;
	this.CALCbol = spec.CALCbol || 'x';

}.inheritsFrom(CALC.NodeVisitor);

CALC.differentiate = function(spec) {
	var d = new CALC.Differentiator(spec);
	return d.differentiate();
}

CALC.Differentiator.prototype.differentiate = function() {
	var derivative = this.node.accept(this).simplify();
	//console.log(derivative);
	var s = derivative.simplify();
	//console.log(s);
	return s;
}


CALC.Differentiator.prototype.visitConstant = function(node) {
	return new CALC.Constant({value: 0});
};

CALC.Differentiator.prototype.visitVariable = function(node) {
	if (node.CALCbol === this.CALCbol) {
		return new CALC.Constant({value: 1});
	} else {
		return new CALC.Constant({value: 0});
	}
};

CALC.Differentiator.prototype.visitAddition = function(node) {
	return new CALC.Addition({
		left: node.left.differentiate(this.CALCbol),
		right: node.right.differentiate(this.CALCbol)
	});
};

CALC.Differentiator.prototype.visitSubtraction = function(node) {
	return new CALC.Subtraction({
		left: node.left.differentiate(this.CALCbol),
		right: node.right.differentiate(this.CALCbol)
	});
};

CALC.Differentiator.prototype.visitMultiplication = function(node) {
	return new CALC.Addition({
		left: new CALC.Multiplication({
			left: node.left.differentiate(this.CALCbol),
			right: node.right.clone()
		}),
		right: new CALC.Multiplication({
			left: node.left.clone(),
			right: node.right.differentiate(this.CALCbol)
		})
	});	
};

CALC.Differentiator.prototype.visitDivision = function(node) {
	return new CALC.Division({
		left: new CALC.Subtraction({
			left: new CALC.Multiplication({
				left: node.left.differentiate(this.CALCbol),
				right: node.right.clone()
			}),
			right: new CALC.Multiplication({
				left: node.left.clone(),
				right: node.right.differentiate(this.CALCbol)
			})
		}),
		right: new CALC.Power({
			left: node.right.clone(),
			right: new CALC.Constant({value: 2})
		})
	});
};

CALC.Differentiator.prototype.visitPower = function(node) {
	return new CALC.Addition({
		left: new CALC.Multiplication({
			left: node.right.clone(),
			right: new CALC.Multiplication({
				left: new CALC.Power({
					left: node.left.clone(),
					right: new CALC.Subtraction({
						left: node.right.clone(),
						right: new CALC.Constant({value: 1})
					})
				}),
				right: node.left.differentiate(this.CALCbol)
			})
		}),
		right: new CALC.Multiplication({
			left: new CALC.Power({
				left: node.left.clone(),
				right: node.right.clone()
			}),
			right: new CALC.Multiplication({
				left: new CALC.Ln({
					arg: node.left.clone()
				}),
				right: node.right.differentiate(this.CALCbol)
			})
		})
	});
};

CALC.Differentiator.prototype.visitExp = function(node) {
	return new CALC.Multiplication({
		left: node.arg.differentiate(this.CALCbol),
		right: node.clone()
	});
};

CALC.Differentiator.prototype.visitLn = function(node) {
	return new CALC.Division({
		left: node.arg.differentiate(this.CALCbol),
		right: node.arg.clone()
	});
};

CALC.Differentiator.prototype.visitSin = function(node) {
	return new CALC.Multiplication({
		left: node.arg.differentiate(this.CALCbol),
		right: new CALC.Cos({arg: node.arg.clone()})
	});
};

CALC.Differentiator.prototype.visitCos = function(node) {
	return new CALC.Multiplication({
		left: node.arg.differentiate(this.CALCbol),
		right: new CALC.Multiplication({
			left: new CALC.Constant({value: -1}),
			right: new CALC.Sin({arg: node.arg.clone()})
		})
	});
};

/*
CALC.Differentiator.prototype.visitFunction = function(node) {
	
	return new CALC.Mutliplication({
		left: node.arg.differentiate(this.CALCbol),
		right: new CALC.Multiplication({
			left: new CALC.Constant({value: -1}),
			right: new CALC.Sin({arg: node.arg.clone()})
		})
	});
};*/


