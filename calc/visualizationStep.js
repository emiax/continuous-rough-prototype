CALC.VisualizationStep = function(title, actions) {
	this.title = title
	this.actions = actions;
}


CALC.VisualizationStep.prototype = {
	getTitle: function() {
		return this.title;
	},
	visit: function() {
		for (var i = 0; i < this.actions.length; i++) {
			this.actions[i].perform();
		}
	}
}



//VISUALIZATION ACTION - to be moved to a separate file.
CALC.VisualizationAction = function() {

}

CALC.VisualizationAction.prototype = {
	perform: function() {
		throw new CALC.AbstractCallException();
	}
};




// ABSOLUTE ROTATION - to be moved to a separate file.
CALC.AbsoluteRotationAction = function() {

}

CALC.AbsoluteRotationAction.prototype = new CALC.VisualizationAction();
CALC.AbsoluteRotationAction.prototype.constructor = CALC.AbsoluteRotationAction;

CALC.AbsoluteRotationAction.prototype.perform = function() {
	//this.
	//todo
}


//TextPanelAction - to be moved to a separate file.
CALC.TextPanelAction = function(spec) {
	this.panel = spec.panel;
	this.elem = spec.elem;
}
CALC.TextPanelAction.prototype = new CALC.VisualizationAction();
CALC.TextPanelAction.prototype.constructor = CALC.TextPanelAction;

CALC.TextPanelAction.prototype.perform = function() {
	console.log("appending to panel!");
	this.panel.append(this.elem);
}
