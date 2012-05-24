CALC.CheckerMaterial.prototype = new THREE.ShaderMaterial();
CALC.CheckerMaterial.prototype.constructor = CALC.CheckerMaterial;


CALC.visualizations.TangentialPlane = function() {
	CALC.visualizations.Visualization.call( this );
	var scope = this;

	this.standardVisualizationSetup();
	var scene = this.scenes["std"];

	var fnSurfMaterial = new CALC.CheckerMaterial();

	var fnSurfObject = null;
	this.generateSurface = function (input) {
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
			
			if (this.fnSurfObject) {
				console.log("removing old object");
				scene.remove(this.fnSurfObject);
			}
			console.log(scene);
			console.log(object);

			scene.add(object);
			this.fnSurfObject = object;
		} else {
			console.log("Expression is undefined");
		}
	}


	var $fnInputDiv = $('<div class="text-box"><p>Mata in en funktion av 2 variabler</p></div>');
	var $form = $('<form action="#"></form>');
	
	
	var $fnInput = $('<input type="text" value="sin(x)*cos(y)">');


	$fnInput.change = function() {
		$form.submit();
	}

	$form.submit(function() {
		scope.generateSurface($fnInput.val());
	});

	$form.append($fnInput);
	$fnInputDiv.append($form);

	var $fnRotate = $('<a href="#">Rotera 360 grader</a>');
	var n = 0;
	$fnRotate.click(function() {
		n++;
		CALC.rotate(scope.fnSurfObject, {z: 2*Math.PI*n}, {duration: 100, interpolation: CALC.interpolations.quintic});
		
	});

	$fnInputDiv.append($fnRotate);

	var step0 = new CALC.VisualizationStep("Ytan", [
			new CALC.TextPanelAction({
				panel: 		this.panels.text,
				elem:		$fnInputDiv
			})
		]);

	this.setSteps([step0]);
	this.visitStep(0);
	$form.submit();

	this.populateNavigationPanel();

};


CALC.visualizations.TangentialPlane.prototype = new CALC.visualizations.Visualization();
CALC.visualizations.TangentialPlane.prototype.constructor = CALC.visualizations.TangentialPlane;
