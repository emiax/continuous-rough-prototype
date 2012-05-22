CALC.visualizations = {};

CALC.visualizations.Visualization = function() {
	
	this.renderers = {};
	this.scenes = {};
	this.renderers = {};
	this.cameras = {};
	this.application = null;
	this.steps = [];

};

CALC.visualizations.Visualization.prototype = {};



CALC.visualizations.Visualization.prototype.render = function() {
	var renderer;

	for(r in this.renderers) {
		if (this.renderers.hasOwnProperty(r)) {
			renderer = this.renderers[r];
			if (renderer.scene && renderer.camera) {	
				renderer.render(renderer.scene, renderer.camera);
			}
		}
	}
}


CALC.visualizations.Visualization.prototype.attachRenderer = function($elem, renderer, scene, camera) {
	renderer.setSize($elem.innerWidth(), $elem.innerHeight());
	// Augment renderer object with scene and camera, to simplify rendereing process
	renderer.camera = camera;
	renderer.scene = scene;
	$elem.append(renderer.domElement);
	return renderer;
}

CALC.visualizations.Visualization.prototype.updateRenderers = function() {
	var $panel, w, h, renderer;
	for (r in this.renderers) {
		renderer = this.renderers[r];
		$panel = $(renderer.domElement).parent();
		w = $panel.innerWidth();
		h = $panel.innerHeight();
		if (w && h) {
			renderer.setSize(w, h);
			renderer.camera.aspect = w/h;
			renderer.camera.updateProjectionMatrix();
		} else {
			renderer.setSize(0, 0);
		}
	}
};	


CALC.visualizations.Visualization.prototype.appendTextBox = function($panel, content) {
	var $box = $('<div class="text-box"></div>');
	$box.html(content);
	$box.hide();
	$panel.append($box);
	$box.slideDown('slow');
};


CALC.visualizations.Visualization.prototype.appendPanel = function($panel, $content) {
	// todo: do something to preserve state somewhere..
	$panel.append($content);
};

CALC.visualizations.Visualization.prototype.clearPanel = function($panel, $content) {
	// todo: do something to preserve state somewhere..
	$panel.html($content);
}




/*
CALC.visualizations.Visualization.prototype.setInteractionStrategy: function (s) {
	document.addEventListener( 'mousedown', s.mouseDown, false );
	document.addEventListener( 'mousemove', s.mouseMove, false );
	document.addEventListener( 'mouseup', s.mouseUp, false );
	document.addEventListener( 'mousewheel', s.mouseWheel, false );

	document.addEventListener( 'touchstart', s.touchStart, false );
	document.addEventListener( 'touchmove', s.touchMove, false );
},
*/
