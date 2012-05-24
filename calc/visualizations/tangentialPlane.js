CALC.CheckerMaterial.prototype = new THREE.ShaderMaterial();
CALC.CheckerMaterial.prototype.constructor = CALC.CheckerMaterial;


CALC.visualizations.TangentialPlane = function() {
	CALC.visualizations.Visualization.call( this );
	var scope = this;

	this.standardVisualizationSetup();
	var scene = this.scenes["std"];

	var fnSurfMaterial = new CALC.CheckerMaterial();

	/*
		closure: 
		remembers old surface object, so it can be removed from the scene when a new one is inserted
	*/	
	this.generateSurface = function () {
		var oldSurfObject = null;

		/* parsable expression string */
		return function(input) {
			try {
				this.fnSurfExpr = CALC.parse(input);
			} catch(e) {
				console.log("Could not parse exception");
				//todo: handle parse expressions properly
				return;
			}
			if (this.fnSurfExpr) {
				
				var geometry = new CALC.FunctionSurfaceGeometry(this.fnSurfExpr, [-10, -10, 10, 10], 0.2);
				var object = new THREE.Mesh(geometry, fnSurfMaterial);
				object.doubleSided = true;
				object.position.set( 0, 0, 0 );
				
				if (oldSurfObject) {
					console.log("removing old object");
					scene.remove(oldSurfObject);
				}
				console.log(scene);
				console.log(object);

				scene.add(object);
				oldSurfObject = object;
			} else {
				console.log("Expression is undefined");
			}
		}
	}();


	var $fnInputDiv = $('<div class="text-box"><p>Mata in en funktion av 2 variabler</p></div>');
	var $form = $('<form action="#"></form>');
	
	
	var $fnInput = $('<input type="text"></input>');
	$fnInput.change = function() {
		$form.submit();
	}

	$form.submit(function() {
		scope.generateSurface($fnInput.val());
	});

	$form.append($fnInput);
	$fnInputDiv.append($form);

	var step0 = new CALC.VisualizationStep("Ytan", [
			new CALC.TextPanelAction({
				panel: 		this.panels.text,
				elem:		$fnInputDiv
			})
		]);

	this.setSteps([step0]);
	this.visitStep(0);

	this.populateNavigationPanel();

};


CALC.visualizations.TangentialPlane.prototype = new CALC.visualizations.Visualization();
CALC.visualizations.TangentialPlane.prototype.constructor = CALC.visualizations.TangentialPlane;
