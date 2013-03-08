'use strict';
/*global CALC */


/* example spec object:
   
   z:
   domain: {
      x: [-10, 10],
      y: [-10, 10]
   },
   resolution: {
      x: 10,
      y: 10
   }
*/   
(CALC.FunctionSurface = function(spec) {

    var parametricSpec = {};

    if (!spec) {
        return;
    }
    
    parametricSpec.x = new CALC.Variable({symbol: 'x'});
    parametricSpec.y = new CALC.Variable({symbol: 'y'});
    parametricSpec.z = new CALC.Variable({symbol: 'z'});

    var valueDim = spec.z ? 'z' : spec.y ? 'y' : spec.x ? 'x' : false;
    if (valueDim) {
        parametricSpec[valueDim] = spec[valueDim];
    } else {
        throw new InvalidArgumentException();
    }

    parametricSpec.domain = spec.domain
    parametricSpec.attributes = spec.attributes;
    parametricSpec.uniforms = spec.uniforms;

    parametricSpec.resolution = spec.resolution;
    parametricSpec.appearance = spec.appearance;
    parametricSpec.constraints = spec.constraints;

    CALC.ParametricSurface.call(this, parametricSpec);

}).extends(CALC.ParametricSurface);