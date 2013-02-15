
'use strict'
/*global CALC */

/*
  Example input
  layers = [
     a CALC.FeatherLayer
     a CALC.ColorLayer object or a CALC.GradientLayer object,
     a CALC.CheckerLayer object
     a CALC.PhongLayer object
  ]

*/


CALC.SurfaceAppearance = (function(layers) {
    this.layers = layers;
}).extend({
    
    getFragmentShader: function (context) {
        var glsl = "";
        this.layers.forEach(function (v) {
            glsl += 
        });
    }
    
});
