CALC.InvalidArgumentException = function(message) {
	this.name = "Invalid argument";
	this.message = "Invalid argument: " + message;
}

CALC.NotImplementedYetException = function() {
	this.name = "Not implemented yet";
	this.message = "This feature it not yet implemented";
}

CALC.AbstractCallException = function() {
	this.name = "Abstract method call";
	this.method = "The method is abstract";
};