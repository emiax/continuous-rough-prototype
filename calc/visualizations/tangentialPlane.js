CALC.CheckerMaterial.prototype = new THREE.ShaderMaterial();
CALC.CheckerMaterial.prototype.constructor = CALC.CheckerMaterial;


CALC.visualizations.TangentialPlane = function() {
	try {
	CALC.visualizations.Visualization.call( this );
	var scope = this;
	var n = 0;

	this.standardVisualizationSetup();
	var scene = this.scenes["std"];

	var fnSurfMaterial = new CALC.CheckerMaterial();
	var fnXCurveMaterial = new THREE.LineBasicMaterial({opacity: 0, linewidth: 2});
	var fnYCurveMaterial = new THREE.LineBasicMaterial({opacity: 0, linewidth: 2});

	fnSurfMaterial.uniforms.opacity.value = 0;

	var fnSurfObject = null;
	var objectBranch = new THREE.Object3D();
	var point = THREE.Vector3(0, 0, 0);

	this.generateSurface = function (input) {
		try {
			this.fnSurfExpr = CALC.parse(input);
			
			this.fnXCurveExpr = this.fnSurfExpr.replace({x: 's', y: 0});
			this.fnYCurveExpr = this.fnSurfExpr.replace({x: 0, y: 's'});
			console.log(this.fnXCurveExpr);
			console.log(this.fnYCurveExpr);

			this.parameterExpr = CALC.parse('s');
			this.constantExpr = CALC.parse('0');

		} catch(e) {
			console.log("Could not parse exception");
			//todo: handle parse expressions properly
			return;
		}
		if (this.fnSurfExpr) {
			n = 0;
			var geometry, object;
			geometry = new CALC.FunctionSurfaceGeometry(this.fnSurfExpr, [-10, -10, 10, 10], 0.2);
			object = new THREE.Mesh(geometry, fnSurfMaterial);
			object.doubleSided = true;
			object.position.set( 0, 0, 0 );
			
			if (this.fnSurfObject) {
				console.log("removing old object");
				objectBranch.remove(this.fnSurfObject);
			}
			objectBranch.add(object);
			this.fnSurfObject = object;

			geometry = new CALC.ParametricCurveGeometry(this.parameterExpr, this.constantExpr, this.fnXCurveExpr, {s: [-10, 10]}, null, 0.2);

			object = new THREE.Line(geometry, fnXCurveMaterial);
			object.position.set( 0, 0, 0 );

			if (this.xCurveObject) {
				console.log("removing old object");
				objectBranch.remove(this.xCurveObject);
			}

			objectBranch.add(object);
			this.xCurveObject = object;

			geometry = new CALC.ParametricCurveGeometry(this.constantExpr, this.parameterExpr, this.fnYCurveExpr, {s: [-10, 10]}, null, 0.2);
			object = new THREE.Line(geometry, fnYCurveMaterial);
			object.position.set( 0, 0, 0 );

			if (this.yCurveObject) {
				console.log("removing old object");
				objectBranch.remove(this.yCurveObject);
			}

			objectBranch.add(object);
			this.yCurveObject = object;

		} else {
			console.log("Expression is undefined");
		}
	}

	scene.add(objectBranch);

	var $fnInputDiv = $('<div class="text-box"></div>');

	var $fnInputParagraph = $('<p>Mata in en funktion av 2 variabler</p>');
	$fnInputDiv.append($fnInputParagraph);
	var $form = $('<form action="#"></form>');
	
	
	var $fnInput = $('<input type="text" value="cos(x)*cos(y)">');


	$fnInput.change(function() {
		$form.submit();
	});

	$form.submit(function() {
		scope.generateSurface($fnInput.val());
	});

	$form.append($fnInput);
	$fnInputParagraph.append($form);

	var $fnRotate = $('<a class="action-button" href="#">Rotera 90 grader</a>');
	var $next = $('<a href="#" class="next-button">Gå vidare</a>');
	
	$fnRotate.click(function() {
		n++;
		CALC.rotate(objectBranch, {z: Math.PI/2*n}, {duration: 100, interpolation: CALC.interpolations.quintic});
		
	});

	$fnInputDiv.append($fnRotate);
	$fnInputDiv.append($next);


	$next.click(function() {
		scope.visitStep(1);
		console.log("yo!");
	});

	var step0 = new CALC.VisualizationStep("Ytan", [
			new CALC.TextPanelAction({
				panel: 		this.panels.text,
				elem:		$fnInputDiv
			}),
			new CALC.AbsoluteRotationAction({
				object: 	objectBranch,
				x: 			0.5,
				z:			0,
				duration: 	100,
				interpolation: CALC.interpolations.quintic
			}),
			new CALC.MaterialUniformAction({
				material: 	fnSurfMaterial,
				opacity: 	1.0,
				duration: 	100,
				interpolation: CALC.interpolations.quintic
			}),
			new CALC.FadeAction({
				material: 	fnXCurveMaterial,
				opacity: 	0.0,
				duration: 	100,
				interpolation: CALC.interpolations.quintic
			}),
			new CALC.FadeAction({
				material: 	fnYCurveMaterial,
				opacity: 	0.0,
				duration: 	100,
				interpolation: CALC.interpolations.quintic
			})			
		]);

	var step1 = new CALC.VisualizationStep("Tangenter", [
			new CALC.TextPanelAction({
				panel: 		this.panels.text,
				elem:		$('<div class="text-box"><p>yoyo</p>')
			}),
			new CALC.AbsoluteRotationAction({
				object: 	objectBranch,
				x: 			0,
				z:			-Math.PI/2,
				duration: 	100,
				interpolation: CALC.interpolations.quintic
			}),
			new CALC.MaterialUniformAction({
				material: 	fnSurfMaterial,
				opacity: 	0,
				duration: 	100,
				interpolation: CALC.interpolations.quintic
			}),
			new CALC.FadeAction({
				material: 	fnXCurveMaterial,
				opacity: 	1.0,
				duration: 	100,
				interpolation: CALC.interpolations.quintic
			}),
			new CALC.FadeAction({
				material: 	fnYCurveMaterial,
				opacity: 	1.0,
				duration: 	100,
				interpolation: CALC.interpolations.quintic
			})
		]);


	this.setSteps([step0, step1]);
	this.visitStep(0);
	$form.submit();
	} catch(e) {
		console.log(e);
	}

};


CALC.visualizations.TangentialPlane.prototype = new CALC.visualizations.Visualization();
CALC.visualizations.TangentialPlane.prototype.constructor = CALC.visualizations.TangentialPlane;
