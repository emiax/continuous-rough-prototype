/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 */

CALC.DepthMesh = function ( geometries, material ) {

	THREE.Object3D.call( this );

	this.meshes = [];

	var g, len = geometries.length;
	for (g = 0; g < len; g++) {
		this.meshes.push(new THREE.Mesh(geometries[g], material));
		this.meshes[g].doubleSided = true;
	}

	
	this.currentIndex = 0;
	this.add(this.meshes[this.currentIndex]);
	this.currentChild = this.meshes[this.currentIndex];


}

CALC.DepthMesh.prototype = new THREE.Object3D();
CALC.DepthMesh.prototype.constructor = CALC.DepthMesh;

CALC.DepthMesh.prototype.replaceGeometry = function(i) {
	if (this.currentIndex !== i) {
		this.remove(this.currentChild);
		this.currentIndex = i;
		this.currentChild = this.meshes[i];
		this.add(this.currentChild);
		//console.log("replacing!");

	}	

}