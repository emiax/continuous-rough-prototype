CALC.buildFunctionSurface = function (expr, boundingRect, resolution, material) {

    var x = new CALC.Variable({symbol: 'x'});
    var y = new CALC.Variable({symbol: 'y'});

    return CALC.buildParametricSurface(x, y, expr, {x: [boundingRect[0], boundingRect[2]], y: [boundingRect[1], boundingRect[3]]}, null, resolution, material);

};


CALC.buildParametricSurface = function (x, y, z, domain, range, resolution, material) {

    this.xExpr = x;
    this.yExpr = y;
    this.zExpr = z;

    var v0, v1, boundingBox = null;
    resolution = resolution || 10;

    if (x && y && z && domain) {

        var parameters = [];
        for (p in domain) {
            if (domain.hasOwnProperty(p)) {
                parameters.push(p);
            }
        }

        if (parameters.length != 2) {
            throw new CALC.InvalidArgumentException();
        }

        var res0 = resolution, res1 = resolution, i = 0,
        p0 = parameters[0], p1 = parameters[1], variables = {};

        var updateBoundingBox = function (vector) {
            var x = vector.x,
            y = vector.y,
            z = vector.z;

            if (!boundingBox) {
                boundingBox = {min: new THREE.Vector3(x, y, z), max: new THREE.Vector3(x, y, z)};
            } else {
                if (x < boundingBox.min.x) {
                    boundingBox.min.x = x;
                } else if (x > boundingBox.max.x) {
                    boundingBox.max.x = x;
                }
                if (y < boundingBox.min.y) {
                    boundingBox.min.y = y;
                } else if (y > boundingBox.max.y) {
                    boundingBox.max.y = y;
                }
                if (z < boundingBox.min.z) {
                    boundingBox.min.z = z;
                } else if (z > boundingBox.max.z) {
                    boundingBox.max.z = z;
                }
            }
        };

        var faces = [], vertices, x0, x1, x2, x3, y0, u1, y2, y3, z0, z1, z2, z3, u0, u1, u2, u3;
        for (v0 = domain[p0][0]; v0 < domain[p0][1]; v0 += res0) {
            for (v1 = domain[p1][0]; v1 < domain[p1][1]; v1 += res1) {
                vertices = [];

                variables[p0] = v0;
                variables[p1] = v1;
                x0 = this.xExpr.evaluate(variables);
                y0 = this.yExpr.evaluate(variables);
                z0 = this.zExpr.evaluate(variables);

                variables[p0] = v0 + res0;
                x1 = this.xExpr.evaluate(variables);
                y1 = this.yExpr.evaluate(variables);
                z1 = this.zExpr.evaluate(variables);

                variables[p1] = v1 + res1;
                x2 = this.xExpr.evaluate(variables);
                y2 = this.yExpr.evaluate(variables);
                z2 = this.zExpr.evaluate(variables);

                variables[p0] = v0;
                x3 = this.xExpr.evaluate(variables);
                y3 = this.yExpr.evaluate(variables);
                z3 = this.zExpr.evaluate(variables);

                u0 = new THREE.Vector3(x0, y0, z0);
                updateBoundingBox(u0);
                vertices.push(new THREE.Vertex(u0));

                u1 = new THREE.Vector3(x1, y1, z1)
                updateBoundingBox(u1);
                vertices.push(new THREE.Vertex(u1));

                u2 = new THREE.Vector3(x2, y2, z2);
                updateBoundingBox(u2);
                vertices.push(new THREE.Vertex(u2));

                u3 = new THREE.Vector3(x3, y3, z3);
                updateBoundingBox(u3);
                vertices.push(new THREE.Vertex(u3));

                faces.push(vertices);
            }
        }

        var facesXasc = faces.slice(0),
        facesYasc = faces.slice(0);
        facesZasc = faces.slice(0);

        var cmpFace = function (a, b, axis) {
            return a[0].position[axis] === b[0].position[axis] ? 0 :
                a[0].position[axis] < b[0].position[axis] ? -1 :
                1;
        };

        facesXasc.sort(function(a, b) { return cmpFace(a, b, 'x') });
        facesYasc.sort(function(a, b) { return cmpFace(a, b, 'y') });
        facesZasc.sort(function(a, b) { return cmpFace(a, b, 'z') });

        var facesXdesc = facesXasc.slice(0).reverse(),
        facesYdesc = facesYasc.slice(0).reverse(),
        facesZdesc = facesZasc.slice(0).reverse();//.slice(0, 1000);

        var importData = function (geo, a) {
            var f, fl = a.length;
            for (f = 0; f < fl; f++) {
                geo.vertices.push(a[f][0]);
                geo.vertices.push(a[f][1]);
                geo.vertices.push(a[f][2]);
                geo.vertices.push(a[f][3]);
                geo.faces.push(new THREE.Face4(f * 4, f * 4 + 1, f * 4 + 2, f * 4 + 3));
                geo.boundingBox = boundingBox;
            }
            geo.mergeVertices();
            geo.computeCentroids();
        };

        var xasc = new THREE.Geometry(),
        yasc = new THREE.Geometry(),
        zasc = new THREE.Geometry(),
        xdesc = new THREE.Geometry(),
        ydesc = new THREE.Geometry(),
        zdesc = new THREE.Geometry();

        importData(xasc, facesXasc);
        importData(yasc, facesYasc);
        importData(zasc, facesZasc);
        importData(xdesc, facesXdesc);
        importData(ydesc, facesYdesc);
        importData(zdesc, facesZdesc);

        var geometries = [xasc, yasc, zasc, xdesc, ydesc, zdesc];

        return new CALC.MultiSortObject(geometries, material);
    }
};