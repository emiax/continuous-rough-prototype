CALC.visualizations.TangentialPlaneInteractive = function(title) {
	CALC.visualizations.Visualization.call( this, title );
};


CALC.visualizations.TangentialPlaneInteractive.prototype = new CALC.visualizations.Visualization();
CALC.visualizations.TangentialPlaneInteractive.prototype.constructor = CALC.visualizations.TangentialPlaneInteractive;

CALC.visualizations.TangentialPlaneInteractive.prototype.init = function() {
	var scope = this;
	var n = 0;

	this.standardVisualizationSetup();
	var scene = this.scenes["std"];

	var fnSurfMaterial = new CALC.CheckerMaterial();
	var tgPlaneMaterial = new THREE.MeshBasicMaterial({color: '0x407dbc', opacity: 0});
	var tgSphereMaterial = new THREE.MeshBasicMaterial({color: '0xffffff', opacity: 0});

	fnSurfMaterial.uniforms.opacity.value = 0;

	var fnSurfObject = null,
		tgPlaneObject = null;
	this.tgSphereObject = new THREE.Mesh( new THREE.SphereGeometry( 0.125, 16, 16 ), tgSphereMaterial );
	var objectBranch = new THREE.Object3D();
	objectBranch.add(this.tgSphereObject);

	var point = THREE.Vector3(0, 0, 0);

	this.boundingBox = [-10, -10, 10, 10];
	this.resolution = 0.2;

	this.generateSurface = function (input, tg1, tg2) {
		try {
			scope.fnSurfExpr = CALC.parse(input);
			
			scope.fnXCurveExpr = scope.fnSurfExpr.replace({x: 's', y: Math.PI/2});
			scope.fnYCurveExpr = scope.fnSurfExpr.replace({x: 0, y: 's'});

			scope.parameterExpr = CALC.parse('s');
			scope.constantExpr = CALC.parse('0');

		} catch(e) {
			console.log("Could not parse exception");
			//todo: handle parse expressions properly
			return;
		}
		if (scope.fnSurfExpr) {
			//var dbg = scope.fnSurfExpr;
			//console.log("debug1");
			//console.log(dbg);

			n = 0;
			var geometry, object, geometries;
			var tg3 = scope.fnSurfExpr.evaluate({x: tg1, y: tg2});
			/*
			object = new CALC.VectorArrow(3, 0, new CALC.Multiplication({left: new CALC.Constant({value: 3}), right: scope.fnSurfExpr.replace({y: tg2}).differentiate('x')}), 0xff0000);
			object.position.set( tg1, tg2, tg3 );
			objectBranch.add(object);

			if (scope.vectXObject) {
				objectBranch.remove(scope.vectXObject);
			}*/

			scope.vectXObject = object;
			//var dbg = scope.fnSurfExpr.replace({x: tg1});
			//console.log("debug2");
			//console.log(dbg);

			//var temp = new CALC.Multiplication({left: new CALC.Constant({value: 3}), right: scope.fnSurfExpr.replace({x: tg1}).differentiate('y')});
			//console.log(temp);
			//console.log(tg2);
			//console.log(temp.evaluate({y: tg2}));


			/*
			object = new CALC.VectorArrow(0, 3, new CALC.Multiplication({left: new CALC.Constant({value: 3}), right: scope.fnSurfExpr.replace({x: tg1}).differentiate('y')}), 0x00ff00);
			object.position.set( tg1, tg2, tg3 );
			objectBranch.add(object);
			if (scope.vectYObject) {
				objectBranch.remove(scope.vectYObject);
			}
			scope.vectYObject = object;
			*/

			//Tangential Plane
			var tg = CALC.tangentialPlane(scope.fnSurfExpr, tg1, tg2);



			object = CALC.buildFunctionSurface(tg, scope.boundingBox, scope.boundingBox[2] - scope.boundingBox[0], tgPlaneMaterial);	
			object.position.set( 0, 0, 0 );
			
			if (scope.tgPlaneObject) {
				objectBranch.remove(scope.tgPlaneObject);
			}
			objectBranch.add(object);
			scope.tgPlaneObject = object;
			
			
			scope.tgSphereObject.position.set( tg1, tg2, tg3);



	
			
			//geometry = new CALC.FunctionSurfaceGeometry(scope.fnSurfExpr, scope.boundingBox, scope.resolution);
			object = CALC.buildFunctionSurface(scope.fnSurfExpr, scope.boundingBox, scope.resolution, fnSurfMaterial);
			fnSurfMaterial.setZInterval([object.getBoundingBox().min.z, object.getBoundingBox().max.z]);			
			object.position.set( 0, 0, 0 );
			
			if (scope.fnSurfObject) {
				objectBranch.remove(scope.fnSurfObject);
			}
			objectBranch.add(object);
			scope.fnSurfObject = object;
			
		} else {
			console.log("Expression is undefined");
		}
	}

	scene.add(objectBranch);
	this.renderers["std"].mouseStrategy = new CALC.NavigationStrategy(this.renderers["std"], objectBranch);

	
	var $fnInputDiv = $('<div class="text-box"></div>');

	var $fnInputParagraph = $('<p>Mata in en funktion av 2 variabler</p>');
	$fnInputDiv.append($fnInputParagraph);
	var $form = $('<form action="#"></form>');
	
	
	var $fnInput = $('<input type="text" value="cos(x)*cos(y)">');
	
	$form.submit(function() {
		scope.generateSurface($fnInput.val(), parseFloat($tgInput1.val()), parseFloat($tgInput2.val()));
	});

	$form.append($fnInput);

	$("input", $form).change(function() {
		$form.submit();
	});

	$fnInputParagraph.append($form);

	var $next = $('<a href="#" class="next-button">Gå vidare</a>');
	$fnInputDiv.append($next);

	$next.click(function() {
		scope.visitStep(1);
	});
	
	
	var $tgInputDiv = $('<div class="text-box"></div>');

	var $tgInputParagraph = $('<p>Välj en punkt att bilda ett tangentplan i.</p>');
	$tgInputDiv.append($tgInputParagraph);
	var $form1 = $('<form action="#"></form>');
	
	
	var $tgInput1 = $('<input type="text" value="1">');
	var $tgInput2 = $('<input type="text" value="0">');
	
	$form1.submit(function() {
		scope.generateSurface($fnInput.val(), parseFloat($tgInput1.val()), parseFloat($tgInput2.val()));
	});

	$form1.append($tgInput1).append($tgInput2);

	$("input", $form1).change(function() {
		$form1.submit();
	});

	$tgInputDiv.append($form1);
	
	var step0 = new CALC.VisualizationStep("Funktionsytan", [
			new CALC.TextPanelAction({
				panel: 		this.panels.text,
				elem:		$fnInputDiv
			}),
			new CALC.AbsoluteRotationAction({
				object: 	objectBranch,
				x: 			0.4,
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
				material: 	tgPlaneMaterial,
				opacity: 	0.0,
				duration: 	30,
				interpolation: CALC.interpolations.quintic
			}),
			new CALC.FadeAction({
				material: 	tgSphereMaterial,
				opacity: 	0.0,
				duration: 	30,
				interpolation: CALC.interpolations.quintic
			})
		]);
	
	var step1 = new CALC.VisualizationStep("Tangentplan", [
			new CALC.TextPanelAction({
				panel: 		this.panels.text,
				elem:		$tgInputDiv
			}),
			new CALC.AbsoluteRotationAction({
				object: 	objectBranch,
				x: 			0.4,
				z:			-Math.PI/4,
				duration: 	100,
				interpolation: CALC.interpolations.quintic
			}),
			new CALC.FadeAction({
				material: 	tgPlaneMaterial,
				opacity: 	0.5,
				duration: 	30,
				interpolation: CALC.interpolations.quintic
			}),
			new CALC.FadeAction({
				material: 	tgSphereMaterial,
				opacity: 	1.0,
				duration: 	30,
				interpolation: CALC.interpolations.quintic
			})
		]);


	this.setSteps([step0, step1]);
	this.visitStep(0);
	scope.boundingBox = [-10.0, -10.0, 10.0, 10.0];
	$form.submit();
}