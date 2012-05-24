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

			'float distX = min(1.0 - dist.x, dist.x);',
			'float distY = min(1.0 - dist.y, dist.y);',
			'//dist = min(dist, vec3(1.0, 1.0, 1.0) - dist);',
			//'return step(0.01, min(dist.z, min(dist.x, dist.y)));',
			'//#ifdef GL_OES_standard_derivatives',
				'//float width = 0.7 * length(vec2(dFdx(dist), dFdy(dist)));',
			'//#else',
				'float width = 0.03;',
			'//#endif',
			
			'return smoothstep(-width, width, min(distX, distY));',
		'}',
		'void main() {',
			'vec4 c1 = vec4(0.9, 0.9, 0.9, 1.0);',
			'vec4 c2 = vec4(0.9, 0.0, 0.0, 1.0);',
			'gl_FragColor = mix(c1, c2, checker());',
		'}'
	].join("\n");
};
