CALC.Application = function(conatiner) {
	
	this.scene = null;
	this.camera = null;
	this.renderer = null;
	this.conatiner = null;
	this.interactionStratey = null;	
	this.scheduler = CALC.scheduler;
	this.stats = null;

	this.init();

	return that;

}


CALC.Application.prototype = {

	init = function() {

		if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
		
		document.body.appendChild( this.container );
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.container.appendChild( renderer.domElement );

		if (debugMode != undefined) {
			this.stats = new Stats();
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.top = '0px';
			this.document.childNodes[0].appendChild(stats.domElement);
		}
	}

	render = function() {
		this.scheduler.tick();
		renderer.render( scene, camera );
		stats.update();
		requestAnimationFrame(this.render);
	}

	function setInteractionStrategy(s) {
		document.addEventListener( 'mousedown', s.mouseDown, false );
		document.addEventListener( 'mousemove', s.mouseMove, false );
		document.addEventListener( 'mouseup', s.mouseUp, false );
		document.addEventListener( 'mousewheel', s.mouseWheel, false );

		document.addEventListener( 'touchstart', s.touchStart, false );
		document.addEventListener( 'touchmove', s.touchMove, false );
	}



};
CALC.Application.prototype.constructor = CALC.Application;

