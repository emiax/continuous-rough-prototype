'use strict';
/*global CALC, THREE */

/* example spec object:
   xMin, xMax parameters are automatically generated


   {
   x: a CALC.Node
   y: a CALC.Node
   z: a CALC.Node
   domain: {
       u: an interval
       v: an interval
   },
   uniforms: {
       t: a number
   }
   attributes: {
       a: a CALC.Node
       b: a CALC.Node
   }
   
   resolution: {
       u: a number
       v: a number
   }
   constraints: {
       {
       '>': 2, 
       '<' 8,
       feather: 0.2
       }
   }
   appearance: new CALC.SurfaceAppearance({
       checker: {
           mode: 'darken'
           opacity: 0.1;
           x: 1
           y: 1
       }
       gradient: {
           parameter: z, y, z, or an attribute (eg. b)
           type: 'stretch' or 'absolute'
           0:   0x444393,
           0.5: 0x009434,
           1:   0x443487
       })
   }

   }


   }


*/

(CALC.ParametricSurface = function (spec) {
    var domain,
        resolution,
        constraints,
        parameterNames,
        parameters,
        orders,
        geometries,
        material,
        scope = this,
        p0, // symbol name of fist parameter
        p1, // symbol name of second parameter
        r0, // resolution of first parameter
        r1, // resolulton of second parameter
        n0, // number of samples of the first parameter
        n1 // number of samples of the second parameter
    
    if (spec) {
        domain = spec.domain;
        resolution = spec.resolution;
    } else {
        return;
    }
    
    this.vertices = [];
    this.faces = [];
    this.vertexAttributes = [];
    this.extremes = {};
    
    this.xExpr = spec.x;
    this.yExpr = spec.y;
    this.zExpr = spec.z;
    this.attributes = spec.attributes;

    this.constraints = spec.constraints;
    this.appearance = spec.appearance;


    parameterNames = Object.keys(domain);
    if (parameterNames.length !== 2) {
        throw new CALC.InvalidArgumentException();
    }

    p0 = parameterNames[0];
    p1 = parameterNames[1];

    // Assure that we have a resolution for both parameters
    if (typeof resolution === 'number') {
        r0 = resolution;
        r1 = resolution;
    } else {
        r0 = resolution[p0] || 10;
        r1 = resolution[p1] || 10;
    }
    

    /*
     * GEOMETRY
     */

    //Calculate number of vertices and faces
    n0 = Math.ceil((domain[p0][1] - domain[p0][0]) / r0);
    n1 = Math.ceil((domain[p1][1] - domain[p1][0]) / r1);

    
    // Walk through domain and generate vertices


    (function tesselate() {
        var i0, i1, parameters = {};
        // Create vertices
        for (i0 = 0; i0 < n0; i0++) {
            parameters[p0] = domain[p0][0] + r0 * i0;
            for (i1 = 0; i1 < n1; i1++) {
                parameters[p1] = domain[p1][0] + r1 * i1;
                scope.generateAttributes(parameters);
            }
            parameters[p1] = domain[p1][1];
            scope.generateAttributes(parameters);
        }
        
        parameters[p0] = domain[p0][1];
        for (i1 = 0; i1 < n1; i1++) {
            parameters[p1] = domain[p1][0] + r1 * i1;
            scope.generateAttributes(parameters);
        }
        
        parameters[p1] = domain[p1][1];
        scope.generateAttributes(parameters);
        
     
        // Create faces that references all the vertex indices
        for (i0 = 0; i0 < n0; i0++) {
            for (i1 = 0; i1 < n1; i1++) {
                scope.faces.push([
                    i0*(n1 + 1) + i1,
                    i0*(n1 + 1) + i1 + 1,
                    (i0 + 1)*(n1 + 1) + i1 + 1,
                    (i0 + 1)*(n1 + 1) + i1
                ]);
            }
        }
    })();
    
    /* 
     * Compare faces
     */
    function cmpFaces(a, b, axis) {
        var vertices = scope.vertices;
        return vertices[a[0]][axis] === vertices[b[0]][axis] ? 0 :
            vertices[a[0]][axis] < vertices[b[0]][axis] ? -1 :
            1;
    }

    // Create 6 differently sorted versions of the face lists (painter's algorithm stuff related to MultiSortObject)
    orders = [
        scope.faces.slice(0).sort(function (a, b) { return cmpFaces(a, b, 0); }),
        scope.faces.slice(0).sort(function (a, b) { return cmpFaces(a, b, 1); }),
        scope.faces.slice(0).sort(function (a, b) { return cmpFaces(a, b, 2); })
    ];
    (function reverseOrders() {
        for (var i = 0; i < 3; i++) {
            orders.push(orders[i].slice(0).reverse());
        }
    }());

    // Create 6 geometries
    geometries = [];
    (function createGeometries() {
        for (var g = 0; g < 6; g++) {

            var geo = new THREE.Geometry(),
            vertices = scope.vertices,
            faces = orders[g];
            
            scope.vertices.forEach(function (vertex) {
                geo.vertices.push(new THREE.Vector3(vertex[0], vertex[1], vertex[2]));
            });
            
            scope.faces.forEach(function (face) {
                geo.faces.push(new THREE.Face4(face[0], face[1], face[2], face[3]));
            });
            
            geo.computeCentroids();
            
            geometries[g] = geo;
        }
    }());
     
     /*
     * MATERIAL
     */


    // Create the material
    material = new CALC.SurfaceMaterial({
            // static parameters
            extremes: this.extremes,
            uniforms: this.uniforms,
            attributes: this.vertexAttributes,
            // properties that can change without regenerating the whole object
            constraints: this.constraints,
            appearance: this.appearance
        });


    /*
     * MULTISORT OBJECT
     */
    
    CALC.MultiSortObject.call(this, geometries, material);

}).extends(CALC.MultiSortObject, {

    

    /*
     * Generate attributes of a vertex (requires access to spec)
     */
    generateAttributes: function (parameters) {

        var x, y, z, attributes = {}, scope = this;

        Object.keys(parameters).forEach(function (k) {
            attributes[k] = parameters[k];
        });

        attributes.x = this.xExpr.evaluate(parameters);
        attributes.y = this.yExpr.evaluate(parameters);
        attributes.z = this.zExpr.evaluate(parameters);

        Object.keys(this.attributes).forEach(function (k) {
            attributes[k] = scope.attributes[k].evaluate(attributes);
        });
        
        //append vertices
        this.vertices.push([attributes.x, attributes.y, attributes.z]);
        

        //append vertex attributes
        Object.keys(attributes).forEach(function (k) {
            if (!scope.vertexAttributes[k]) {
                scope.vertexAttributes[k] = [];
            }
            scope.vertexAttributes[k].push(attributes[k]);
        });

        //console.log(attributes);

        //update extremes of surface
        this.updateExtremes(attributes, this.extremes);
    },

    /*
     * Update extreme values
     */
    updateExtremes: function (values, extremes) {
        if (Object.keys(this.extremes).length === 0) {
            Object.keys(values).forEach(function (k) {
                var v = values[k];
//                console.log(values);
                extremes[k] = [];
                extremes[k][0] = v;
                extremes[k][1] = v;
            });
        } else {
            Object.keys(values).forEach(function (k) {
                var v = values[k];
                if (v < extremes[k][0]) {
                    extremes[k][0] = v;
                } else if (v > extremes[k][1]) {
                    extremes[k][1] = v;
                }
            });
        }                         
    },


    setAppearance: function (appearance) {
        this.material.setAppearance(appearance);
    },


    setUniform: function (k, v) {
        this.material.uniforms[k].value = v;
    },


    setUniforms: function (spec) {
        Object.keys(spec).forEach(function (k) {
            this.setUniform(k, spec[k]);
        });
    }


});
