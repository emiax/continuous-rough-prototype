'use strict';
/*global CALC, THREE, $ */

(CALC.Label3D = function (renderer, $content, leftOffset, topOffset) {
    if (!renderer) { return; }

    THREE.Object3D.call(this);

    this.domElement = $('<div class="label3D"></div>');
    this.domElement.append($content);

    this.domX = -1;
    this.domY = 0;

    this.leftOffset = leftOffset || 0;
    this.topOffset = topOffset || 0;

    $(renderer.domElement).parent().append(this.domElement);

    //    console.log(this.domElement);

    this.opacity = 0.6;

    this.domElement.css({opacity: this.opacity/2}).hover(function() {$(this).css('opacity', this.opacity)}, function() {$(this).css('opacity', this.opacity/2)});
    this.projector = new THREE.Projector();
    // add dom element
}).extends(THREE.Object3D, {
    setOpacity: function(opacity) {
        this.opacity = opacity;
        this.domElement.css('opacity', this.opacity);
        if (this.opacity < 0.001) {
            this.domElement.css('display', 'none');
        } else {
            this.domElement.css('display', 'block');
        }
    },

    detach: function () {
        this.domElement.remove();
    },


    prepareFrame: function (renderer, force) {
        var scope = this, camera = renderer.camera, vect, $renderer, h, w, left, top;

        camera.updateMatrix();
        camera.updateMatrixWorld();

        this.updateMatrix();
        this.updateMatrixWorld();

        vect = this.projector.projectVector(this.matrixWorld.getPosition(), camera);
        //        console.log(camera.rotation);



        if (force || vect.x !== this.domX || vect.y !== this.domY) {
            $renderer = $(renderer.domElement);
            h = $renderer.innerHeight();
            w = $renderer.innerWidth();

            this.domX = vect.x;
            this.domY = vect.y;

            if (this.domX > 1 || this.domX < -1 || this.domY > 1 || this.domY < -1) {
                this.domElement.css({visibility: 'hidden'});
            } else {
                this.domElement.css({visibility: 'visible'});
            }

            left = w/2 * (1 + vect.x);
            top = h/2 * (1 - vect.y);

            this.domElement.css({
                left: left + scope.leftOffset,
                top: top + scope.topOffset
            });
        }
        //console.log(vect);
    }
});
