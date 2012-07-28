CALC.Node.prototype.evaluate = function(variables) {
	return CALC.evaluate({node: this, variables: variables});
}


CALC.Evaluator = function(spec) {
	spec = spec || {};
	this.node = spec.node || null;
	this.variables = spec.variables || {};
}.inheritsFrom(CALC.NodeVisitor);

CALC.evaluate = function(spec) {
	var d = new CALC.Evaluator(spec);
	return d.evaluate();
}

CALC.Evaluator.prototype.evaluate = function() {
	return this.node.accept(this);
}


CALC.Evaluator.prototype.visitConstant = function(node) {
	return node.value;
};

CALC.Evaluator.prototype.visitVariable = function(node) {
	if (typeof this.variables[node.symbol] === 'number') {
		return this.variables[node.symbol];
	} else {
		throw {
			name: 'Missing variable',
			message: 'Cannot evaluate expresison. ' + node.symbol + ' is ' + this.variables[node.symbol] + '.'
		}
	}
};

CALC.Evaluator.prototype.visitAddition = function(node) {
	return node.left.evaluate(this.variables) + node.right.evaluate(this.variables);
};

CALC.Evaluator.prototype.visitSubtraction = function(node) {
	return node.left.evaluate(this.variables) - node.right.evaluate(this.variables);
};

CALC.Evaluator.prototype.visitMultiplication = function(node) {
	return node.left.evaluate(this.variables) * node.right.evaluate(this.variables);
};

CALC.Evaluator.prototype.visitDivision = function(node) {
	return node.left.evaluate(this.variables) / node.right.evaluate(this.variables);
	//todo: throw exception on division by zero.
};

CALC.Evaluator.prototype.visitPower = function(node) {
	return Math.pow(node.left.evaluate(this.variables), node.right.evaluate(this.variables));
};

CALC.Evaluator.prototype.visitExp = function(node) {
	return Math.exp(node.arg.evaluate(this.variables));
};

CALC.Evaluator.prototype.visitLn = function(node) {
	return Math.log(node.arg.evaluate(this.variables));
};

CALC.Evaluator.prototype.visitSin = function(node) {
	return Math.sin(node.arg.evaluate(this.variables));
};

CALC.Evaluator.prototype.visitCos = function(node) {
	return Math.cos(node.arg.evaluate(this.variables));
};