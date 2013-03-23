/*global CALC, THREE */
'use strict';

/*
  x, y, z, xlen, ylen, zlen are CALC.Nodes or numbers
*/


(CALC.VectorArrow = function (xlen, ylen, zlen, color) {
    var uniforms, cylVertexShader, coneVertexShader, fragmentShader, cylGeometry, coneGeometry, v, vl;

    THREE.Object3D.call(this);

    this.xlen = xlen;
    this.ylen = ylen;
    this.zlen = zlen;

    if (typeof xlen === 'number') {
        this.xlen = new CALC.Constant({value: xlen});
    }
    if (typeof ylen === 'number') {
        this.ylen = new CALC.Constant({value: ylen});
    }
    if (typeof zlen === 'number') {
        this.zlen = new CALC.Constant({value: zlen});
    }


    this._oldX = 0;
    this._oldY = 0;
    this._oldZ = 0;

    uniforms = {opacity: {type: 'f', value: 1.0}, len: {type: 'f', value: 1.0}, size: {type: 'f', value: 0.02}, color: {type: 'c', value: new THREE.Color(color)}};

    // Todo: lighting model is not correct, because the vertices are transformed at shader level. Fix this.

    cylVertexShader = [
        'varying vec3 pos;',
        'varying vec3 n;',
        'uniform float size;',
        'uniform float len;',
        'varying vec3 vColor;',
        'uniform vec3 color;',
        'void main() {',
        'pos = position;',
        'n = normal;',
        'vec4 mvPosition = modelViewMatrix * vec4( size*position.x, step(0.00001, position.y)*(position.y*len-6.0*size), size*position.z, 1.0 );',
        'vColor = color;',
        'gl_Position = projectionMatrix * mvPosition;',
        '}'
    ].join("\n");


    coneVertexShader = [
        'varying vec3 pos;',
        'varying vec3 n;',
        'uniform float size;',
        'varying vec3 vColor;',
        'void main() {',
        'pos = position;',
        'n = normal;',
        'vec4 mvPosition = modelViewMatrix * vec4( size*3.0*position.x, size*6.0*position.y, size*3.0*position.z, 1.0 );',
        'vColor = vec3(1.0, 0.0, 0.0);',
        'gl_Position = projectionMatrix * mvPosition;',
        '}'
    ].join("\n");

    fragmentShader = [
        'varying vec3 pos;',
        'varying vec3 n;',
        'uniform vec3 color;',

        "vec3 applyLight(vec3 color, float intensity, vec3 direction, vec3 normal) {",
        "vec3 diffuse = intensity * (color * clamp(dot(normalize(direction), normal), 0.0, 1.0));",
        "return diffuse;",
        "}",

        'void main() {',
        'float a = (pos.z + 1.0)/2.0;',
        //'gl_FragColor = vec4(a/3.0, a/2.0, a, 1.0);',

        "vec3 component1 = (applyLight(vec3(1.0, 1.0, 1.0), 0.3, vec3(-1.0, -1.0, -0.4), n));",
        "vec3 component2 = (applyLight(vec3(1.0, 1.0, 1.0), 0.3, vec3(1.0, 1.0, -0.4), n));",
        "vec3 ambient = vec3(0.5, 0.5, 0.5);",

        'gl_FragColor = vec4(color * (ambient + component1 + component2), 1.0);',
        '}'
    ].join("\n");


    this.cylMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: cylVertexShader,
        fragmentShader: fragmentShader
    });


    this.coneMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: coneVertexShader,
        fragmentShader: fragmentShader
    });



    cylGeometry = new THREE.CylinderGeometry(1, 1, 1, 10, 1);
    coneGeometry = new THREE.CylinderGeometry(0, 1, 1, 10, 1);

    // place cylinder with its base in its origin
    for (v = 0, vl = cylGeometry.vertices.length; v < vl; v++) {
        cylGeometry.vertices[v].y += 0.5;
    }

    // place cone with its tip in its origin
    for (v = 0, vl = coneGeometry.vertices.length; v < vl; v++) {
        coneGeometry.vertices[v].y -= 0.5;
    }



    this.cyl = new THREE.Mesh(cylGeometry, this.cylMaterial);
    this.cone = new THREE.Mesh(coneGeometry, this.coneMaterial);


    this.zRotation = new THREE.Object3D();
    this.xRotation = new THREE.Object3D();

    this.xRotation.add(this.cone);
    this.xRotation.add(this.cyl);
    this.zRotation.add(this.xRotation);
    this.add(this.zRotation);

    this.prepareFrame(null, true);
}).extends(THREE.Object3D, {

    prepareFrame: function (renderer, forceUpdate) {
        var baseX, baseY, baseZ, vectX, vectY, vectZ, length, xRot, zRot;

        if (forceUpdate || this._oldX !== this.position.x || this._oldY !== this.position.y || this._oldZ !== this.position.z) {
            baseX = this.position.x;
            baseY = this.position.y;
            baseZ = this.position.z;

            vectX = this.xlen.evaluate({x: baseX, y: baseY, z: baseZ});
            vectY = this.ylen.evaluate({x: baseX, y: baseY, z: baseZ});
            vectZ = this.zlen.evaluate({x: baseX, y: baseY, z: baseZ});

            length = Math.sqrt(vectX*vectX + vectY*vectY + vectZ*vectZ);
            this.cone.position.set(0, length, 0);

            //previous method:
            //var xRot = Math.atan2(vectZ, vectY);
            //var zRot = Math.atan(vectX / vectY);

            //console.log("x y z: ");
            //console.log(vectX);
            //console.log(vectY);
            //console.log(vectZ);

            //book says
            //var xRot = vectX === 0 ? 0 : Math.atan2(vectY, vectX);
            //var zRot = Math.acos(vectZ/length) - Math.PI/2;

            xRot = vectZ === 0 ? 0 : Math.atan2(vectZ, vectX);
            //var zRot = Math.acos(vectY/length);

            zRot = vectX === 0 ? Math.PI/2 : Math.atan2(vectY, vectX);

            //var xRot = 0;
            //var zRot = 0;

            //  console.log("angles: ");
            //  console.log(xRot);
            //  console.log(zRot);

            this.zRotation.rotation.set(0, 0, zRot - Math.PI/2);
            this.xRotation.rotation.set(xRot, 0, 0);

            this.cylMaterial.uniforms.len.value = length;
            this._oldX = this.position.x;
            this._oldY = this.position.y;
            this._oldZ = this.position.z;

        }

    }
});



