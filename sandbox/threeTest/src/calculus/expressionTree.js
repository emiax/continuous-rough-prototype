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


var SYM = function() {
	var that = {};
	
	that.getAnynomousFunctionName = function() {
		return 'f'
	} // todo: return unique name!

	return that;
}();

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

// Unary operation

SYM.UnaryOperation = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg;
}.inheritsFrom(SYM.Operation);


SYM.UnaryOperation.prototype.clone = function() {
	return new this.constructor({
		arg: this.arg.clone()
	});
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

// Natural Logarithm

SYM.Ln = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg || new SYM.Constant({value: 1});
}.inheritsFrom(SYM.UnaryOperation);


SYM.Ln.prototype.accept = function(visitor) {
	return visitor.visitLn(this);
}

SYM.Ln.prototype.toString = function() {
	return 'ln(' + this.arg.toString() + ')';
};

// Exponential function

SYM.Exp = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg || new SYM.Constant({value: 0});
}.inheritsFrom(SYM.UnaryOperation);


SYM.Exp.prototype.accept = function(visitor) {
	return visitor.visitExp(this);
}

SYM.Exp.prototype.toString = function() {
	return 'e^(' + this.arg.toString() + ')';
};


// Sine

SYM.Sin = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg || new SYM.Constant({value: 0});
}.inheritsFrom(SYM.UnaryOperation);


SYM.Sin.prototype.accept = function(visitor) {
	return visitor.visitSin(this);
}

SYM.Sin.prototype.toString = function() {
	return 'sin(' + this.arg.toString() + ')';
};


// Cosine

SYM.Cos = function(parameters) {
	parameters = parameters || {};
	this.arg = parameters.arg || new SYM.Constant({value: 0});
}.inheritsFrom(SYM.UnaryOperation);


SYM.Cos.prototype.accept = function(visitor) {
	return visitor.visitCos(this);
}

SYM.Cos.prototype.toString = function() {
	return 'cos(' + this.arg.toString() + ')';
};

/*

SYM.Function = function(parameters) {
	parameters = parameters || {};
	this.name = parameters.name || SYM.getAnonymousFunctionName();
	this.args = parameters.args || {};
}.inheritsFrom(SYM.Node);


SYM.Function.prototype.accept = function(visitor) {
	return visitor.visitFunction(this);
}

SYM.Ln.prototype.toString = function() {
	return this.name + '(' + this.arg.toString() + ')';
};

*/

