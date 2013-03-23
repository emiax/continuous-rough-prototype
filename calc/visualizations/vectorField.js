'use strict';
/*global CALC */

(CALC.visualizations.VectorField = function(title) {

    CALC.visualizations.Visualization.call( this, title );

}).extends(CALC.visualizations.Visualization, {

    init: function() {
        var scope = this;

        this.standardVisualizationSetup();
        var scene = this.scenes["std"];
        var camera = this.renderers["std"].camera.zoom(20, true);
		
        var objectBranch = new THREE.Object3D();
        var vectorBranch = new THREE.Object3D();
        objectBranch.add(vectorBranch);
        
        scene.add(objectBranch);

        objectBranch.rotation = new THREE.Vector3(Math.PI / 5, 0, 0);
		objectBranch.position.z = 0.5;
		
		var vectors = [];
		
		var x = CALC.parse('0-0.3*y');
		var y = CALC.parse('0.3*x');
		var maxRadius = 9;
		for (var h = -2; h < 3; ++h) {
			for (var t = 0; t < 2*Math.PI; t += Math.PI/8) {
				for (var r = 0.5; r < maxRadius; r += 1) {
					var radius = CALC.parse(r);
					
					var green = 0xff * (1 - r / maxRadius);
					green = Math.round(green) << 8;
					
					var color = 0xff0000 + green;
					
					var vector = new CALC.VectorArrow(x, y, 0, color);
					
					vector.position.set(Math.cos(t+0.5*r)*r, Math.sin(t+0.5*r)*r, h);
					vectorBranch.add(vector);
					vectors.push(vector);
				}
			}
		}
		
		var flow;
		flow = function() {
			CALC.animator.animate({
				milliseconds: 10000,
				interpolation: CALC.interpolations.linear,
				begin: function() {},
				step: function(t) { 
					vectorBranch.rotation.z = 2* t * Math.PI;
				},
				end: function() {flow();}
			});
		};
		
		flow();

        this.renderers["std"].mouseStrategy = new CALC.NavigationStrategy(this.renderers["std"], objectBranch);

        // Step 0
        var $fnInfoDiv0 = $('<div class="text-box"></div>');
        var $infoParagraph0a = $('<p>Här åskådliggörs ett vektorfält <math><mi>A</mi></math> med hjälp av fältvektorerna <math><mi>A</mi><mfenced open="(" close=")"><msub><mi>P</mi><mi>i</mi></msub></mfenced></math> i en ändlig punktmängd <math><mfenced open="{" close="}"><msub><mi>P</mi><mi>i</mi></msub></mfenced></p>');
        $fnInfoDiv0.append($infoParagraph0a);

        var step0 = new CALC.VisualizationStep("Funktionsytan", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv0
            })
        ]);

        this.setSteps([step0]);
        this.visitStep(0);

    }


});
