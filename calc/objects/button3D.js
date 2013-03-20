'use strict';
/*global CALC, THREE, $ */

(CALC.Button3D = function (renderer, $content, callback, leftOffset, topOffset) {
    THREE.Object3D.call(this);
    var scope = this;

    this.enabled = true;
    this.domElement = $('<div class="button3D"></div>');
    this.domElement.append($content);

    this.domElement.click(function() {
        if (scope.enabled) {
//            this.domElement.addClass();
            callback();
        }
    });

    this.domX = -1;
    this.domY = 0;

    this.leftOffset = -6; //leftOffset || 0;
    this.topOffset = -6; //topOffset || 0;

    $(renderer.domElement).parent().append(this.domElement);


//    console.log(this.domElement);
    
    this.domElement.css({opacity: 0.4}).hover(function() {
        if (scope.enabled) {
            $(this).css('opacity', 1);
        }
    }, function() { 
        if (scope.enabled) {
            $(this).css('opacity', 0.4);
        }
    });



    this.projector = new THREE.Projector();
    // add dom element
}).extends(CALC.Label3D, {
    setEnabled: function(e) {
        this.enabled = e;
    }

});
