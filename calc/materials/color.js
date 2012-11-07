CALC.Color = function(r, g, b, a) {

//    console.log(hex);

    if (a === undefined) {
        a = 255;
    }

    this.hex = function() {
        return r/255 << 16 + g/255 << 8/255 + b;
    };

    this.rgb = function () {
        return [r/255, g/255, b/255];
    };
    
    this.rgba = function() {
        return [r/255, g/255, b/255, a/255];
    };
    
    this.glslLiteral = function() {
        var rgba = this.rgba();

        return "vec4(" + 
            "float( " + rgba[0] + "), " +
            "float( " + rgba[1] + "), " +
            "float( " + rgba[2] + "), " +
            "float( " + rgba[3] + "))";
    }

};
