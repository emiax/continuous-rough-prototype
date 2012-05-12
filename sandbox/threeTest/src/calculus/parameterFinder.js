SYM.Node.prototype.findParameters = function(symbol) {
	return SYM.findParameters({node: this, symbol: symbol});
};


SYM.ParameterFinder = function(spec) {
	spec = spec || {};
	this.node = spec.node || null;
}.inheritsFrom(SYM.NodeVisitor);

SYM.findParameters = function(spec) {
	var f = new SYM.ParameterFinder(spec);
	return f.findParamters();
}

SYM.Differentiator.prototype.findParameters = function() {
	return this.node.accept(this);
}


SYM.Differentiator.prototype.visitConstant = function(node) {
	return [];
};

SYM.Differentiator.prototype.visitVariable = function(node) {
	return [node.symbol];
};

SYM.Differentiator.prototype.visitBinaryOperation = function(node) {
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

SYM.Differentiator.prototype.visitUnaryOperation = function(node) {
	return node.arg.findParameters();
}