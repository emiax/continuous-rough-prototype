'use strict';
/*global CALC, THREE */

/*

 Example spec = {
    extremes {

    }, 
    uniforms {

    },
    attributes {

    },


    constraints: {
    {
       x : {
         lower: 2, 
         upper: 8,
         lowerFeather: 0.2,
         upperFeather: 0.8
       }
   }
   appearance {
      checkerPattern: {
          opacity: 0;
          color: 0xff00ff00
          x: 1
          y: 1
       },
       colorGradient: {
          mode: stretch,
          0:   0x444393,
          0.5: 0x009434,
          1:   0x443487
       },
       colorGradientParameter: 'x'

    }
 }

 */


(CALC.SurfaceMaterial = function (spec) {

    var uniforms = [],
    scope = this;

    this.appearance = spec.appearance;

    console.log(spec);
    this.parameters = Object.keys(spec.attributes);
    this.constraints = spec.constraints;
    this.extremes = spec.extremes;
    this.attributes = [];
    console.log(spec.extremes);
    console.log(spec.constraints);


    /* 
     *  Generate uniforms based on constraints
     */  
    this.parameters.forEach(function (p) {

        var c = scope.constraints[p];
        var e = scope.extremes[p];
        
        if (!c) { c = {} };
//        console.log(p);
//        console.log(c);
        
        var lc = c['lower'] !== undefined ? c['lower'] : (e[0] - 1);
        var uc = c['upper'] !== undefined ? c['upper'] : (e[1] + 1);
        var lf = c['lowerFeather'] !== undefined ? c['lowerFeather'] : 0;
        var uf = c['upperFeather'] !== undefined ? c['upperFeather'] : 0;

//        console.log(lx
        
        scope.uniforms[scope.lowerConstraint(p)] = {type: 'f', value: lc};
        console.log(scope.uniforms);
        scope.uniforms[scope.upperConstraint(p)] = {type: 'f', value: uc};

        scope.uniforms[scope.lowerFeather(p)] = {type: 'f', value: lf};
        scope.uniforms[scope.upperFeather(p)] = {type: 'f', value: uf};
    });


    console.log(scope.uniforms);

    Object.keys(spec.attributes).forEach(function (k) { 
        scope.attributes[scope.attributeParameter(k)] = {type: 'f', value: spec.attributes[k]};
    });

    console.log(this.attributes);


    var colorGradient = this.appearance.colorGradient;
    var colorGradientParameter = this.appearance.colorGradientParameter;
    var checkerPattern = this.appearance.checkerPattern;

    this.colorGradient = colorGradient instanceof CALC.ColorGradient ? colorGradient : new CALC.ColorGradient(colorGradient);
    this.colorGradientParameter = colorGradientParameter;
    this.checkerPattern = checkerPattern instanceof CALC.CheckerPattern ? checkerPattern : new CALC.CheckerPattern(checkerPattern);

    var fs = this.generateFragmentShader(),
        vs = this.generateVertexShader();

    console.log(this.attributes);

    THREE.ShaderMaterial.call(this, {
        fragmentShader: fs, //THREE.ShaderLib.basic.fragmentShader, //fragmentShader,
        vertexShader: vs,// //vertexShader,
        uniforms: this.uniforms,
        attributes: this.attributes,
        alphaTest: 1.0,
        depthTest: true
    });

    console.log(spec.attributes);
    
    console.log(vs);
    console.log(fs);

}).extends(THREE.ShaderMaterial, {


    /**
     * Variable name generation for uniforms
     */

    min: function (parameter) {
        return "uMin_" + parameter;
    },

    max: function (parameter) {
        return "uMax_" + parameter;
    },

    upperConstraint: function (parameter) {
        return "uUpper_" + parameter;
    },

    lowerConstraint: function (parameter) {
        return "uLower_" + parameter;
    },

    upperFeather: function (parameter) {
        return "uFeatherLower_" + parameter;
    },

    lowerFeather: function (parameter) {
        return "uFeatherUpper_" + parameter;
    },

    checkerColor: function () {
        return "uCheckerColor";
    },

    checkerAlpha: function () {
        return "uCheckerAlpha";
    },

    /**
     * GLSL variable name generation : Attributes
     */

    attributeParameter: function (parameter) {
        return "aParameter_" + parameter;
    },


    /**
     * GLSL variable name generation : Varyings
     */

    varyingParameter: function (parameter) {
        return "vParameter_" + parameter;
    },


    /**
     * Define nesesary glsl uniforms
     */

    glslUniformDefinitions: function () {
        var scope = this, glsl = "";

        glsl += "uniform float " + this.checkerColor() + ";\n";
        glsl += "uniform float " + this.checkerAlpha() + ";\n";

        Object.keys(this.parameters).forEach(function (k) {
            var v = scope.parameters[k];
            glsl += "uniform float " + scope.min(v) + ";\n";
            glsl += "uniform float " + scope.max(v) + ";\n";
            glsl += "uniform float " + scope.upperConstraint(v) + ";\n";
            glsl += "uniform float " + scope.lowerConstraint(v) + ";\n";
            glsl += "uniform float " + scope.upperFeather(v) + ";\n";
            glsl += "uniform float " + scope.lowerFeather(v) + ";\n";
        });

        return glsl;
    },


    /**
     * Define nesesary glsl attributes
     */

    glslAttributeDefinitions: function () {
        var scope = this, glsl = "";

        Object.keys(this.parameters).forEach(function (k) {
            var v = scope.parameters[k];
            
            glsl += "attribute float " + scope.attributeParameter(v) + ";\n";
        });

        return glsl;
    },


    /**
     * Define nesesary glsl varyings
     */

    glslVaryingDefinitions: function () {
        var scope = this, glsl = "";

        Object.keys(this.parameters).forEach(function (k) {
            var v = scope.parameters[k];
            glsl += "varying float " + scope.varyingParameter(v) + ";\n";
        });

        return glsl;
    },


    /**
     * Assign values from attributes to varyings
     */

    glslVaryingAssignments: function () {
        var scope = this, glsl = "";

        Object.keys(this.parameters).forEach(function (k) {
            var v = scope.parameters[k];

            glsl += scope.varyingParameter(v) + " = " + scope.attributeParameter(v) + ";\n";
           // glsl += scope.varyingParameter(v) + " = 1.0;\n";
        });
        
        console.log(glsl);
        
        return glsl;
    },

    /**
     * GLSL code for feather and discarding fragments with respect to a parameter
     */
    glslApplyConstraints: function () {
        var glsl = "float constraintsOpacity = 1.0;\n";
        var scope = this;
        Object.keys(this.parameters).forEach(function (k) {

            var v = scope.parameters[k];
            var lc, lf, uc, uf, vp;

            lc = scope.lowerConstraint(v);
            lf = scope.lowerFeather(v);
            uc = scope.upperConstraint(v);
            uf = scope.upperFeather(v);
            vp = scope.varyingParameter(v);

            glsl += "constraintsOpacity *= smoothstep(" + lc + " - " + lf + "*0.5, " + lc + " + " + lf + "*0.5, " + vp + ");\n";
            glsl += "constraintsOpacity *= (1.0 - smoothstep(" + uc + " - " + uf + "*0.5, " + uc + " + " + uf + "*0.5, " + vp + "));\n";

        });
        glsl += "gl_FragColor.a *= constraintsOpacity;\n";
        console.log(glsl);
        return glsl;
    },


    /**
     * GLSL code for color gradient
     */
    glslApplyColorGradient: function () {

        
        
        var gradient = this.colorGradient,
            param = this.varyingParameter(this.colorGradientParameter),
            glsl,
            positionA,
            positionB;

        gradient.forEachColor(function (position, color) {
            positionB = positionA;
            positionA = position;

            if (glsl) {
                glsl += "gl_FragColor = mix(gl_FragColor, " + color.glslLiteral() + "," +
                    "smoothstep(float(" + positionA + "), float(" + positionB + "), " + param + "));\n";
            } else {
                // if this is the first iteration
                glsl = "gl_FragColor = " + color.glslLiteral() + ";\n";
            }
        });

        return glsl;
    },


    /**
     * GLSL Code for checker pattern
     */
    glslApplyCheckerPattern: function() {

        var pattern = this.checkerPattern;
        var scope = this;

        console.log(pattern.opacity());
        console.log(pattern.color().glslLiteral());
        var glsl = "gl_FragColor.rgb = mix(gl_FragColor.rgb, " + pattern.color().glslLiteral() + ".rgb, float(" + pattern.opacity() + ")*floor(mod(0.0";
        pattern.forEachParameter(function(parameter, distance, offset) {
            glsl += " + floor((float(" + scope.varyingParameter(parameter) + ") - float(" + offset + ")) / float(" + distance + "))"; 
        });
        glsl += ", 2.0)));"
        
//        glsl = "gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0, 0.0, 0.0), float(" + pattern.opacity() + "));";
        console.log(glsl);
        
        return glsl;
    },


    /**
     * Generate vertex shader code
     */
    generateVertexShader: function () {
        var glsl = "";
        var parameters = this.parameters;
        glsl += this.glslUniformDefinitions(parameters);
        glsl += this.glslAttributeDefinitions(parameters);
        glsl += this.glslVaryingDefinitions(parameters);

        glsl += "void main() {\n";
        glsl += "  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n";

        glsl += this.glslVaryingAssignments(parameters);
        
        glsl += "  gl_Position = projectionMatrix * mvPosition;\n";
        glsl += "}\n";

        return glsl;
    },


    /**
     * Generate fragment shader code
     */
    generateFragmentShader: function () {
        var glsl = "";
        var parameters = this.parameters;

        glsl += this.glslUniformDefinitions(parameters);
        glsl += this.glslVaryingDefinitions(parameters);

        glsl += "void main() {\n";
        
        glsl += this.glslApplyColorGradient();
        glsl += this.glslApplyCheckerPattern();
        glsl += this.glslApplyConstraints();

        
        glsl += "}";
        return glsl;
    }

});
