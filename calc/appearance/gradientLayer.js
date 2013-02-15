'use strict'
/*global CALC */

CALC.GradientLayer = (function (parameter, gradient, mode) {

    this.parameter = parameter;
    this.gradient = gradient;
    this.mode = mode;

}).extends(CALC.AppearanceLayer, {

    getNonSpatialSymbols: function() {
        return {};
    },

    getFragmentShaderChunk: function(context) {

        var gradient = this.gradient,
            param = context.varyingParameter(this.colorGradientParameter),
            glsl,
            positionA,
            positionB;

        gradient.forEachColor(function (position, color) {
            positionB = positionA;
            positionA = position;

            if (glsl) {
                glsl += "gl_FragColor = mix(gl_FragColor, " + color.glslLiteral() + "," +
                    "smoothstep(float(" + positionB + "), float(" + positionA + "), " + param + "));\n";
            } else {
                // if this is the first iteration
                glsl = "gl_FragColor = " + color.glslLiteral() + ";\n";
            }
        });

        console.log(glsl);
        
        return glsl;

        

        
    }

});
