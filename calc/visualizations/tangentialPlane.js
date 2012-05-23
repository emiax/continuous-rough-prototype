/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  fragmentShader: <string>,
 *  vertexShader: <string>,

 *  uniforms: { "parameter1": { type: "f", value: 1.0 }, "parameter2": { type: "i" value2: 2 } },

 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,

 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,

 *  lights: <bool>,
 *  vertexColors: <bool>,
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 * }
 */


CALC.CheckerMaterial = function(parameters) {
	THREE.ShaderMaterial.call( this, parameters );

	this.vertexShader = [
	'varying vec3 vColor;',
	'varying vec3 pos;',
	'void main() {',
		'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
		'pos = position;',
		'gl_Position = projectionMatrix * mvPosition;',
	'}',

		].join("\n");

	this.fragmentShader = [
		'varying vec3 pos;',
		'float checker() {',
			'vec3 dist = fract(pos);',
			'dist = min(dist, vec3(1.0, 1.0, 1.0) - dist);',
			//'return step(0.01, min(dist.z, min(dist.x, dist.y)));',
			'#ifdef GL_OES_standard_derivatives',
				'float width = 0.7 * length(vec2(dFdx(dist), dFdy(dist)));',
			'#else',
				'float width = 0.05;',
			'#endif',
			
			'return smoothstep(-width, width, min(dist.z, min(dist.x, dist.y)));',
		'}',
		'void main() {',
			'vec4 c1 = vec4(0.9, 0.9, 0.9, 1.0);',
			'vec4 c2 = vec4(0.9, 0.0, 0.0, 1.0);',
			'gl_FragColor = mix(c1, c2, checker());',
		'}'
	].join("\n");
}

CALC.CheckerMaterial.prototype = new THREE.ShaderMaterial();
CALC.CheckerMaterial.prototype.constructor = CALC.CheckerMaterial;


CALC.visualizations.TangentialPlane = function() {
	CALC.visualizations.Visualization.call( this );
	var scope = this;

	this.standardVisualizationSetup();

	var pz = CALC.parse('2*cos(s)*sin(t)');
	var py = CALC.parse('2*sin(s)*sin(t)');
	var px = CALC.parse('2*cos(t)');


	
	//var material = new THREE.MeshBasicMaterial( { color: 0x557799, wireframe: true, transparent: true, opacity: 0.6 } );
	//var material = new THREE.MeshLambertMaterial( { color: 0x557799, wireframe: false, transparent: true, opacity: 0.6 } );
	var material = new CALC.CheckerMaterial();
	
	var geometry = new THREE.ParametricSurfaceGeometry(px, py, pz, {s: [0, 2*Math.PI], t: [0, Math.PI]}, null, 0.2);
	var object = new THREE.Mesh(geometry, material);
	
	object.doubleSided = true;
	object.position.set( 0, 0, 0 );
	
	var scene = this.scenes["std"];
	scene.add(object);



	this.steps = [
		// Step 1: show expression and surface
		new CALC.VisualizationStep("Ytan", [
			new CALC.AbsoluteRotationAction({
				object:  	null,
				y: 			Math.PI,
				duration: 	120,
				delay: 		20
			}),
			new CALC.TextPanelAction({
				panel: 		this.panels.text,
				text: 		"Betrakta dessa uttryck..."
			})
		]),
		// Step 2: show tangents
		new CALC.VisualizationStep("Tangentvektorer", [
			new CALC.AbsoluteRotationAction({
				object:  	object,
				y: 			Math.PI,
				duration: 	120,
				delay: 		20
			}),
			new CALC.TextPanelAction({
				panel: 		this.panels.text,
				text: 		"Betrakta dessa uttryck...",
				clear: 		true
			})
		])
	];

	this.populateNavigationPanel();

};


CALC.visualizations.TangentialPlane.prototype = new CALC.visualizations.Visualization();
CALC.visualizations.TangentialPlane.prototype.constructor = CALC.visualizations.TangentialPlane;
