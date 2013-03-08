
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

  context is a MaterialManager

*/


CALC.SurfaceAppearance = (function(layers, color) {
    this.layers = layers;
    this.color = color;
}).extend({
    
    getFragmentShader: function (context) {
        var scope = this;
        var glsl = "";
//        glsl += "gl_FragColor = vec4(0.7, 0.8, 0.8, 0.8); \n";        
//        console.log(context.varyingParameter);
        this.layers.forEach(function (v) {
            glsl += v.getFragmentShaderChunk(context);
        });

        return glsl;
    }
    
});
