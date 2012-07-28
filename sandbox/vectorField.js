CALC.visualizations.VectorTest = function(title) {
    CALC.visualizations.Visualization.call( this, title );
}.extends(CALC.visualizaion.Visualization, {

    init: function() {
        var scope = this;
        this.standardVisualizationSetup();

        var scene = this.scenes["std"];
        var vector = new CALC.VectorArrow(0, 0, CALC.parse('x'), 0xff0000);
        var helper = new THREE.AxisHelper();

        scene.add(vector);
        scene.add(helper);

        var trans1 = function() {
            CALC.translate(vector, {x: -5, z: -2}, {duration: 100, interpolation: CALC.interpolations.linear}, trans2);
        };

        var trans2 = function() {
            CALC.translate(vector, {x: 5, z: 2}, {duration: 100, interpolation: CALC.interpolations.linear}, trans1);
        };

        trans1();

        var step0 = new CALC.VisualizationStep("Vektor", []);

        this.setSteps([step0]);
        this.visitStep(0);
    }

};

