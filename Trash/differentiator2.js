SYM.NodeVisitor = function() {};

SYM.NodeVisitor.visitNode(node) {
	throw new SYM.AbstractCallException();
};

SYM.NodeVisitor.visitConstant(node) {
	throw new SYM.AbstractCallException();
};

SYM.NodeVisitor.visitOperation(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.visitVariable(node) {
	throw new SYM.AbstractCallException();
};

SYM.NodeVisitor.visitAddition(node) {
	throw new SYM.AbstractCallException();
};

SYM.NodeVisitor.visitSubstraction(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.visitMultiplication(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.visitDivision(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.visitPower(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.visitExp(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.visitSin(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.visitCos(node) {
	throw new SYM.AbstractCallException();	
};







SYM.differentiate = function(spec) {
	console.log("test" + spec);
	//var d = new SYM.Differentiator(spec);
	//return d.differentiate();
}


SYM.Differentiator = function(spec) {
	console.log("foo");
	var node = spec.node || null;
	var symbol = spec.node || 'x';
}.method('differentiate', function() {
	var d = null;
	if (node instanceof SYM.Constant) {
		d = new SYM.ConstantDifferentiator(spec);
	} else if (node instanceof SYM.Operator) {
		d = new SYM.OperatorDifferentiator(spec);
	} else if (node instanceof SYM.Varibale) {
		d = new SYM.VariableDifferentiator(spec);
	}
	if (d) return d.differentiate();
});


SYM.ConstantDifferentiator = function(spec) {
	this.super('constructor', [spec]);
}.inherits(SYM.Differentiator).method('differentiate', function() {
	return new SYM.Constant({value: 0});
});

SYM.VariableDifferentiator = function(spec) {
	this.super('constructor', [spec]);
}.inherits(SYM.Differentiator).method('differentiate', function() {
	if (symbol == node.symbol) {
		return SYM.Constant({value: 1});
	} else {
		return new SYM.Constant({value: 0});
	}
});


SYM.OperatorDifferentiator = function(spec) {
	this.super('constructor', [spec]);
}.inherits(SYM.Differentiator).method('differentiate', function() {
	var d = null;
	if (node instanceof SYM.UnaryOperation) {
		d = new SYM.UnaryOperationDifferentiator(spec);
	} else if (node instanceof SYM.BinaryOperation) {
		d = new SYM.BinaryOperationDifferentiator(spec);
	}
	if (d) return d.differentiate();
});


SYM.BinaryOperationDifferentiator = function(spec) {
	this.super('constructor', [spec]);
}.inherits(SYM.Differentiator).method('differentiate', function() {
	var d;
	if (node instanceof SYM.Addition) {
		d = new SYM.AdditionDifferentiator(spec);
	} else if (node instanceof SYM.Subtraction) {
		d = new SYM.SubtractionDifferentiator(spec);
	} else if (node instanceof SYM.Multiplication) {
		d = new SYM.MultiplicationDifferentiator(spec);
	} else if (node instanceof SYM.Division) {
		d = new SYM.DivisionDifferentiator(spec);
	} else if (node instanceof SYM.Power) {
		d = new SYM.PowerDifferentiator(spec);
	}
	if (d) return d.differentiate();
});

SYM.UnaryOperationDifferentiator = function(spec) {
	this.super('constructor', spec);
}.inherits(SYM.Differentiator).method('differentiate', function() {
	var d;
	if (node instanceof SYM.Exp) {
		d = new SYM.ExpDifferentiator(spec);
	} else if (node instanceof SYM.Ln) {
		d = new SYM.LnDifferentiator(spec);
	} else if (node instanceof SYM.Cos) {
		d = new SYM.CosDifferentiator(spec);
	} else if (node instanceof SYM.Sin) {
		d = new SYM.SinDifferentiator(spec);
	}
	if (d) return new SYM.Multiplication({
		left: this.innerDerivative(),
		right: this.outerDerivative()
	});
}).method('innerDerivative', function() {
	return new SYM.Differentiator({node: node.arg, symbol: symbol}).differentiate();
}).method('outerDerivivative', function() {
	throw {
		"name": "AbstractCall",
		"message": "Evaluation is not defined for this operation."
	};
});

SYM.ExpDifferentiator = function(spec) {
	this.super('constructor', [spec]);
}.inherits(SYM.Differentiator).method('outerDerivative', function() {
	return node.clone();
});

SYM.LnDifferentiator = function(spec) {
	this.super('constructor', [spec]);
}.inherits(SYM.Differentiator).method('outerDerivative', function() {
	return SYM.Division({
		left: new SYM.Constant({value: 1}),
		right: node.clone()
	});
});

SYM.SinDifferentiator = function(spec) {
	this.super('constructor', [spec]);
}.inherits(SYM.Differentiator).method('outerDerivative', function() {
	return SYM.Cos({
		arg: node.arg
	});
});

SYM.CosDifferentiator = function(spec) {
	this.super('constructor', [spec]);
}.inherits(SYM.Differentiator).method('outerDerivative', function() {
	return SYM.Multiplication({
		left: SYM.Constant({value: -1}),
		right: SYM.Sin({
			arg: node.arg
		})
	});
});

