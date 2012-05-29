CALC.Application = function ($container) {
	

	this.visualization = null;
	this.$container = $container;
	this.scheduler = CALC.scheduler;
	this.stats = null; // todo
	this.init();
	this.t = 0;
	
};


CALC.Application.prototype = {

	updateWindow: function () {
		if (this.visualization) {
			this.visualization.updateRenderers();
		}
	},

	init: function () {
	

		if ( !Detector.webgl ) Detector.addGetWebGLMessage();
	

		this.$container.html('<header>TNA006: Analys III<sup>PREVIEW</sup></header><div id="visualization"></div>');

		var scope = this;
		$(window).resize(function (){
			scope.updateWindow();
		});


		this.render();
		
		/*if (debugMode != undefined) {
			this.stats = new Stats();
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.top = '0px';
			this.document.childNodes[0].appendChild(stats.domElement);
		}*/
	},


	render: function () {

		//if (this.visualization) {
			var scope = this;
			requestAnimationFrame(function() {scope.render()});

		//	requestAnimationFrame(this.render);			
			this.scheduler.tick();

			if (this.visualization) {
				this.visualization.render();
			}

			this.t++;
			if (this.t > 500) {
				this.t = 0;
			}
			//stats.update();
		//}
		
	},

	setVisualization: function(visualization) {
		this.visualization = visualization;
		$("#visualization", this.$container).replaceWith(visualization.dom);
		visualization.application = this;
		this.updateWindow();
	}



};
CALC.Application.prototype.constructor = CALC.Application;

