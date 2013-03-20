'use strict';
/*global CALC, THREE, $ */

(CALC.AxisLabel3D = function (renderer, $content, leftOffset, topOffset) {
    THREE.Object3D.call(this);

    this.domElement = $('<div class="axisLabel3D"></div>');
    this.domElement.append($content);

    this.domX = -1;
    this.domY = 0;

    this.leftOffset = leftOffset || 0;
    this.topOffset = topOffset || 0;

    $(renderer.domElement).parent().append(this.domElement);

//    console.log(this.domElement);
    
    this.domElement.css({opacity: 0.6}).hover(function() {$(this).css('opacity', 1)}, function() {$(this).css('opacity', 0.6)});
    this.projector = new THREE.Projector();
    // add dom element
}).extends(CALC.Label3D, {});
