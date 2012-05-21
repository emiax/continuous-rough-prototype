CALC.Node.prototype.mathML = function (symbol) {
	return CALC.mathML({node: this});
};

CALC.Node.prototype.mathMLElement = function (symbol) {
	// requires jQuery to work
	return $('<math>' + CALC.mathML({node: this}) + '</math>');
};


CALC.MathMLFormatter = function (spec) {
	spec = spec || {};
	this.node = spec.node || null;

};



CALC.MathMLFormatter.inheritsFrom(CALC.NodeVisitor);

CALC.mathML = function (spec) {
	var d = new CALC.MathMLFormatter(spec);
	return d.format();
};

CALC.MathMLFormatter.prototype.format = function () {
	return this.node.accept(this);
};

CALC.MathMLFormatter.prototype.visitConstant = function (node) {
	return '<mn>' + node.value + '</mn>';
};

CALC.MathMLFormatter.prototype.visitVariable = function (node) {
	return '<mi>' + node.symbol + '</mi>';
};

CALC.MathMLFormatter.prototype.visitAddition = function (node) {
	return node.left.mathML() + '<mo>+</mo>' + node.right.mathML();
};

CALC.MathMLFormatter.prototype.visitSubtraction = function (node) {
	return node.left.mathML() + '<mo>-</mo>' + node.right.mathML();
};

CALC.MathMLFormatter.prototype.visitMultiplication = function (node) {
	var left = node.left.mathML();
	var right = node.right.mathML();
	
	var p = false;
	if (left instanceof CALC.Addition || left instanceof CALC.Subtraction) {
		left = this.parenthesize(left);
		p = true;
	}
	if (right instanceof CALC.Addition || right instanceof CALC.Subtraction) {
		right = this.parenthesize(right);
		p = true;
	}
	if (p)
		return node.left.mathML() + '<mo>&InvisibleTimes;' + node.right.mathML();
	else
		return node.left.mathML() + '<mo>&times;</mo>' + node.right.mathML();

};

CALC.MathMLFormatter.prototype.visitDivision = function (node) {
	return '<mfrac><mrow>' + node.left.mathML() + '</mrow><mrow>' + node.right.mathML() + '</mfrac>';
};

CALC.MathMLFormatter.prototype.visitPower = function (node) {
	return '<msup>' + node.left.mathML() + node.right.mathML() + '</msup>';
};

CALC.MathMLFormatter.prototype.visitExp = function (node) {
	return '<msup><mi>e</mi>' + node.right.mathML() + '</msup>';
};

CALC.MathMLFormatter.prototype.visitLn = function (node) {
	return '<mi>ln</mi>' + this.parenthesize(node.arg.mathML());
};

CALC.MathMLFormatter.prototype.visitSin = function (node) {
	return '<mi>sin</mi>' + this.parenthesize(node.arg.mathML());
};

CALC.MathMLFormatter.prototype.visitCos = function (node) {
	return '<mi>cos</mi>' + this.parenthesize(node.arg.mathML());
};

CALC.MathMLFormatter.prototype.parenthesize = function(s) {
	return '<mo>(</mo>' + s + '<mo>)</mo>';	

}

