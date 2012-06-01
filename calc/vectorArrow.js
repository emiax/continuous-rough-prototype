/*
	x, y, z, xlen, ylen, zlen are CALC.Nodes or numers

*/


CALC.VectorArrow = function (xlen, ylen, zlen, color) {

	this.xlen = xlen;
	this.ylen = ylen;
	this.zlen = zlen;

	this._oldX = 0;
	this._oldY = 0;
	this._oldZ = 0;

	var uniforms = {opacity: {type: 'f', value: 1.0}, len: {type: 'f', value: 1.0}, size: {type: 'f', value: 0.05}, color: {type: 'c', value: new THREE.Color(color)}};

	var cylVertexShader = [
		'varying vec3 pos;',
		'uniform float size;',
		'uniform float len;',
		'varying vec3 vColor;',
		'uniform vec3 color;',
		'void main() {',
			'pos = position;',
			'vec4 mvPosition = modelViewMatrix * vec4( size*position.x, step(0.00001, position.y)*(position.y*len-6.0*size), size*position.z, 1.0 );',
			'vColor = color;',
			'gl_Position = projectionMatrix * mvPosition;',
		'}'
	].join("\n");


	var coneVertexShader = [
		'varying vec3 pos;',
		'uniform float size;',
		'varying vec3 vColor;',
		'void main() {',
			'pos = position;',
			'vec4 mvPosition = modelViewMatrix * vec4( size*3.0*position.x, size*6.0*position.y, size*3.0*position.z, 1.0 );',
			'vColor = vec3(1.0, 0.0, 0.0);',
			'gl_Position = projectionMatrix * mvPosition;',
		'}'
	].join("\n");

	var coneFragmentShader = [
	'varying vec3 pos;',
	'void main() {',
			'float a = (pos.z + 1.0)/2.0;',
			'gl_FragColor = vec4(a/3.0, a/2.0, a, 1.0);',
		'}'
	].join("\n");


	this.cylMaterial = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: cylVertexShader,
		fragmentShader: coneFragmentShader
	});


	this.coneMaterial = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: coneVertexShader,
		fragmentShader: coneFragmentShader
	});


	if (typeof xlen === 'number') {
		this.xlen = new CALC.Constant({value: xlen});
	}
	if (typeof ylen === 'number') {
		this.ylen = new CALC.Constant({value: ylen});
	}
	if (typeof zlen === 'number') {
		this.zlen = new CALC.Constant({value: zlen});
	}

	THREE.Object3D.call( this );

	var cylGeometry = new THREE.CylinderGeometry( 1, 1, 1, 10, 1);
	var coneGeometry = new THREE.CylinderGeometry( 0, 1, 1, 10, 1 );

	var v, vl;
	// place cylinder with its base in its origin
	for (v = 0, vl = cylGeometry.vertices.length; v < vl; v++) {
		cylGeometry.vertices[v].position.y += 0.5;
	}

	// place cone with its tip in its origin
	for (v = 0, vl = coneGeometry.vertices.length; v < vl; v++) {
		coneGeometry.vertices[v].position.y -= 0.5;
	}

	
	
	this.cyl = new THREE.Mesh( cylGeometry, this.cylMaterial);
	this.cone = new THREE.Mesh( coneGeometry, this.coneMaterial);
		
	
	this.zRotation = new THREE.Object3D();
	this.xRotation = new THREE.Object3D();

	this.xRotation.add( this.cone );
	this.xRotation.add( this.cyl );
	this.zRotation.add( this.xRotation );
	this.add(this.zRotation);
};

CALC.VectorArrow.prototype = new THREE.Object3D();
CALC.VectorArrow.prototype.constructor = CALC.VectorArrow;


CALC.VectorArrow.prototype.update = function (forceUpdate) {

	if (forceUpdate || this._oldX != this.position.x || this._oldY != this.position.y || this._oldZ != this.position.z) {
		var baseX = this.position.x, baseY = this.position.y, baseZ = this.position.z,
			vectX = this.xlen.evaluate({x: baseX, y: baseY, z: baseZ}),
			vectY = this.ylen.evaluate({x: baseX, y: baseY, z: baseZ}),
			vectZ = this.zlen.evaluate({x: baseX, y: baseY, z: baseZ}),
			length = Math.sqrt(vectX*vectX + vectY*vectY + vectZ*vectZ);

		this.cone.position = new THREE.Vector3(0, length, 0);

		var xRot = Math.atan2(vectZ, vectY);
		var zRot = Math.atan(vectX / vectY);

		this.zRotation.rotation = new THREE.Vector3(0, 0, zRot);
		this.xRotation.rotation = new THREE.Vector3(xRot, 0, 0);

		this.cylMaterial.uniforms.len.value = length;
		this._oldX = this.position.x;
		this._oldY = this.position.y;
		this._oldZ = this.position.z;

	}
	
}

	

	
