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

SYM.NodeVisitor.prototype.visitVariable = function(node) {
	throw new SYM.AbstractCallException();
};

SYM.NodeVisitor.prototype.visitAddition = function(node) {
	throw new SYM.AbstractCallException();
};

SYM.NodeVisitor.prototype.visitSubstraction = function(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.prototype.visitMultiplication = function(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.prototype.visitDivision = function(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.prototype.visitPower = function(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.prototype.visitExp = function(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.prototype.visitSin = function(node) {
	throw new SYM.AbstractCallException();	
};

SYM.NodeVisitor.prototype.visitCos = function(node) {
	throw new SYM.AbstractCallException();	
};
