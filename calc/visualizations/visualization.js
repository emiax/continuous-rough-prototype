CALC.visualizations = {};

CALC.visualizations.Visualization = function() {
	
	this.renderers = {};
	this.scenes = {};
	this.renderers = {};
	this.cameras = {};
	this.application = null;
	this.steps = [];
	this.currentStep = -1;
	this.stepLinks = [];

};

CALC.visualizations.Visualization.prototype = {

	render: function() {
		var renderer;

		for(r in this.renderers) {
			if (this.renderers.hasOwnProperty(r)) {
				renderer = this.renderers[r];
				if (renderer.scene && renderer.camera) {	
					renderer.render(renderer.scene, renderer.camera);
				}
			}
		}
	},


	attachRenderer: function($elem, renderer, scene, camera) {
		renderer.setSize($elem.innerWidth(), $elem.innerHeight());
		// Augment renderer object with scene and camera, to simplify rendereing process
		renderer.camera = camera;
		renderer.scene = scene;
		$elem.append(renderer.domElement);
		return renderer;
	},

	updateRenderers: function() {
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
	},

	appendTextBox: function($panel, content) {
		var $box = $('<div class="text-box"></div>');
		$box.html(content);
		$box.hide();
		$panel.append($box);
		$box.slideDown('slow');
	},

	appendPanel: function($panel, $content) {
		// todo: do something to preserve state somewhere..
		$panel.append($content);
	},

	clearPanel: function($panel, $content) {
		// todo: do something to preserve state somewhere..
		$panel.html($content);
	},
	standardVisualizationSetup: function() {
		this.dom = $('<div id="visualization">' + 
						'<div id="main-row">' + 
							'<div id="graphics-panel"></div>' +
							'<div id="text-panel"></div>' +
						'</div>' + 
						'<div id="navigation-panel"></div>' +
					'</div>');

		this.panels = {
			graphics: $("#graphics-panel", this.dom),
			text: $("#text-panel", this.dom),
			navigation: $("#navigation-panel", this.dom)
		};
			
		var renderer = new THREE.WebGLRenderer({ antialias: true });

		var camera = new CALC.ScreenCamera( 45, /* Temporary aspect ratio is set to 1, but will be set in updateRenderers */ 1, 1, 2000 );
		var scene = new THREE.Scene();

		var origin = new THREE.Vector3(0, 0, 0);
		camera.position.y = -20;
		camera.up = new THREE.Vector3(0, 0, 1);
		camera.lookAt(origin);

		scene.add(camera);


		var light = new THREE.AmbientLight(0x282828);
		scene.add(light);

		light = new THREE.PointLight(0xFFFFFF);
		light.position = new THREE.Vector3(4, -2, 1);
		scene.add(light);


		this.cameras["std"] = camera;
		this.scenes["std"] = scene;
		this.renderers["std"] = this.attachRenderer(this.panels.graphics, renderer, scene, camera);
	}, 

	setSteps: function(steps) {
		this.steps = steps;
		var scope = this;
		var text = "";

		for(var i = 0; i < this.steps.length; i++) {
			$a = $('<a class="visualization-step">' + this.steps[i].getTitle() + '</a> ');
			this.stepLinks[i] = $a;
			var f = function (i) {
				$a.click(function() {
					scope.visitStep(i);
				})
			}(i);
			this.panels["navigation"].append($a);	
		}
		/*for(var i = 0; i < steps.length; i++) {
			function() { 
				var functions = 

				this.step[i] = function() {
					for(f in functions) {
						functions[f]();
					}
			}
			}();  
		}*/
	},


	visitStep: function(i) {
		if (this.stepLinks[this.currentStep]) {
			this.stepLinks[this.currentStep].removeClass("active");
		}
		if (i <= this.currentStep && this.steps[i]) {
			this.steps[this.currentStep].leave();
		}
		var step = this.steps[i];
		if (step) {
			step.visit();
			this.stepLinks[i].addClass("active");
			this.currentStep = i;
		}
	}
};



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
