CALC.InvalidArgumentException = function(message) {
	this.name = "Invalid argument";
	this.message = "Invalid argument: " + message;
}

CALC.NotImplementedYetException = function() {
	this.name = "Not implemented yet";
	this.message = "This feature it not yet implemented";
}