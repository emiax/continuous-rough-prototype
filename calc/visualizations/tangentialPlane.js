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

	var labelBranch = new THREE.Object3D();
	objectBranch.add(labelBranch);
	labelBranch.position.set(4, 0, 0);
	labelBranch.add(new CALC.Label3D(this.renderers["std"], $('<p style="font-weight: bold;">f(x, y)</p>')));

	var point = THREE.Vector3(0, 0, 0);

	this.boundingBox = [-10, -10, 10, 10];
	this.resolution = 0.2;

	this.generateSurface = function (input) {
		try {
			this.fnSurfExpr = CALC.parse(input);
			
			this.fnXCurveExpr = this.fnSurfExpr.replace({x: 's', y: 0});
			this.fnYCurveExpr = this.fnSurfExpr.replace({x: 0, y: 's'});

			this.parameterExpr = CALC.parse('s');
			this.constantExpr = CALC.parse('0');

		} catch(e) {
			console.log("Could not parse exception");
			//todo: handle parse expressions properly
			return;
		}
		if (this.fnSurfExpr) {
			n = 0;
			var geometry, object, geometries;
			//geometry = new CALC.FunctionSurfaceGeometry(this.fnSurfExpr, scope.boundingBox, scope.resolution);
			object = CALC.buildFunctionSurface(this.fnSurfExpr, scope.boundingBox, scope.resolution, fnSurfMaterial);
			fnSurfMaterial.setZInterval([object.getBoundingBox().min.z, object.getBoundingBox().max.z]);			
			object.position.set( 0, 0, 0 );
			
			if (this.fnSurfObject) {
				objectBranch.remove(this.fnSurfObject);
			}
			objectBranch.add(object);
			this.fnSurfObject = object;

			geometry = new CALC.ParametricCurveGeometry(this.parameterExpr, this.constantExpr, this.fnXCurveExpr, {s: [scope.boundingBox[0], scope.boundingBox[2]]}, null, scope.resolution);

			object = new THREE.Line(geometry, fnXCurveMaterial);
			object.position.set( 0, 0, 0 );

			if (this.xCurveObject) {
				objectBranch.remove(this.xCurveObject);
			}

			objectBranch.add(object);
			this.xCurveObject = object;

			geometry = new CALC.ParametricCurveGeometry(this.constantExpr, this.parameterExpr, this.fnYCurveExpr, {s: [scope.boundingBox[1], scope.boundingBox[3]]}, null, scope.resolution);
			object = new THREE.Line(geometry, fnYCurveMaterial);
			object.position.set( 0, 0, 0 );

			if (this.yCurveObject) {
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
	var $xMinInput = $('<input type="text" value="-10">');
	var $xMaxInput = $('<input type="text" value="10">');

	var $yMinInput = $('<input type="text" value="-10">');
	var $yMaxInput = $('<input type="text" value="10">');


	
	$form.submit(function() {

		scope.boundingBox = [parseFloat($xMinInput.val()), parseFloat($yMinInput.val()), parseFloat($xMaxInput.val()), parseFloat($yMaxInput.val())];
		scope.generateSurface($fnInput.val());
	});

	$form.append($fnInput);
	$form.append($xMinInput);
	$form.append($xMaxInput);
	$form.append($yMinInput);
	$form.append($yMaxInput);

	$("input", $form).change(function() {
		$form.submit();
	});



	$fnInputParagraph.append($form);

	var $fnRotate = $('<a class="action-button" href="#">Rotera 90 grader</a>');
	var $next = $('<a href="#" class="next-button">Gå vidare</a>');
	
	/*$fnRotate.click(function() {
		n++;
		CALC.rotate(objectBranch, {z: Math.PI/2*n}, {duration: 100, interpolation: CALC.interpolations.quintic});
		
	});*/
	
	$fnRotate.click(function() {
		n++;
		CALC.rotate(objectBranch, {z: Math.PI/2*n}, {duration: 100, interpolation: CALC.interpolations.quintic});
		CALC.translate(scope.cameras["std"], {y: 20*Math.pow(-1,n+1)}, {duration: 100, delay: 100, interpolation: CALC.interpolations.quintic});
		CALC.rotate(scope.cameras["std"], {y: Math.PI*n}, {duration: 100, delay: 100, interpolation: CALC.interpolations.quintic});
	});

	$fnInputDiv.append($fnRotate);
	$fnInputDiv.append($next);


	$next.click(function() {
		scope.visitStep(1);
	});

	var step0 = new CALC.VisualizationStep("Ytan", [
			new CALC.TextPanelAction({
				panel: 		this.panels.text,
				elem:		$fnInputDiv
			}),
			new CALC.AbsoluteRotationAction({
				object: 	objectBranch,
				x: 			-0.4,
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
