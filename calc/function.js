'use strict'
/*global CALC */

/*
  Example input
  spec = {
     domain: {
       x: [-10, 10], 
       y: [-5, 5]
     },
     values: {
       z: a CALC expression,
       u: a CALC expression
     },
     constraints: {
        u: [-1, 2]
        z: [-10, 10]
     }
  }
  
  at least two symbols of x, y, z must be defined in either 'domain' or 'values'
  if the function is to be inserted into a 3D-mesh.

  The third symbol (if not defined) will automatically be set to zero everywhere.
  
*/
(CALC.Function = function(spec) {
    
    this.domain = spec.domain || {},
    this.values = spec.values || {},
    this.constraints = spec.constraints || {};
    
}).extend({
    evaluate: function(input) {
        var scope = this, output = {};

        Object.keys(scope.values).forEach(function (k) {
            var v = scope.values[k];
            output[k] = v.evaluate(input);
        });

        return output;
    },
    getNonSpacialSymbols: function() {
        var scope = this, symbols = [];
      
        Object.keys(scope.domain).forEach(function (k) {
            if (k !== 'x' && k !== 'y' && k !== 'z') {
                symbols.push(k);
            }
        });
        Object.keys(scope.values).forEach(function (k) {
            if (k !== 'x' && k !== 'y' && k !== 'z') {
                symbols.push(k);
            }
        });
        return symbols;
    },
    makeMeshCompatible: function() {
        var domain = this.domain,
            values = this.values,
            nSymbols3D = !!domain.x + !!domain.y + !!domain.z + !!values.x + !!values.y + !!values.z;

        if (Object.keys(domain).length !== 2) {
            throw new Exception("Function must have exactly 2 domain variables to serve as a 3D mesh");
        }

        if (nSymbols3D === 3) {
            return;
        } else if (nSymbols3D === 2) {
            if (!domain.z || !values.z) {
                values.z = 0;
            } else if (!domain.y || !values.y) {
                values.y = 0;
            } else {
                values.x = 0;
            }
        } else if (nSymbols3D < 2) {
            throw new Exception("Function must have at least 2 spacial symbols to become a 3D-mesh");
        } else {
            throw new Exception("Invalid function");
        }
    }
});
