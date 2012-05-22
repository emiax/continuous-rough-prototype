function CALC.navigationStrategy = function() {

	var that = {};

	var calcSpin = function() {
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
	}
			

	that.mouseDown(event) {
		event.preventDefault();

		isUserInteracting = true;
		stepZ = 0;
		stepX = 0;

		onPointerDownPointerX = event.clientX;
		onPointerDownPointerY = event.clientY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;
	}

	that.mouseMove = function( event ) {
		curX = event.clientX;
		curY = event.clientY;
		if ( isUserInteracting ) {
			//lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
			//lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
			lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
			lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;
			render();
		}
	}

	that.mouseUp = function(event) {
		isUserInteracting = false;
		render();
		wasUserInteracting = true;
	}


	that.mouseWheel = function(event) {
		tion onDocumentMouseWheel( event ) {

		camera.fov -= event.wheelDeltaY * 0.05;
		camera.fov = camera.fov > 170 ? 170 : (camera.fov < 5 ? 5 : camera.fov);
		
		camera.updateProjectionMatrix();

		render();
	}

	that.touchStart = function(event) {
		if ( event.touches.length == 1 ) {

			event.preventDefault();

			onPointerDownPointerX = event.touches[ 0 ].pageX;
			onPointerDownPointerY = event.touches[ 0 ].pageY;

			onPointerDownLon = lon;
			onPointerDownLat = lat;
		}

	}
	that.touchMove = function(event) {
		if ( event.touches.length == 1 ) {
			event.preventDefault();

			lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
			lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

			render();
		}
	}

}();