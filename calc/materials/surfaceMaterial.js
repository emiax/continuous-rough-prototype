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

    var scope = this;

    this.appearance = spec.appearance;

    this.parameters = Object.keys(spec.attributes);
    this.constraints = spec.constraints;
    this.extremes = spec.extremes;
    this.attributes = [];
    this.uniforms = [];
    console.log(scope);        

    /* 
     *  Generate uniforms based on constraints
     */  
    this.parameters.forEach(function (p) {

        var c = scope.constraints[p];
        var e = scope.extremes[p];
        
        if (!c) {
            c = {};
        };
        
        var lc = c['lower'] !== undefined ? c['lower'] : (e[0] - 1);
        var uc = c['upper'] !== undefined ? c['upper'] : (e[1] + 1);
        var lf = c['lowerFeather'] !== undefined ? c['lowerFeather'] : 0;
        var uf = c['upperFeather'] !== undefined ? c['upperFeather'] : 0;

        scope.uniforms[scope.lowerConstraint(p)] = {type: 'f', value: lc};
        scope.uniforms[scope.upperConstraint(p)] = {type: 'f', value: uc};

        scope.uniforms[scope.lowerFeather(p)] = {type: 'f', value: lf};
        scope.uniforms[scope.upperFeather(p)] = {type: 'f', value: uf};
    });



    Object.keys(spec.attributes).forEach(function (k) { 
        scope.attributes[scope.attributeParameter(k)] = {type: 'f', value: spec.attributes[k]};
    });

    var colorGradient = this.appearance.colorGradient;
    var colorGradientParameter = this.appearance.colorGradientParameter;
    var checkerPattern = this.appearance.checkerPattern;

    this.colorGradient = colorGradient instanceof CALC.ColorGradient ? colorGradient : new CALC.ColorGradient(colorGradient);
    this.colorGradientParameter = colorGradientParameter;
    this.checkerPattern = checkerPattern instanceof CALC.CheckerPattern ? checkerPattern : new CALC.CheckerPattern(checkerPattern);

    scope.uniforms[scope.checkerOpacity()] = {type: 'f', value: this.checkerPattern.opacity()};

    var fs = this.generateFragmentShader(),
        vs = this.generateVertexShader();

    THREE.ShaderMaterial.call(this, {
        fragmentShader: fs, //THREE.ShaderLib.basic.fragmentShader, //fragmentShader,
        vertexShader: vs,// //vertexShader,
        uniforms: this.uniforms,
        attributes: this.attributes,
        alphaTest: 1.0,
        depthTest: true
    });

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

    checkerOpacity: function () {
        return "uCheckerOpacity";
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
        glsl += "uniform float " + this.checkerOpacity() + ";\n";

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

        glsl += "varying vec3 vNormal;";

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
                    "smoothstep(float(" + positionB + "), float(" + positionA + "), " + param + "));\n";
            } else {
                // if this is the first iteration
                glsl = "gl_FragColor = " + color.glslLiteral() + ";\n";
            }
        });

        console.log(glsl);
        
        return glsl;
    },


    /**
     * GLSL Code for checker pattern
     */
    glslApplyCheckerPattern: function() {

        var pattern = this.checkerPattern;
        var scope = this;

        var glsl = "gl_FragColor.rgb = mix(gl_FragColor.rgb, " + pattern.color().glslLiteral() + ".rgb, " + scope.checkerOpacity() + "*floor(mod(0.0";
        pattern.forEachParameter(function(parameter, distance, offset) {
            glsl += " + floor((float(" + scope.varyingParameter(parameter) + ") - float(" + offset + ")) / float(" + distance + "))"; 
        });
        glsl += ", 2.0)));"
        
//        glsl = "gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0, 0.0, 0.0), float(" + pattern.opacity() + "));";
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
        glsl += "  vNormal = (modelViewMatrix*vec4(normal, 1.0)).xyz;";

        //glsl += " gl_Position += vec4(vNormal*10.0, 0.0);";
        glsl += "}\n";

        return glsl;
    },

    glslDiscard: function() {
        return "if (gl_FragColor.a < 0.0001) { discard; }\n";
    },


    /**
     * Generate fragment shader code
     */
    generateFragmentShader: function () {
        var glsl = "";
        var parameters = this.parameters;

        glsl += this.glslUniformDefinitions(parameters);
        glsl += this.glslVaryingDefinitions(parameters);

        glsl += "vec3 applyLight(vec3 color, float intensity, vec3 direction, vec3 normal) {";        
        glsl += "vec3 diffuse = intensity * (color * clamp(dot(normalize(direction), normal), 0.0, 1.0));";
        glsl += "return diffuse;";
        glsl += "}";
        


        glsl += "void main() {\n";
        
        glsl += this.glslApplyColorGradient();
        glsl += this.glslApplyCheckerPattern();
        glsl += this.glslApplyConstraints();

        glsl += this.glslDiscard();

        glsl += "vec3 normal = normalize(vNormal);";
       // glsl += "if (!gl_FrontFacing) { normal *= -1.0; }";
/*
        glsl += "vec3 lightColor = vec3(1.0, 1.0, 1.0);";
        glsl += "float lightIntensity = 1.0;";
        glsl += "vec3 lightDirection = normalize(vec3(1.0, 1.0, 0.0));";
        glsl += "vec3 diffuse = lightIntensity * (lightColor * clamp(dot(lightDirection, normal), 0.0, 1.0));";
        glsl += "gl_FragColor.rgb *= diffuse;";
*/
        /*
        glsl += "lightColor = vec3(1.0, 1.0, 1.0);";
        glsl += "lightIntensity = 1.0;";
        glsl += "lightDirection = normalize(vec3(1.0, 1.0, 1.0));";
        glsl += "diffuse = lightIntensity * (lightColor * clamp(dot(lightDirection, normal), 0.0, 1.0));";
        glsl += "gl_FragColor.rgb *= diffuse;";
*/
       //glsl += "vec4 faceColor = gl_FragColor.rgb;";

        glsl += "vec3 component1 = (applyLight(vec3(1.0, 1.0, 1.0), 0.3, vec3(-1.0, -1.0, -0.4), normal));";
        glsl += "vec3 component2 = (applyLight(vec3(1.0, 1.0, 1.0), 0.3, vec3(1.0, 1.0, -0.4), normal));";
        glsl += "vec3 ambient = vec3(0.5, 0.5, 0.5);";
        
        
        //glsl += "gl_FragColor.rgb *= component1 + component2);";
        glsl += "gl_FragColor.rgb *= (ambient + component1 + component2);";


        glsl += "}";
        return glsl;
    }

});
