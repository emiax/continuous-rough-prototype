CALC.Label3D = function (renderer, $content) {
	THREE.Object3D.call( this );

	this.domElement = $('<div class="label3D"></div>');
	this.domElement.append($content);

	this.domX = -1;
	this.domY = 0;

	$(renderer.domElement).parent().append(this.domElement);

	this.domElement.css({opacity: 0.6});
	// add dom element
};

CALC.Label3D.prototype = new THREE.Object3D();
CALC.Label3D.prototype.constructor = CALC.Label3D;


CALC.Label3D.prototype.updatePosition = function(renderer, force) {
	var camera = renderer.camera;

	this.updateMatrix();
	this.updateMatrixWorld();

	camera.updateMatrix();
	camera.updateMatrixWorld();
	
	var projector = new THREE.Projector();
	//console.log(this.matrixWorld.getPosition());
	var vect = projector.projectVector(this.matrixWorld.getPosition(), renderer.camera);
	

	if (force || vect.x !== this.domX || vect.y !== this.domY) {
		var $rendererDom = $(renderer.domElement);
		var h = $rendererDom.innerHeight(),
			w = $rendererDom.innerWidth();

		this.domX = vect.x;
		this.domY = vect.y;

		//console.log(vect);
		if (this.domX > 0.5 || this.domX < -0.5 || this.domY > 0.5 || this.domY < -0.5) {
			this.domElement.css({visibility: 'hidden'});
			//console.log(this.domX + " " + this.domY);
		} else {
			this.domElement.css({visibility: 'visible'});
		}

		var l = w*vect.x + w/2;
		var t = -h*vect.y + h/2;

		this.domElement.css({
			left: l,
			top: t
		});
	}
	//console.log(vect);
};
