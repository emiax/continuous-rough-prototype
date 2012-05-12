SYM.NodeVisitor = function() {};

SYM.NodeVisitor.prototype.visitNode = function(node) {
	throw new SYM.AbstractCallException();
};

SYM.NodeVisitor.prototype.visitConstant = function(node) {
	throw new SYM.AbstractCallException();
};

SYM.NodeVisitor.prototype.visitOperation = function(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.prototype.visitUnaryOperation = function(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.prototype.visitBinaryOperation = function(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.prototype.visitVariable = function(node) {
	throw new SYM.AbstractCallException();
};

SYM.NodeVisitor.prototype.visitAddition = function(node) {
	return this.visitBinaryOperation(node);
};

SYM.NodeVisitor.prototype.visitSubstraction = function(node) {
	return this.visitBinaryOperation(node);
};

SYM.NodeVisitor.prototype.visitMultiplication = function(node) {
	return this.visitBinaryOperation(node);	
};

SYM.NodeVisitor.prototype.visitDivision = function(node) {
	return this.visitBinaryOperation(node);	
};

SYM.NodeVisitor.prototype.visitPower = function(node) {
	return this.visitBinaryOperation(node);
};

SYM.NodeVisitor.prototype.visitExp = function(node) {
	return this.visitUnaryOperation(node);	
};

SYM.NodeVisitor.prototype.visitLn = function(node) {
	return this.visitUnaryOperation(node);
};

SYM.NodeVisitor.prototype.visitSin = function(node) {
	return this.visitUnaryOperation(node);	
};

SYM.NodeVisitor.prototype.visitCos = function(node) {
	return this.visitUnaryOperation(node);
};
