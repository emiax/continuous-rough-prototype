'use strict';
/*global CALC*/

(CALC.NavigationStrategy = function (renderer, branch) {
    this.renderer = renderer;
    this.branch = branch;
}).extends(CALC.MouseStrategy, {
    drag: function (event, path) {
		if (event.which == 1) {
			var len = path.length, lon, lat;
			if (len >= 2) {
				lon = path[len - 1].x - path[len - 2].x;
				lat = path[len - 1].y - path[len - 2].y;
				this.branch.rotation.z += lon * 0.01;
				this.branch.rotation.x += lat * 0.01;
				if (this.branch.rotation.x > Math.PI / 2) this.branch.rotation.x = Math.PI / 2;
				else if (this.branch.rotation.x < -Math.PI / 2) this.branch.rotation.x = -Math.PI / 2;
			}
		}
		else if (event.which == 3) {

			var len = path.length, lon, lat;
			if (len >= 2) {
				lon = path[len - 1].x - path[len - 2].x;
				lat = path[len - 1].y - path[len - 2].y;
				this.branch.position.x += lon * 0.05;
				this.branch.position.z -= lat * 0.05;
			}
		}
    },
    scroll: function (event, delta) {
		//this.renderer.camera.perspective += delta / 20;
		//this.renderer.camera.perspective = this.renderer.camera.perspective < 0 ? 0 : (this.renderer.camera.perspective > 1 ? 1 : this.renderer.camera.perspective);
		//this.renderer.camera.updateProjectionMatrix();
		this.renderer.camera.zoom(delta*5);
		
        //console.log("zoom with " + delta);
        //this.renderer.camera.fov -= delta * 5;
        //this.context.camera.fov = this.context.camera.fov > 70 ? 70 : (this.context.camera.fov < 5 ? 5 : this.context.camera.fov);

        //this.context.cameraBranch.changeZoom(delta);
    }
});
