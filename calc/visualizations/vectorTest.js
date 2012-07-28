'use strict';
/*global CALC, THREE */

(CALC.visualizations.VectorTest = function (title) {
    CALC.visualizations.Visualization.call(this, title);
}).extends(CALC.visualizations.Visualization, {

    init: function () {
        var scope, scene, vector, helper, trans1, trans2, step0;

        scope = this;
        this.standardVisualizationSetup();

        scene = this.scenes.std;
        vector = new CALC.VectorArrow(0, 0, CALC.parse('x'), 0xff0000);
        helper = new THREE.AxisHelper();

        scene.add(vector);
        scene.add(helper);

        trans1 = function () {
            CALC.translate(vector, {x: -5, z: -2}, {duration: 100, interpolation: CALC.interpolations.linear}, trans2);
        };

        trans2 = function () {
            CALC.translate(vector, {x: 5, z: 2}, {duration: 100, interpolation: CALC.interpolations.linear}, trans1);
        };

        trans1();

        step0 = new CALC.VisualizationStep("Vektor", []);

        this.setSteps([step0]);
        this.visitStep(0);
    }
});