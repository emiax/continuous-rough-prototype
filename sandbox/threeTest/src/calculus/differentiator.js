SYM.Node.prototype.differentiate = function(symbol) {
		return SYM.differentiate({node: this, symbol: symbol});
};


SYM.Differentiator = function(spec) {
	spec = spec || {};
	this.node = spec.node || null;
	this.symbol = spec.symbol || 'x';

}.inheritsFrom(SYM.NodeVisitor);

SYM.differentiate = function(spec) {
	var d = new SYM.Differentiator(spec);
	return d.differentiate();
}

SYM.Differentiator.prototype.differentiate = function() {
	var derivative = this.node.accept(this).simplify();
	//console.log(derivative);
	var s = derivative.simplify();
	//console.log(s);
	return s;
}


SYM.Differentiator.prototype.visitConstant = function(node) {
	return new SYM.Constant({value: 0});
};

SYM.Differentiator.prototype.visitVariable = function(node) {
	if (node.symbol === this.symbol) {
		return new SYM.Constant({value: 1});
	} else {
		return new SYM.Constant({value: 0});
	}
};

SYM.Differentiator.prototype.visitAddition = function(node) {
	return new SYM.Addition({
		left: node.left.differentiate(this.symbol),
		right: node.right.differentiate(this.symbol)
	});
};

SYM.Differentiator.prototype.visitSubtraction = function(node) {
	return new SYM.Subtraction({
		left: node.left.differentiate(this.symbol),
		right: node.right.differentiate(this.symbol)
	});
};

SYM.Differentiator.prototype.visitMultiplication = function(node) {
	return new SYM.Addition({
		left: new SYM.Multiplication({
			left: node.left.differentiate(this.symbol),
			right: node.right.clone()
		}),
		right: new SYM.Multiplication({
			left: node.left.clone(),
			right: node.right.differentiate(this.symbol)
		})
	});	
};

SYM.Differentiator.prototype.visitDivision = function(node) {
	return new SYM.Division({
		left: new SYM.Subtraction({
			left: new SYM.Multiplication({
				left: node.left.differentiate(this.symbol),
				right: node.right.clone()
			}),
			right: new SYM.Multiplication({
				left: node.left.clone(),
				right: node.right.differentiate(this.symbol)
			})
		}),
		right: new SYM.Power({
			left: node.right.clone(),
			right: new SYM.Constant({value: 2})
		})
	});
};

SYM.Differentiator.prototype.visitPower = function(node) {
	return new SYM.Addition({
		left: new SYM.Multiplication({
			left: node.right.clone(),
			right: new SYM.Multiplication({
				left: new SYM.Power({
					left: node.left.clone(),
					right: new SYM.Subtraction({
						left: node.right.clone(),
						right: new SYM.Constant({value: 1})
					})
				}),
				right: node.left.differentiate(this.symbol)
			})
		}),
		right: new SYM.Multiplication({
			left: new SYM.Power({
				left: node.left.clone(),
				right: node.right.clone()
			}),
			right: new SYM.Multiplication({
				left: new SYM.Ln({
					arg: node.left.clone()
				}),
				right: node.right.differentiate(this.symbol)
			})
		})
	});
};

SYM.Differentiator.prototype.visitExp = function(node) {
	return new SYM.Multiplication({
		left: node.arg.differentiate(this.symbol),
		right: node.clone()
	});
};

SYM.Differentiator.prototype.visitLn = function(node) {
	return new SYM.Division({
		left: node.arg.differentiate(this.symbol),
		right: node.arg.clone()
	});
};

SYM.Differentiator.prototype.visitSin = function(node) {
	return new SYM.Multiplication({
		left: node.arg.differentiate(this.symbol),
		right: new SYM.Cos({arg: node.arg.clone()})
	});
};

SYM.Differentiator.prototype.visitCos = function(node) {
	return new SYM.Multiplication({
		left: node.arg.differentiate(this.symbol),
		right: new SYM.Multiplication({
			left: new SYM.Constant({value: -1}),
			right: new SYM.Sin({arg: node.arg.clone()})
		})
	});
};

/*
SYM.Differentiator.prototype.visitFunction = function(node) {
	
	return new SYM.Mutliplication({
		left: node.arg.differentiate(this.symbol),
		right: new SYM.Multiplication({
			left: new SYM.Constant({value: -1}),
			right: new SYM.Sin({arg: node.arg.clone()})
		})
	});
};*/


