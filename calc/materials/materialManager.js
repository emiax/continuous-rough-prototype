CALC.MaterialManager = (function(spec) {
    var scope = this;
    this.fragmentShader = "";

    this.appearances = spec.appearances;
    this.vertices = spec.vertices;
    this.attribs = spec.attribs;

    this.attributeKeys = Object.keys(spec.attribs[0]);
    

    //this.material = new THREE.MeshBasicMaterial({color: 0xff0000});
    //this.material.opacity = 0.5;


    this.material = new THREE.ShaderMaterial({
        fragmentShader: this.generateFragmentShader(),
        vertexShader: this.generateVertexShader(),
        attributes: this.generateAttributes(),
        alphaTest: 1.0,
        depthTest: true
    });

    console.log(this.material);

}).extend({


    generateFragmentShader: function() {
        var glsl = '';
        var scope = this;
        glsl += this.glslVaryingDefinitions();
        glsl += "void main() {\n";
        
        glsl += "gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n";
        this.appearances.forEach(function(a, k) {

            glsl += 'if (abs(vAppearance - float(' + k + ')) < 0.1) { \n';
            glsl += a.getFragmentShader(scope);
            
            glsl += '}\n';
        });
        

        glsl += "}\n"
        console.log(glsl);

        return glsl; 
    },

    generateVertexShader: function () {
        var glsl = "";

 //       glsl += this.glslUniformDefinitions();
        glsl += this.glslAttributeDefinitions();
        glsl += this.glslVaryingDefinitions();

        glsl += "void main() {\n";
        glsl += "  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n";

        glsl += this.glslVaryingAssignments();
        
        glsl += "  gl_Position = projectionMatrix * mvPosition;\n";
        glsl += "}\n";

        return glsl;
    },
    
    glslAttributeDefinitions: function () {
        glsl = "";
        var scope = this;

        this.attributeKeys.forEach(function (k) {
            glsl += 'attribute float ' + scope.attributeParameter(k) + ';\n';
        });
        
        glsl += 'attribute float aAppearance;\n';

        return glsl;
    },


    glslVaryingDefinitions: function () {
        glsl = "";
        var scope = this;

        this.attributeKeys.forEach(function (k) {
            glsl += 'varying float ' + scope.varyingParameter(k) + ';\n';
        });

        glsl += 'varying float vAppearance;\n';

        return glsl;
    },


    /**
     * Assign values from attributes to varyings
     */

    glslVaryingAssignments: function () {
        var scope = this, glsl = "";

        Object.keys(this.attributeKeys).forEach(function (k) {
            var v = scope.attributeKeys[k];

            glsl += scope.varyingParameter(v) + " = " + scope.attributeParameter(v) + ";\n";
           // glsl += scope.varyingParameter(v) + " = 1.0;\n";
        });
        glsl += 'vAppearance = aAppearance;\n';

                
        return glsl;
    },


    generateAttributes: function() {
        var attribArray = [];
        var nAttributes = this.attributeKeys.length;
        console.log(nAttributes);
        var i = 0;
        for (i = 0; i < nAttributes; i++) {
            var ap = this.attributeParameter(i);
            attribArray[ap] = {};
            attribArray[ap].type = 'double';
            attribArray[ap].value = [];
            this.attribs.forEach(function (v) {
                attribArray[ap]['value'].push(v[i]);
            });
        }
        
        attribArray.aAppearance = {};
        attribArray.aAppearance.type = 'double';
        attribArray.aAppearance.value = [];
        
        this.vertices.forEach(function (v) {
            attribArray.aAppearance.value.push(v.appearance);
        });

        console.log(attribArray.appearance);
        console.log(attribArray);
        


        return attribArray;
    },
    
    getMaterial: function () {
        return this.material;
    },


    update: function () {
//        console.log('updatieng');
    },




    
    
    /*******************************************
     * Translations for names used in shaders *
     ******************************************/

    /**
     * Variable name generation for uniforms
     */


    min: function (parameter) {
        return "uMin_" + this.symbolTable[parameter];
    },

    max: function (parameter) {
        return "uMax_" + this.symbolTable[parameter];
    },

    upperConstraint: function (parameter) {
        return "uUpper_" + this.symbolTable[parameter];
    },

    lowerConstraint: function (parameter) {
        return "uLower_" + this.symbolTable[parameter];
    },

    upperFeather: function (parameter) {
        return "uFeatherLower_" + this.symbolTable[parameter];
    },

    lowerFeather: function (parameter) {
        return "uFeatherUpper_" + this.symbolTable[parameter];
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
        return "aParameter_" +  parameter;
    },


    varyingParameter: function(parameter) {
        return "vParameter_" + parameter;
    }

});
