SYM.Node.prototype.evaluate = function(variables) {
	return SYM.evaluate({node: this, variables: variables});
}


SYM.Evaluator = function(spec) {
	spec = spec || {};
	this.node = spec.node || null;
	this.variables = spec.variables || {};
}.inheritsFrom(SYM.NodeVisitor);

SYM.evaluate = function(spec) {
	var d = new SYM.Evaluator(spec);
	return d.evaluate();
}

SYM.Evaluator.prototype.evaluate = function() {
	return this.node.accept(this);
}


SYM.Evaluator.prototype.visitConstant = function(node) {
	return node.value;
};

SYM.Evaluator.prototype.visitVariable = function(node) {
	if (typeof this.variables[node.symbol] === 'number') {
		return this.variables[node.symbol];
	} else {
		throw {
			name: 'Missing variable',
			message: 'Cannot evaluate expresison. ' + node.symbol + ' is ' + this.variables[node.symbol] + '.'
		}
	}
};

SYM.Evaluator.prototype.visitAddition = function(node) {
	return node.left.evaluate(this.variables) + node.right.evaluate(this.variables);
};

SYM.Evaluator.prototype.visitSubtraction = function(node) {
	return node.left.evaluate(this.variables) - node.right.evaluate(this.variables);
};

SYM.Evaluator.prototype.visitMultiplication = function(node) {
	return node.left.evaluate(this.variables) * node.right.evaluate(this.variables);
};

SYM.Evaluator.prototype.visitDivision = function(node) {
	return node.left.evaluate(this.variables) / node.right.evaluate(this.variables);
	//todo: throw exception on division by zero.
};

SYM.Evaluator.prototype.visitPower = function(node) {
	return Math.pow(node.left.evaluate(this.variables), node.right.evaluate(this.variables));
};

SYM.Evaluator.prototype.visitExp = function(node) {
	return Math.exp(node.arg.evaluate(this.variables));
};

SYM.Evaluator.prototype.visitLn = function(node) {
	return Math.log(node.arg.evaluate(this.variables));
};

SYM.Evaluator.prototype.visitSin = function(node) {
	return Math.sin(node.arg.evaluate(this.variables));
};

SYM.Evaluator.prototype.visitCos = function(node) {
	return Math.cos(node.arg.evaluate(this.variables));
};