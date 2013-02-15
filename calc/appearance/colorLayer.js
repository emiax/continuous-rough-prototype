'use strict'
/*global CALC */

(CALC.ColorLayer = function (color) {

    this.color = color;

}).extends(CALC.AppearanceLayer, {

    getNonSpatialSymbols: function() {
        return {};
    }
    getFragmentShaderChunk: function(context) {
        var glsl = "gl_FragColor = " + this.color.glslLiteral() + ";";
    }

});
