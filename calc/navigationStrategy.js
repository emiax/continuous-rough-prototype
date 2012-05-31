CALC.NavigationStrategy = function(context, branch) {
	this.context = context;
	this.branch = branch;
};

CALC.NavigationStrategy.prototype = new CALC.MouseStrategy();
CALC.NavigationStrategy.prototype.constructor = CALC.NavigationStrategy;


CALC.NavigationStrategy.prototype.drag = function(event, path) {
	len = path.length;
	if (len >= 2) {
		lon = path[len-1].x - path[len-2].x;
		lat = path[len-1].y - path[len-2].y;
		this.branch.rotation.z += lon * -0.01;
		this.branch.rotation.x += lat * -0.01;
	}
};

CALC.NavigationStrategy.prototype.scroll = function(event) {
	this.context.camera.fov -= event.wheelDeltaY * 0.05;
	this.context.camera.fov = this.context.camera.fov > 170 ? 170 : (this.context.camera.fov < 5 ? 5 : this.context.camera.fov);
	
	this.context.camera.updateProjectionMatrix();
};

/*

CALC.NavigationStrategy.prototype.calcSpin = function() {
	var output = "";
	rec %= 10;
	recX[rec] = curX;
	recY[rec] = curY;
	if (wasUserInteracting) {
		var firstRec = (rec + 1) % 10;
		var avX = (recX[rec] - recX[firstRec]) / 10;
		var avY = (recY[rec] - recY[firstRec]) / 10;
		stepZ = (avX > 1 || avX < -1 ? avX*0.01 : 0);
		stepX = (avY > 1 || avY < -1 ? -avY*0.01 : 0);
	}
	spinZ += stepZ;
	spinX += stepX;
	rec++;
	wasUserInteracting = false;
};

CALC.NavigationStrategy.prototype.mouseDown = function (event) {
	event.preventDefault();

	isUserInteracting = true;
	stepZ = 0;
	stepX = 0;

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;
};

CALC.NavigationStrategy.prototype.mouseMove = function( event ) {

	
	curX = event.clientX;
	curY = event.clientY;
	if ( isUserInteracting ) {
		//lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
		//lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
		lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
		lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
		render();
	}
};

CALC.NavigationStrategy.prototype.mouseUp = function(event) {
	isUserInteracting = false;
	render();
	wasUserInteracting = true;
};

*/


