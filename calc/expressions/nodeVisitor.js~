CALC.NodeVisitor = function() {};

CALC.NodeVisitor.prototype.visitNode = function(node) {
	throw new CALC.AbstractCallException();
};

CALC.NodeVisitor.prototype.visitConstant = function(node) {
	throw new CALC.AbstractCallException();
};

CALC.NodeVisitor.prototype.visitOperation = function(node) {
	throw new CALC.AbstractCallException();	
};

CALC.NodeVisitor.prototype.visitUnaryOperation = function(node) {
	throw new CALC.AbstractCallException();	
};

CALC.NodeVisitor.prototype.visitBinaryOperation = function(node) {
	throw new CALC.AbstractCallException();	
};

CALC.NodeVisitor.prototype.visitVariable = function(node) {
	throw new CALC.AbstractCallException();
};

CALC.NodeVisitor.prototype.visitAddition = function(node) {
	return this.visitBinaryOperation(node);
};

CALC.NodeVisitor.prototype.visitSubtraction = function(node) {
	return this.visitBinaryOperation(node);
};

CALC.NodeVisitor.prototype.visitMultiplication = function(node) {
	return this.visitBinaryOperation(node);	
};

CALC.NodeVisitor.prototype.visitDivision = function(node) {
	return this.visitBinaryOperation(node);	
};

CALC.NodeVisitor.prototype.visitPower = function(node) {
	return this.visitBinaryOperation(node);
};

CALC.NodeVisitor.prototype.visitExp = function(node) {
	return this.visitUnaryOperation(node);	
};

CALC.NodeVisitor.prototype.visitLn = function(node) {
	return this.visitUnaryOperation(node);
};

CALC.NodeVisitor.prototype.visitSin = function(node) {
	return this.visitUnaryOperation(node);	
};

CALC.NodeVisitor.prototype.visitCos = function(node) {
	return this.visitUnaryOperation(node);
};
