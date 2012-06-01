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
	},
	leave: function() {
		for (var i = 0; i < this.actions.length; i++) {
			this.actions[i].unperform();
		}	
	}
}



//VISUALIZATION ACTION - to be moved to a separate file.
CALC.VisualizationAction = function() {

}

CALC.VisualizationAction.prototype = {
	perform: function() {
		throw new CALC.AbstractCallException();
	},
	unperform: function() {
		throw new CALC.AbstractCallException();
	}
};




// ABSOLUTE ROTATION - to be moved to a separate file.
CALC.AbsoluteRotationAction = function(spec) {
	this.object = spec.object;
	this.x = spec.x;
	this.y = spec.y;
	this.z = spec.z;
	this.duration = spec.duration;
	this.delay = spec.delay;
	this.interpolation = spec.interpolation;

}

CALC.AbsoluteRotationAction.prototype = new CALC.VisualizationAction();
CALC.AbsoluteRotationAction.prototype.constructor = CALC.AbsoluteRotationAction;

CALC.AbsoluteRotationAction.prototype.perform = function() {
	CALC.rotate(this.object, {x: this.x, y: this.y, z: this.z}, {duration: this.duration, interpolation: this.interpolation});
}


CALC.AbsoluteRotationAction.prototype.unperform = function() {
	// do nothing!
}


//TextPanelAction - to be moved to a separate file.
CALC.TextPanelAction = function(spec) {
	this.panel = spec.panel;
	this.elem = spec.elem;
}
CALC.TextPanelAction.prototype = new CALC.VisualizationAction();
CALC.TextPanelAction.prototype.constructor = CALC.TextPanelAction;

CALC.TextPanelAction.prototype.perform = function() {
	//console.log("perform!");
	//this.elem.stop().hide();
	this.panel.append(this.elem);
	//this.elem.slideDown('slow');
}

CALC.TextPanelAction.prototype.unperform = function() {
	//console.log("unperform!");
	//this.elem.stop().slideUp('slow');
	this.elem.detach();
}

//FadeAction - to be moved to a separate file.
CALC.FadeAction = function(spec) {
	this.material = spec.material;
	this.opacity = spec.opacity;
	this.duration = spec.duration;
}
CALC.FadeAction.prototype = new CALC.VisualizationAction();
CALC.FadeAction.prototype.constructor = CALC.FadeAction;

CALC.FadeAction.prototype.perform = function() {
	CALC.fade(this.material, {opacity: this.opacity }, {duration: this.duration, interpolation: this.interpolation});
}

CALC.FadeAction.prototype.unperform = function() {
	//do nothing
}


//MaterialUniformAction - to be moved to a separate file.
CALC.MaterialUniformAction = function(spec) {
	this.material = spec.material;
	delete spec.material;
	this.duration = spec.duration;
	delete spec.duration;
	this.delay = spec.delay;
	delete spec.delay;
	this.interpolation = spec.interpolation;
	delete spec.interpolation;
	this.parameters = {};
	for (v in spec) {
		if (spec.hasOwnProperty(v)) {
			this.parameters[v] = spec[v];
		}
	}
}
CALC.MaterialUniformAction.prototype = new CALC.VisualizationAction();
CALC.MaterialUniformAction.prototype.constructor = CALC.MaterialUniformAction;

CALC.MaterialUniformAction.prototype.perform = function() {
	for (k in this.parameters) {
		CALC.animate(this.material.uniforms[k], {
			value: this.parameters[k],
		}, this.duration, this.interpolation, this.delay, null, null);
	}
}

CALC.MaterialUniformAction.prototype.unperform = function() {
	//do nothing
}

