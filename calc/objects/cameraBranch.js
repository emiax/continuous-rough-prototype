'use strict';
/*global CALC, THREE */

(CALC.CameraBranch = function () {
    var camera;
    

    camera = new THREE.PerspectiveCamera(45, 1, 0.001, 20000000);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    this.add(camera);
    this.camera = camera

    this.zoom = 0.7;
    this._zoom = 0;

    this.perspective = 1;
    this._perspective = 0;


}).extends(THREE.Object3D, {
    
    updateCamera: function() {
//        console.log(this);
        var camera, dist, perspective, zoom;

        this.zoom = Math.max(0.000001, Math.min(100, this.zoom));
        this.perspective = Math.max(0.01, Math.min(1, this.perspective));

        perspective = this.perspective;
        zoom = this.zoom;

        camera = this.camera;
        dist = 1/perspective * zoom;

        camera.position.y = -dist * 15;
        camera.fov = Math.atan(perspective) / Math.PI * 180;
        camera.updateProjectionMatrix();
        
        this._perspective = this.perspective;
        this._zoom = this.zoom;
        

    },

    changeZoom: function (delta) {
        this.zoom *= (1 + delta/2);
    },


    prepareFrame: function () {
        if (this.perspective !== this._perspective || this.zoom !== this._zoom) {
            this.updateCamera();
//            $('header').html(this.zoom + " " + this.perspective);
        }
    }
    



});