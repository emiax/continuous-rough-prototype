CALC.mouseHandler = function() {

	var that = {};
	var hold = false,
		drag = false,
		stategy;
	
	that.mouseDown = function(mouseStrategy, event) {
		strategy = mouseStrategy;
		hold = true;
		strategy.mouseDown(event);
	}

	that.mouseUp = function(mouseStrategy, event) {
		if (!drag)
			strategy.click(event);
		hold = drag = false;
		strategy.mouseUp(event);
	}

	that.mouseMove = function(mouseStrategy, event) {
		drag = hold;
		if (drag)
			strategy.drag(event);
		else
			strategy = mouseStrategy;
		strategy.mouseMove(event);
	}

	return that;

}();