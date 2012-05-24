CALC.Node.prototype.replace = function(symbols) {
	return CALC.replace({node: this, symbols: symbols});
};


CALC.Replacer = function(spec) {
	spec = spec || {};
	this.node = spec.node || null;
	this.symbols = spec.symbols || {};

}.inheritsFrom(CALC.NodeVisitor);

CALC.replace = function(spec) {
	var d = new CALC.Replacer(spec);
	return d.replace();
}

CALC.Replacer.prototype.replace = function() {
	return this.node.accept(this);
}


CALC.Replacer.prototype.visitConstant = function(node) {
	return new CALC.Constant({value: 0});
};

CALC.Replacer.prototype.visitVariable = function(node) {
	for (s in this.symbols) {
		if (this.symbols.hasOwnProperty(s) && s === node.symbol) {
			if (typeof this.symbols[s] === 'number') {
				return new CALC.Constant({value: this.symbols[s]});
			} else if (typeof this.symbols[s] === 'string') {
				return new CALC.Variable({symbol: this.symbols[s]});
			} else throw new CALC.Exception("");
		}
	}
};

CALC.Replacer.prototype.visitUnaryOperation = function(node) {
	return new node.constructor({arg: node.arg.replace(this.symbols)});
};

CALC.Replacer.prototype.visitBinaryOperation = function(node) {
	return new node.constructor({left: node.left.replace(this.symbols), right: node.right.replace(this.symbols)});
};