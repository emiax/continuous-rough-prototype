Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
};

Object.method('super', function(f, args) {
	return this.parent[f].apply(this, args);
});

Function.method('inherits', function(Parent) {
	this.prototype = new Parent();
	this.prototype.constructor = this;
	this.prototype.parent = Parent.prototype;
	return this;
});


var SYM = {
	MAX_DECIMALS: 10,
	isRational: function(v) { return (!(v*Math.pow(10, SYM.MAX_DECIMALS) % 1)) }
};

//to do super constructor? (...not really sure)
//this.parent.constructor.apply(this, [spec]);


// General Node

SYM.Node = function() {}.
method('clone', function() {
	return this.constructor();
}).method('simplify', function() {
	return this.clone();
});


// Basic Node types

SYM.Operation = function() {}.inherits(SYM.Node);

SYM.Constant = function() {}.inherits(SYM.Node);

SYM.Variable = function() {}.inherits(SYM.Node);

// Binary operation

SYM.BinaryOperation = function(spec) {
	spec = spec || {};
	this.left = spec.left || null;
	this.right = spec.right || null;
}.
inherits(SYM.Operation).
method('clone', function() {
	return new this.constructor({
		left: this.left.clone(),
		right: this.right.clone()
	});
}).
method('simplify', function() {
	var that = new this.constructor({
		left: this.left.simplify(),
		right: this.right.simplify()
	});
	if (that.left instanceof SYM.Constant && that.right instanceof SYM.Constant) {
		var v = SYM.evaluate(that);
		if (SYM.isRational(v)) {
			return new SYM.Constant({value: v});
		} else return that;
	} else return that;
}).
method('evaluate', function(a, b) {
	throw {
		"name": "AbstractCall",
		"message": "Evaluation is not defined for this operation."
	}
});


// Unary operation

SYM.UnaryOperation = function(spec) {
	spec = spec || {};
	this.arg = spec.arg;
}.
inherits(SYM.Operation).
method('clone', function() {
	return new this.constructor({
		arg: this.arg.clone()
	})
}).
method('simplify', function() {
	var that = new this.constructor({
		arg: this.arg.simplify()
	})
	if (that.arg instanceof SYM.Constant) {
		var v = SYM.evaluate(that);
		if (SYM.isRational(v)) {
			return new SYM.Constant({value: v});
		} else return that;
	} else return that;
}).
method('evaluate', function(a, b) {
	throw {
		"name": "AbstractCall",
		"message": "Evaluation is not defined for this operation."
	}
});


SYM.Power = function(spec) {
	spec = spec || {};
	this.left = spec.left || new SYM.Constant({value: 0});
	this.right = spec.right || new SYM.Constant({value: 1});
}.
inherits(SYM.BinaryOperation).
method('toString', function() {
	return '(' + this.left.toString() + ' ^ ' + this.right.toString() + ')';
}).
method('evaluate', function(a, b) {
	return Math.pow(a, b);
}).
method('simplify', function() {
	var that = this.super('simplify');
	if (that instanceof SYM.Power) {
		if (that.right instanceof SYM.Constant) {
			if (that.right.value === 1) {
				return that.left.clone();
			} else if (!that.right.value) {
				return new SYM.Constant({value: 1});
			} else return that.clone();
		}
	} else return that.simplify();
});



SYM.Multiplication = function(spec) {
	spec = spec || {};
	this.left = spec.left || new SYM.Constant({value: 1});
	this.right = spec.right || new SYM.Constant({value: 1});
}.
inherits(SYM.BinaryOperation).
method('toString', function() {
	return '(' + this.left.toString() + ' * ' + this.right.toString() + ')';
}).
method('evaluate', function(a, b) {
	return a*b;
}).
method('simplify', function() {
	var that = this.super('simplify');
	if (that instanceof SYM.Multiplication) {
		if (that.left instanceof SYM.Constant) {
			if (!that.left.value)
				return that.left.clone();
			else if (that.left.value === 1) {
				return that.right.clone();
			}
		} else if (that.right instanceof SYM.Constant) {
			if (!that.right.value)
				return that.right.clone();
			else if (that.right.value === 1) {
				return that.left.clone();
			}
		} else return that;
	} else return that.simplify();
});


SYM.Division = function(spec) {
	spec = spec || {};
	this.left = spec.left || new SYM.Constant({value: 0});
	this.right = spec.right || new SYM.Constant({value: 1});
}.
inherits(SYM.BinaryOperation).
method('toString', function() {
	return '(' + this.left.toString() + ' / ' + this.right.toString() + ')';
}).
method('evaluate', function(a, b) {
	return a/b;
}).
method('simplify', function() {
	var that = this.super('simplify');
	if (that instanceof SYM.Division) {
		if (that.left instanceof SYM.Constant) {
			if (!that.left.value)
				return that.left.clone();
		} else if (that.right instanceof SYM.Constant) {
			var inverse = 1/that.right.value;
			if (SYM.isRational(inverse)) {
				return new SYM.Multiplication({
					left: SYM.Constant({value: inverse}),
					right: that.left.clone()
				});
			}
		} else return that;
	} else return that.simplify();
});



SYM.Addition = function(spec) {
	spec = spec || {};
	this.left = spec.left || new SYM.Constant({value: 0});
	this.right = spec.right || new SYM.Constant({value: 0});
}.
inherits(SYM.BinaryOperation).
method('toString', function() {
	return '(' + this.left.toString() + ' + ' + this.right.toString() + ')';
}).
method('evaluate', function(a, b) {
	return a + b;
}).
method('simplify', function() {
	var that = this.super('simplify');
	if (that instanceof SYM.Addition) {
		if (that.left instanceof SYM.Constant && !that.left.value) {
			return that.right.clone();
		} else if (that.right instanceof SYM.Constant && !that.right.value) {
			return that.left.clone();
		} else return that.clone();
	} else return that.simplify();
});







SYM.Subtraction = function(spec) {
	spec = spec || {};
	this.left = spec.left || new SYM.Constant({value: 0});
	this.right = spec.right || new SYM.Constant({value: 0});
}.
inherits(SYM.BinaryOperation).
method('toString', function() {
	return '(' + this.left.toString() + ' - ' + this.right.toString() + ')';
}).
method('evaluate', function(a, b) {
	return a - b;
}).
method('simplify', function() {
	var that = this.super('simplify');
	if (that instanceof SYM.Subtraction) {
		if (that.left instanceof SYM.Constant && !that.left.value) {
			return new SYM.Constant({value: that.right.value});
		} else if (that.right instanceof SYM.Constant && !that.right.value) {
			return that.left.clone();
		} else return that.clone();
	} else return that.simplify();
});


SYM.Constant = function(spec) {
	spec = spec || {};
	this.value = spec.value || 0;
}.inherits(SYM.Node).method('toString', function() {
	return this.value;
}).method('clone', function() {
	return new this.constructor({
		value: this.value
	});
});

SYM.Variable = function(spec) {
	spec = spec || {};
	this.symbol = spec.symbol || 'x';
}.inherits(SYM.Node).method('toString', function() {
	return this.symbol;
}).method('clone', function() {
	return new this.constructor({
		symbol: this.symbol
	});
});



SYM.evaluate = function(node, variables) {
	variables = variables || [];
	if (node instanceof SYM.BinaryOperation) {
		var a = SYM.evaluate(node.left, variables),
			b = SYM.evaluate(node.right, variables);
		return node.evaluate(a, b);	
	} else if (node instanceof SYM.UnaryOperation) {
		var a = SYM.evaluate(node.arg, variables);
		return node.evaluate(a);
	} else if (node instanceof SYM.Variable) {
		if (typeof variables[node.symbol] === 'number') {
			return variables[node.symbol];
		} else throw {
			name: 'Missing variable',
			message: 'Cannot create evaluate expresison. ' + node.symbol + ' is ' + variables[node.symbol] + '.'
		}
	} else if (node instanceof SYM.Constant) {
		return node.value;
	}
}






