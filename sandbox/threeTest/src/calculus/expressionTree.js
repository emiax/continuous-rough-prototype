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


var CALC = function() {
	var that = {};
	return that;
}();

// General Node

CALC.Node = function() {};

CALC.Node.prototype = {
	constructor: CALC.Node,
	clone: function() {
		return this.constructor();
	},
	accept: function(visitor) {
		return visitor.visitNode();
	}
};

// Basic Node types

CALC.Operation = function() {}.inheritsFrom(CALC.Node);

// Constant

CALC.Constant = function(parameters) {
	parameters = parameters || {};
	this.value = parameters.value || 0;
}.inheritsFrom(CALC.Node);

CALC.Constant.prototype.accept = function(visitor) {
	return visitor.visitConstant(this);
}

CALC.Constant.prototype.toString = function() {
	return this.value;
};

CALC.Constant.prototype.clone = function() {
	return new this.constructor({
		value: this.value
	});j
};


// Variable

CALC.Variable = function(parameters) {
	parameters = parameters || {};
	this.symbol = parameters.symbol || 'x';
}.inheritsFrom(CALC.Node);

CALC.Variable.prototype.accept = function(visitor) {
	return visitor.visitVariable(this);
};

CALC.Variable.prototype.toString = function() {
	return this.symbol;
};

CALC.Variable.prototype.clone = function() {
	return new this.constructor({
		symbol: this.symbol
	});
};



// Binary operation

CALC.BinaryOperation = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || null;
	this.right = parameters.right || null;
}.inheritsFrom(CALC.Operation);

CALC.BinaryOperation.prototype.accept = function(visitor) {
	return visitor.visitBinaryOperation(this);
}

CALC.BinaryOperation.prototype.clone = function() {
	return new this.constructor({
		left: this.left.clone(),
		right: this.right.clone()
	});
};

// Unary operation

CALC.UnaryOperation = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg;
}.inheritsFrom(CALC.Operation);


CALC.UnaryOperation.prototype.clone = function() {
	return new this.constructor({
		arg: this.arg.clone()
	});
};


// Power

CALC.Power = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || new CALC.Constant({value: 0});
	this.right = parameters.right || new CALC.Constant({value: 1});
}.inheritsFrom(CALC.BinaryOperation);

CALC.Power.prototype.accept = function(visitor) {
	return visitor.visitPower(this);
}

CALC.Power.prototype.toString = function() {
	return '(' + this.left.toString() + ' ^ ' + this.right.toString() + ')';
};

// Multiplication

CALC.Multiplication = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || new CALC.Constant({value: 1});
	this.right = parameters.right || new CALC.Constant({value: 1});
}.inheritsFrom(CALC.BinaryOperation);

CALC.Multiplication.prototype.accept = function(visitor) {
	return visitor.visitMultiplication(this);
};

CALC.Multiplication.prototype.toString = function() {
	return '(' + this.left.toString() + ' * ' + this.right.toString() + ')';
};


// Division


CALC.Division = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || new CALC.Constant({value: 0});
	this.right = parameters.right || new CALC.Constant({value: 1});
}.inheritsFrom(CALC.BinaryOperation);

CALC.Division.prototype.accept = function(visitor) {
	return visitor.visitDivision(this);
}

CALC.Division.prototype.toString = function() {
	return '(' + this.left.toString() + ' / ' + this.right.toString() + ')';
};

// Addition

CALC.Addition = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || new CALC.Constant({value: 0});
	this.right = parameters.right || new CALC.Constant({value: 0});
}.inheritsFrom(CALC.BinaryOperation);

CALC.Addition.prototype.accept = function(visitor) {
	return visitor.visitAddition(this);
}

CALC.Addition.prototype.toString = function() {
	return '(' + this.left.toString() + ' + ' + this.right.toString() + ')';
};

// Subtraction

CALC.Subtraction = function(parameters) {
	parameters = parameters || {};
	this.left = parameters.left || new CALC.Constant({value: 0});
	this.right = parameters.right || new CALC.Constant({value: 0});
}.inheritsFrom(CALC.BinaryOperation);

CALC.Subtraction.prototype.accept = function(visitor) {
	return visitor.visitSubtraction(this);
}

CALC.Subtraction.prototype.toString = function() {
	return '(' + this.left.toString() + ' - ' + this.right.toString() + ')';
};

// Natural Logarithm

CALC.Ln = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg || new CALC.Constant({value: 1});
}.inheritsFrom(CALC.UnaryOperation);


CALC.Ln.prototype.accept = function(visitor) {
	return visitor.visitLn(this);
}

CALC.Ln.prototype.toString = function() {
	return 'ln(' + this.arg.toString() + ')';
};

// Exponential function

CALC.Exp = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg || new CALC.Constant({value: 0});
}.inheritsFrom(CALC.UnaryOperation);


CALC.Exp.prototype.accept = function(visitor) {
	return visitor.visitExp(this);
}

CALC.Exp.prototype.toString = function() {
	return 'e^(' + this.arg.toString() + ')';
};


// Sine

CALC.Sin = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg || new CALC.Constant({value: 0});
}.inheritsFrom(CALC.UnaryOperation);


CALC.Sin.prototype.accept = function(visitor) {
	return visitor.visitSin(this);
}

CALC.Sin.prototype.toString = function() {
	return 'sin(' + this.arg.toString() + ')';
};


// Cosine

CALC.Cos = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg || new CALC.Constant({value: 0});
}.inheritsFrom(CALC.UnaryOperation);


CALC.Cos.prototype.accept = function(visitor) {
	return visitor.visitCos(this);
}

CALC.Cos.prototype.toString = function() {
	return 'cos(' + this.arg.toString() + ')';
};

/*

CALC.Function = function(parameters) {
	parameters = parameters || {};
	this.name = parameters.name || CALC.getAnonymousFunctionName();
	this.args = parameters.args || {};
}.inheritsFrom(CALC.Node);


CALC.Function.prototype.accept = function(visitor) {
	return visitor.visitFunction(this);
}

CALC.Ln.prototype.toString = function() {
	return this.name + '(' + this.arg.toString() + ')';
};

*/

