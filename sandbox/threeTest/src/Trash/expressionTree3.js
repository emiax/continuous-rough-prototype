Function.prototype.method = function(name, func) {
	this.prototype[name] = func;
	return this;
};

Function.method('inheritsFrom', function(Parent) {
	this.prototype = new Parent();
	this.prototype.constructor = this;
	this.prototype.super = Parent.prototype;
	return this;
});


var SYM = {
	MAX_DECIMALS: 10,
	isRational: function(v) { return (!(v*Math.pow(10, SYM.MAX_DECIMALS) % 1)) }
};


// General Node

SYM.Node = function() {};

SYM.Node.prototype = {
	constructor: SYM.Node,
	clone: function() {
		return this.constructor();
	},
	accept: function(visitor) {
		return visitor.visitNode();
	}
};

// Basic Node types

SYM.Operation = function() {}.inheritsFrom(SYM.Node);

// Constant

SYM.Constant = function(parameters) {
	parameters = parameters || {};
	this.value = parameters.value || 0;
}.inheritsFrom(SYM.Node);

SYM.Constant.prototype.accept = function(visitor) {
	return visitor.visitConstant(this);
}

SYM.Constant.prototype.toString = function() {
	return this.value;
};

SYM.Constant.prototype.clone = function() {
	return new this.constructor({
		value: this.value
	});j
};


// Variable

SYM.Variable = function(parameters) {
	parameters = parameters || {};
	this.symbol = parameters.symbol || 'x';
}.inheritsFrom(SYM.Node);

SYM.Variable.prototype.accept = function(visitor) {
	return visitor.visitVariable(this);
};

SYM.Variable.prototype.toString = function() {
	return this.symbol;
};

SYM.Variable.prototype.clone = function() {
	return new this.constructor({
		symbol: this.symbol
	});
};



// Binary operation

SYM.BinaryOperation = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || null;
	this.right = parameters.right || null;
}.inheritsFrom(SYM.Operation);

SYM.BinaryOperation.prototype.accept = function(visitor) {
	return visitor.visitBinaryOperation(this);
}

SYM.BinaryOperation.prototype.clone = function() {
	return new this.constructor({
		left: this.left.clone(),
		right: this.right.clone()
	});
};

SYM.BinaryOperation.prototype.simplify = function() {
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
};


// Unary operation

SYM.UnaryOperation = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg;
}.inheritsFrom(SYM.Operation);


SYM.UnaryOperation.prototype.accept = function(visitor) {
	return visitor.visitUnaryOperation(this);
}

SYM.UnaryOperation.prototype.clone = function() {
	return new this.constructor({
		arg: this.arg.clone()
	});
};

SYM.UnaryOperation.prototype.simplify = function() {
	var that = new this.constructor({
		arg: this.arg.simplify()
	})
	if (that.arg instanceof SYM.Constant) {
		var v = SYM.evaluate(that);
		if (SYM.isRational(v)) {
			return new SYM.Constant({value: v});
		} else return that;
	} else return that;
};

// Power

SYM.Power = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || new SYM.Constant({value: 0});
	this.right = parameters.right || new SYM.Constant({value: 1});
}.inheritsFrom(SYM.BinaryOperation);

SYM.Power.prototype.accept = function(visitor) {
	return visitor.visitPower(this);
}

SYM.Power.prototype.toString = function() {
	return '(' + this.left.toString() + ' ^ ' + this.right.toString() + ')';
};

SYM.Power.prototype.simplify = function() {
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
};

// Multiplication

SYM.Multiplication = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || new SYM.Constant({value: 1});
	this.right = parameters.right || new SYM.Constant({value: 1});
}.inheritsFrom(SYM.BinaryOperation);

SYM.Multiplication.prototype.accept = function(visitor) {
	return visitor.visitMultiplication(this);
};

SYM.Multiplication.prototype.toString = function() {
	return '(' + this.left.toString() + ' * ' + this.right.toString() + ')';
};


SYM.Multiplication.prototype.simplify = function() {
	var that = this.super.simplify.apply(this);
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
};

// Division


SYM.Division = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || new SYM.Constant({value: 0});
	this.right = parameters.right || new SYM.Constant({value: 1});
}.inheritsFrom(SYM.BinaryOperation);

SYM.Division.prototype.accept = function(visitor) {
	return visitor.visitDivision(this);
}

SYM.Division.prototype.toString = function() {
	return '(' + this.left.toString() + ' / ' + this.right.toString() + ')';
};


SYM.Division.prototype.simplify = function() {
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
};

// Addition

SYM.Addition = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || new SYM.Constant({value: 0});
	this.right = parameters.right || new SYM.Constant({value: 0});
}.inheritsFrom(SYM.BinaryOperation);

SYM.Addition.prototype.accept = function(visitor) {
	return visitor.visitAddition(this);
}

SYM.Addition.prototype.toString = function() {
	return '(' + this.left.toString() + ' + ' + this.right.toString() + ')';
};


SYM.Addition.prototype.simplify = function() {
	var that = this.super.simplify.apply(this);
	if (that instanceof SYM.Addition) {
		if (that.left instanceof SYM.Constant && !that.left.value) {
			return that.right.clone();
		} else if (that.right instanceof SYM.Constant && !that.right.value) {
			return that.left.clone();
		} else return that.clone();
	} else return that.simplify();
};


// Subtraction

SYM.Subtraction = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || new SYM.Constant({value: 0});
	this.right = parameters.right || new SYM.Constant({value: 0});
}.inheritsFrom(SYM.BinaryOperation);

SYM.Subtraction.prototype.accept = function(visitor) {
	return visitor.visitSubtraction(this);
}

SYM.Subtraction.prototype.toString = function() {
	return '(' + this.left.toString() + ' - ' + this.right.toString() + ')';
};


SYM.Subtraction.prototype.simplify = function() {
	var that = this.super('simplify');
	if (that instanceof SYM.Subtraction) {
		if (that.left instanceof SYM.Constant && !that.left.value) {
			return new SYM.Constant({value: that.right.value});
		} else if (that.right instanceof SYM.Constant && !that.right.value) {
			return that.left.clone();
		} else return that.clone();
	} else return that.simplify();
};

// Natural Logarithm

SYM.Ln = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg || new SYM.Constant({value: 1});
}.inheritsFrom(SYM.UnaryOperation);


SYM.Ln.prototype.accept = function(visitor) {
	return visitor.visitLn(this);
}

