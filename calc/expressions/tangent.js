'use strict';
/*global CALC, THREE */


CALC.Node.extend({
    tangentialPlane: function (x, y) {
        return CALC.tangentialPlane(this, x, y);
    }
});

CALC.tangentialPlane = function (expr, x, y) {
    var dzdx, dzdy, a, b, n, d;

    dzdx = expr.differentiate('x').evaluate({x: x, y: y});
    dzdy = expr.differentiate('y').evaluate({x: x, y: y});

    a = new THREE.Vector3(1, 0, dzdx);
    b = new THREE.Vector3(0, 1, dzdy);

    n = new THREE.Vector3();
    n.cross(a, b);

    // ax + by + cz + d = 0
    // => d = -ax - by - cz
    d = -n.x*x - n.y*y - n.z*expr.evaluate({x: x, y: y});

    return new CALC.Addition({
        left: new CALC.Addition({
            left: new CALC.Multiplication({
                left: new CALC.Constant({value: -n.x/n.z}),
                right: new CALC.Variable({symbol: 'x'})
            }),
            right: new CALC.Multiplication({
                left: new CALC.Constant({value: -n.y/n.z}),
                right: new CALC.Variable({symbol: 'y'})
            })
        }),
        right: new CALC.Constant({value: -d/n.z})
    });
};