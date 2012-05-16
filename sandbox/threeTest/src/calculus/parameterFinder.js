CALC.Node.prototype.findParameters = function(symbol) {
	return CALC.findParameters({node: this, symbol: symbol});
};


CALC.ParameterFinder = function(spec) {
	spec = spec || {};
	this.node = spec.node || null;
}.inheritsFrom(CALC.NodeVisitor);

CALC.findParameters = function(spec) {
	var f = new CALC.ParameterFinder(spec);
	return f.findParamters();
}

CALC.Differentiator.prototype.findParameters = function() {
	return this.node.accept(this);
}


CALC.Differentiator.prototype.visitConstant = function(node) {
	return [];
};

CALC.Differentiator.prototype.visitVariable = function(node) {
	return [node.symbol];
};

CALC.Differentiator.prototype.visitBinaryOperation = function(node) {
	var left = node.left.findParameters();
	var right = node.right.findParameters()

	var set = {} a = [], i = 0;
	for (i = 0; i < left.length; i++) {
		set[left[i]] = true;
	}
	for (i = 0; i < right.length; i++) {
		set[right[i]] = true;
	}
	for (i in set) {
		if (set.hasOwnProperty(i)) {
			a.push(i);
		}
	}
	return a;
};

CALC.Differentiator.prototype.visitUnaryOperation = function(node) {
	return node.arg.findParameters();
}