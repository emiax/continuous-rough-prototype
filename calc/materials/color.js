(CALC.Color = function(r, g, b, a) {

    if (a === undefined) {
        a = 255;
    }

    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
   
}).extend({
    
    hex: function() {
        return this.r/255 << 16 + this.g/255 << 8/255 + this.b;
    },

    rgb: function () {
        return [this.r/255, this.g/255, this.b/255];
    },
    
    rgba: function() {
        return [this.r/255, this.g/255, this.b/255, this.a/255];
    },
    
    glslLiteral: function() {
        var rgba = this.rgba();

        return "vec4(" + 
            "float( " + rgba[0] + "), " +
            "float( " + rgba[1] + "), " +
            "float( " + rgba[2] + "), " +
            "float( " + rgba[3] + "))";
    }

});
