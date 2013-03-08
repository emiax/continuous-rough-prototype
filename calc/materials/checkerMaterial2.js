CALC.CheckerMaterial = function(parameters) {
	THREE.ShaderMaterial.call( this, parameters );

	this.uniforms = {opacity: {type: 'f', value: 1.0}, zMin: {type: 'f', value: -10}, zMax: {type: 'f', value: 10}};
	this.shading = THREE.SmoothShading;

	this.vertexShader = [
	'varying vec3 vColor;',
	'varying vec3 pos;',
	'varying vec3 nor;',
	'varying vec4 mvPosition;',
	'void main() {',
		'mvPosition = modelViewMatrix * vec4( position, 1.0 );',
		'pos = position;',
		'nor = (modelViewMatrix * vec4(normal, 1.0)).xyz;',
		'gl_Position = projectionMatrix * mvPosition;',
	'}',

		].join("\n");

	this.fragmentShader = [
		'varying vec3 pos;',
		'uniform float opacity;',
		'uniform float zMin;',
		'uniform float zMax;',
		'varying vec3 nor;',
		'varying vec4 mvPosition;',
		'float checker(float w) {',
			'vec3 dist = abs(fract(pos));',


			'float distX = min(1.0 - dist.x, dist.x);',
			'//float distY = min(1.0 - dist.y, dist.y);',
			'//dist = min(dist, vec3(1.0, 1.0, 1.0) - dist);',
			//'return step(0.01, min(dist.z, min(dist.x, dist.y)));',
			'//#ifdef GL_OES_standard_derivatives',
				'//float width = 0.7 * length(vec2(dFdx(dist), dFdy(dist)));',
			'//#else',
				'float width = w;',
			'//#endif',
			
			'//return smoothstep(-width, width, min(distX, distY));',
			'return smoothstep(0.0, width, distX);',
		'}',
		'void main() {',
			
			'vec3 c1 = vec3(0.75, 0.60, 0.00);',
			'vec3 c2 = vec3(0.85, 0.50, 0.00);',
			'vec3 c3 = vec3(0.65, 0.2, 0.0);',

			'float zAvg = (zMin+zMax)/2.0;',
			'vec3 c4 = mix(c1, c2, smoothstep(zMin, zAvg, pos.z));',
			'vec3 c5 = mix(c2, c3, smoothstep(zAvg, zMax, pos.z));',
			'vec3 c6 = mix(c4, c5, step(zAvg, pos.z));',
			//'vec3 nor = vec3(0.0, 1.0, 0.5);',
			'vec3 c7 = vec3(0.9, 0.9, 0.9);', // grid color

			'float c = abs(dot(nor, normalize(mvPosition.xyz)));',
			'float d = length(mvPosition.xyz);',
			'float a = abs(dot(nor, vec3(1.0, 0.0, 0.0)));',
			'float w = d*(1.0-a)/c/30.0;',
			'gl_FragColor = vec4(mix(c7, c6, checker(w)), opacity);',
			
			//'gl_FragColor = vec4(w, w, w, opacity);',
		'}'
	].join("\n");
};

// d / kameraskalär / lutningsskalär


CALC.CheckerMaterial.prototype = new THREE.ShaderMaterial();
CALC.CheckerMaterial.prototype.constructor = CALC.CheckerMaterial;

CALC.CheckerMaterial.prototype.setZInterval = function (interval) {
	this.uniforms.zMin.value = interval[0];
	this.uniforms.zMax.value = interval[1];
};
