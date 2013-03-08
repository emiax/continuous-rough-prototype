/* Example input 

   spec = [
      x: {
         distance: 10,
      },
      y: {
         distance: 10,
         offset: 5
      },
      color: 0x33ffffff
   ]


*/

(CALC.CheckerPattern = function (spec) {
    var params = [],
        color = spec.color,
        opacity = spec.opacity;
    
    delete spec.color;
    delete spec.opacity;

    Object.keys(spec).forEach(function(k) {
        var v, distance, offset;
        v = spec[k];
        
        if (v !== "color") { 
            if (typeof v === 'number') {
                distance = v;
                offset = 0;
            } else {
                distance = v.distance || 1.0;
                offset = v.offset || 0.0;
            }

            params.push({
                parameter: k,
                distance: distance,
                offset: offset
            });
        }
    });
    
    this.forEachParameter = function(fn) {
        Object.keys(params).forEach(function(p) {
            var v = params[p];
            fn(v.parameter, v.distance, v.offset);
        });
    }

    this.color = function() {
        return color;
    }

    this.opacity = function() {
        return opacity;
    }

});
