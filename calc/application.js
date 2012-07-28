CALC.Application = function ($container) {
    
    this.visualizations = [];
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
	

	this.$container.html('<header>TNA006: Analys III<sup>PREVIEW</sup><div id="visualization-menu"></div></header><div id="visualization"></div><div id="loading"><p>Loading...</p></div>');

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
	//stats.update();
	//}
	
    },
    
    createVisualizationButton: function(visualization) {
	var scope = this;
	var $button = $('<a href="#">' + visualization.title + '</a>');
	$button.click(function() {
	    scope.setVisualization(visualization, $button);
	});
	return $button;
    },
    
    addVisualization : function(visualization) {
	var $button = this.createVisualizationButton(visualization);
	if (!this.visualizations.length) this.setVisualization(visualization, $button);
	this.visualizations.push(visualization);
	$("#visualization-menu", this.$container).append($button);
    },

    setVisualization: function(visualization, $button) {
	//$("#loading", this.$container).show();
	this.visualization = visualization;
	this.visualization.init();
	$("#visualization", this.$container).replaceWith(visualization.dom);
	$("#visualization-menu a", this.$container).removeClass("active");
	$button.addClass("active");
	visualization.application = this;
	this.updateWindow();
	//$("#loading", this.$container).hide();
    }



};
CALC.Application.prototype.constructor = CALC.Application;

