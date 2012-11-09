'use strict';
/*global CALC*/

(CALC.NavigationStrategy = function (renderer, branch) {
    this.renderer = renderer;
    this.branch = branch;
}).extends(CALC.MouseStrategy, {
    drag: function (event, path) {

        var len = path.length, lon, lat;
        if (len >= 2) {
            lon = path[len - 1].x - path[len - 2].x;
            lat = path[len - 1].y - path[len - 2].y;
            this.branch.rotation.z += lon * 0.01;
            this.branch.rotation.x += lat * 0.01;
        }
    },
    scroll: function (event, delta) {
        //console.log("zoom with " + delta);
        console.log(this.contextbranch);
        this.renderer.camera.fov -= delta * 5;
        //this.context.camera.fov = this.context.camera.fov > 70 ? 70 : (this.context.camera.fov < 5 ? 5 : this.context.camera.fov);

        //this.context.cameraBranch.changeZoom(delta);
        this.renderer.camera.updateProjectionMatrix();
    }
});
