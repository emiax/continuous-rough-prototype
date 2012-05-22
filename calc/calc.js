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