CALC.Application = function ($container, developMode) {
    var scope = this;

    this.visualizations = [];
    this.visualization = null;
    this.$container = $container;
    this.scheduler = CALC.scheduler;
    this.stats = null; // todo
    this.t = 0;

    if ( !Detector.webgl ) Detector.addGetWebGLMessage();

    this.$container.html('<header>TNA006: Analys III<sup>PREVIEW</sup><div id="visualization-menu"></div></header><div id="visualization"></div><div id="loading"><p>Loading...</p></div>');

    $(window).resize(function (){
        scope.updateWindow();
    });


    if (developMode !== undefined) {
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.bottom = '0px';
        this.stats.domElement.style.right = '0px';
        $('body').append(this.stats.domElement);
    }


    this.render();


}.extend({

    updateWindow: function () {
        if (this.visualization) {
            this.visualization.updateRenderers();
        }
    },

    render: function () {

        var scope = this;
        requestAnimationFrame(function() {
            scope.render()
        });

        this.scheduler.tick();

        if (this.visualization) {
            this.visualization.render();
        }
        if (this.stats) {
            this.stats.update();
        }
    },

    createVisualizationButton: function(visualization) {
        var scope = this,
            $button = $('<a href="#">' + visualization.title + '</a>');

        $button.click(function() {
            scope.setVisualization(visualization, $button);
        });
        
        return $button;
    },

    addVisualization : function(visualization) {
        var $button = this.createVisualizationButton(visualization);

        this.visualizations.push(visualization);
        $("#visualization-menu", this.$container).append($button);
        
        if (this.visualizations.length === 1) {
            this.setVisualization(visualization, $button);
        }
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
});

