CALC.visualizations.TangentialPlane = function() {

	CALC.visualizations.Visualization.call( this );

	this.dom = $('<div id="visualization"><div id="graphics-panel"></div><div id="text-panel"></div>');

	this.panels = {
		graphics: $("#graphics-panel", this.dom),
		text: $("#text-panel", this.dom)
	};
		
	var renderer = new THREE.WebGLRenderer({ antialias: true });
	var camera = new THREE.ScreenCamera( 45, /* Temporary aspect ratio is set to 1, but will be set in updateRenderers */ 1, 1, 2000 );
	var scene = new THREE.Scene();

	var origin = new THREE.Vector3(0, 0, 0);
	camera.position.y = 10;
	camera.position.z = 2;
	camera.lookAt(origin);

	scene.add(camera);


	this.cameras["main"] = camera;
	this.scenes["main"] = scene;
	this.renderers["main"] = this.attachRenderer(this.panels.graphics, renderer, scene, camera);


	var pz = CALC.parse('2*cos(s)*sin(t)');
	var py = CALC.parse('2*sin(s)*sin(t)');
	var px = CALC.parse('2*cos(t)');
	
	//console.log(dfdx);
	var material = new THREE.MeshBasicMaterial( { color: 0x557799, wireframe: true, transparent: true, opacity: 0.6 } );
	var geometry = new THREE.ParametricSurfaceGeometry(px, py, pz, {s: [0, 2*Math.PI], t: [0, Math.PI]}, null, 0.2);
	object = new THREE.Mesh(geometry, material);
	//object.doubleSided = true;
	object.position.set( 0, 0, 0 );
	scene.add(object);

	var scope = this;

	// visualization step 1, rotate sphere and display text
	this.steps.push(function() {
		var evtHandle = CALC.rotate(object, {
			y: Math.PI
		}, {
			duration: 120,
			interpolation: CALC.interpolations.quintic,
			delay: 20
		}, function() {
			scope.appendTextBox(scope.panels.text,  'Betrakta lite utryck, typ: <math>' + pz.mathML() + "</math>. Även <math>" +
							   px.mathML() + "</math> och <math>" + py.mathML() + '</math> är lite coola.');
		});
	});

	

};


CALC.visualizations.TangentialPlane.prototype = new CALC.visualizations.Visualization();
CALC.visualizations.TangentialPlane.prototype.constructor = CALC.visualizations.TangentialPlane;
