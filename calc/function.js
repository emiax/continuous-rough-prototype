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
  },
  tessellationDistance: {
  x: a CALC expression (may refer to exclusively symbols in the domain)
  y: a CALC.expression -"-
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
    this.tessellationDistance = spec.tessellationDistance || {};

}).extend({


    evaluate: function(input) {
        var scope = this, output = {};

        Object.keys(scope.values).forEach(function (k) {
            var v = scope.values[k];
            output[k] = v.evaluate(input);
        });

        return output;
    },


    getNonSpatialSymbols: function() {
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
    },


    tessellate: function() {
        var scope = this,
        domain = this.domain,
        values = this.values,
        tessellationDistance = this.tessellationDistance,
        p0, p1, r0, r1, n0, n1,
        i0, i1, parameters = {}, vertices = [], faces = [], extremes = {};

        this.makeMeshCompatible();
        var parameterNames = Object.keys(domain);

        p0 = parameterNames[0];
        p1 = parameterNames[1];

        // Assure that we have a resolution for both parameters
        if (typeof tessellationDistance === 'number') {
            r0 = tessellationDistance;
            r1 = tessellationDistance;
        } else {
            r0 = tessellationDistance[p0] || 10;
            r1 = tessellationDistance[p1] || 10;
        }


        //Calculate number of vertices and faces
        n0 = Math.ceil((domain[p0][1] - domain[p0][0]) / r0);
        n1 = Math.ceil((domain[p1][1] - domain[p1][0]) / r1);


        function addVertex(parameters) {
            var v = scope.evaluate(parameters);
            vertices.push(v);

            // Update extremes
            if (Object.keys(extremes).length === 0) {
                Object.keys(v).forEach(function (k) {
                    var w = v[k];
                    extremes[k] = [];
                    extremes[k][0] = w;
                    extremes[k][1] = w;
                });
            } else {
                Object.keys(v).forEach(function (k) {
                    var w = v[k];
                    if (w < extremes[k][0]) {
                        extremes[k][0] = v;
                    } else if (w > extremes[k][1]) {
                        extremes[k][1] = v;
                    }
                });
            }
        }

        // Create vertices

        for (i0 = 0; i0 < n0; i0++) {
            parameters[p0] = domain[p0][0] + r0 * i0;
            for (i1 = 0; i1 < n1; i1++) {
                parameters[p1] = domain[p1][0] + r1 * i1;
                addVertex(parameters);
            }
            parameters[p1] = domain[p1][1];
            addVertex(parameters);
        }

        parameters[p0] = domain[p0][1];
        for (i1 = 0; i1 < n1; i1++) {
            parameters[p1] = domain[p1][0] + r1 * i1;
            addVertex(parameters);


        }

        parameters[p1] = domain[p1][1];
        addVertex(parameters);

        // Create faces that references all the vertex indices

        for (i0 = 0; i0 < n0; i0++) {
            for (i1 = 0; i1 < n1; i1++) {
                faces.push([
                    i0*(n1 + 1) + i1 + 1,
                    (i0 + 1)*(n1 + 1) + i1 + 1,
                    (i0 + 1)*(n1 + 1) + i1
                ]);
                faces.push([
                    i0*(n1 + 1) + i1,
                    i0*(n1 + 1) + i1 + 1,
                    (i0 + 1)*(n1 + 1) + i1
                ]);

            }
        }

        return {
            vertices: vertices,
            extremes: extremes,
            faces: faces
        };
    }


});
