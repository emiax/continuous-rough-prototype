'use strict'
/*global CALC */

CALC.ParametricObject = (function (spec) {


    // if used in 'static' context for inheritance
    if (!spec) {
        return null;
    }

    this.functions = [];
    this.appearances = [];
    this.symbolTable = {};
    this.appearanceTable = [];

    this.object3D = null;
    this.materialManager = null;

    var scope = this;

    this.init(spec);
    var tessData = this.tessellate();

    // Create 6 geometries
    
    var geometry = new THREE.Geometry(),
    vertices = tessData.vertices,
    faces = tessData.faces;//orders[g];
            
    tessData.vertices.forEach(function (vertex) {
        geometry.vertices.push(new THREE.Vector3(vertex.x, vertex.y, vertex.z));
    });
            
    faces.forEach(function (face) {
        geometry.faces.push(new THREE.Face3(face[0], face[1], face[2]));
    });
            
    geometry.computeCentroids();
        


//    console.log(this.appearances);

    this.materialManager = new CALC.MaterialManager({
        appearances: this.appearances,
        vertices: tessData.vertices,
        attribs: tessData.attribs,
        symbolTable: this.symbolTable
    });
    var material = this.materialManager.getMaterial();

    this.mesh = new THREE.Mesh(geometry, material)
    console.log(this.mesh.geometry);
    this.mesh.doubleSided = true;
    this.add(this.mesh);

    this.faceSorter = new CALC.FaceSorter({
        vertices: tessData.vertices,
        faces: tessData.faces,
        host: this
    });
    



    
    
}).extends(THREE.Object3D, {


    /*
     * Set up translation tables for domain/value-variables -> shader symbols
     */
    init: function (spec) {
        var scope = this;

        var nextAttributeId = 0;
        var nextAppearanceId = 0;


        spec.forEach(function(v, k) { // Iterate through each function/appearance-combination

            scope.functions.push(v["function"]);

            // Build appearance table
            (function() {
                // Check if the appearance is already added.
                var found = false;
                scope.appearances.forEach(function (a, b) {
                    if (v["appearance"] === a) {
                        scope.appearanceTable.push(b);

                        found = true;
                        return;
                    }
                });

                // if this is the first occurrence of the appearance, add it to the list.
                if (!found) {
                    scope.appearanceTable.push(scope.appearances.length);
                    scope.appearances.push(v['appearance']);
                }
            }());

            // Build symbol table
            (function() {
                var symbols = v["function"].getNonSpatialSymbols();
                var occupiedAttribIDs = [];
                var i;
                for ( i = 0; i < symbols.length; i++) {
                    occupiedAttribIDs.push(false);
                }
                
                // no attrubute is occupied, so far.
                // set elements in the boolean array occupiedAttribIDs to true for the ids already used.
                
                symbols.forEach(function (s) {
                    if (typeof(scope.symbolTable[s]) !== 'undefined') {
                        occupiedAttribIDs[scope.symbolTable[s]] = true;
                    }
                });
                
                // iterate through the remaining symbols in the CALC.Function's image
                // try to fit the data into attribute ids that are not used by this CALC.Function.

                i = 0;
                for (var s = 0; s < symbols.length; s++) {
                    if (typeof(scope.symbolTable[symbols[s]]) === 'undefined') {
                        for (; i < occupiedAttribIDs.length && s < symbols.length; i++) {
                            if (!occupiedAttribIDs[i]) {
                                occupiedAttribIDs[i] = true;
                                scope.symbolTable[symbols[s]] = i; 
                                s++;
                            }
                        };
                        
                        // In the end, expand the symbol table if nessesary.
                        if (s < symbols.length) {
                            scope.symbolTable[symbols[s]] = nextAttributeId++;
                        }
                    }
                }
            }());

        });
    },


    /*
     * Tessellate the surface
     */
    tessellate: function() {
        var vertices = [], attribs = [], faces = [], extremes = [], offset = 0, scope = this;
        var symbolTable = scope.symbolTable;

        this.functions.forEach(function (v, k) {
            var tessData = v.tessellate(),
            length = tessData.vertices.length;


            tessData.vertices.forEach(function (vertexData) {
                
                var vertex = {};
                var attrib = {};
                
                Object.keys(scope.symbolTable).forEach(function (k) {
                    if (typeof vertexData[k] === 'undefined') {
                        attrib[symbolTable[k]] = 0;
                    } else {
                        attrib[symbolTable[k]] = vertexData[k];
                    }                    
                });
                vertex['appearance'] = scope.appearanceTable[k];
                
                vertex.x = vertexData.x;
                vertex.y = vertexData.y;
                vertex.z = vertexData.z;

                attribs.push(attrib);
                vertices.push(vertex);
            });


            tessData.faces.forEach(function (v) {
                faces.push([v[0] + offset, v[1] + offset, v[2] + offset]);
            });

            Object.keys(tessData.extremes).forEach(function (k) {
                if (typeof extremes[symbolTable[k]] === 'undefined') {
                    extremes[symbolTable[k]] = [0, 0];
                    extremes[symbolTable[k]][0] = tessData.extremes[k][0];
                    extremes[symbolTable[k]][1] = tessData.extremes[k][1];
                }
                if (tessData.extremes[k][0] < extremes[symbolTable[k]][0]) {
                    extremes[symbolTable[k]][0] = tessData.extremes[k][0];
                }
                if (tessData.extremes[k][1] > extremes[symbolTable[k]][1]) {
                    extremes[symbolTable[k]][1] = tessData.extremes[k][1];
                }
            });
            
            offset += length;
        });
//        console.log(vertices);
        
        return {
            vertices: vertices,
            attribs: attribs,
            faces: faces,
            extremes: extremes
        };
    },

    prepareFrame: function (renderer) {
        
        // TODO: update materials and stuffs

        this.materialManager.update();
        this.faceSorter.update(renderer.camera);
        
    },

});
