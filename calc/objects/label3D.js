'use strict';
/*global CALC, THREE, $ */

(CALC.Label3D = function (renderer, $content) {
    THREE.Object3D.call(this);

    this.domElement = $('<div class="label3D"></div>');
    this.domElement.append($content);

    this.domX = -1;
    this.domY = 0;

    $(renderer.domElement).parent().append(this.domElement);

    this.domElement.css({opacity: 0.6});
    this.projector = new THREE.Projector();
    // add dom element
}).extends(THREE.Object3D, {
    prepareFrame: function (renderer, force) {
        var camera = renderer.camera, vect, $renderer, h, w, left, top;

        this.updateMatrix();
        this.updateMatrixWorld();

        camera.updateMatrix();
        camera.updateMatrixWorld();


        //console.log(this.matrixWorld.getPosition());
        vect = this.projector.projectVector(this.matrixWorld.getPosition(), renderer.camera);


        if (force || vect.x !== this.domX || vect.y !== this.domY) {
            $renderer = $(renderer.domElement);
            h = $renderer.innerHeight();
            w = $renderer.innerWidth();

            this.domX = vect.x;
            this.domY = vect.y;

            //console.log(vect);
            if (this.domX > 0.5 || this.domX < -0.5 || this.domY > 0.5 || this.domY < -0.5) {
                this.domElement.css({visibility: 'hidden'});
                //console.log(this.domX + " " + this.domY);
            } else {
                this.domElement.css({visibility: 'visible'});
            }

            left = w*vect.x + w/2;
            top = -h*vect.y + h/2;

            this.domElement.css({
                left: left,
                top: top
            });
        }
        //console.log(vect);
    }
});
