'use strict';
/*global CALC */

CALC.Node.extend({
    findParameters: function (symbol) {
        return CALC.findParameters({node: this, symbol: symbol});
    }
});

CALC.findParameters = function (spec) {
    var f = new CALC.ParameterFinder(spec);
    return f.findParamters();
};


(CALC.ParameterFinder = function (spec) {
    spec = spec || {};
    this.node = spec.node || null;
}).extends(CALC.NodeVisitor, {
    findParameters: function () {
        return this.node.accept(this);
    },

    visitConstant: function (node) {
        return [];
    },

    visitVariable: function (node) {
        return [node.symbol];
    },

    visitBinaryOperation: function (node) {
        var left = node.left.findParameters(),
            right = node.right.findParameters(),
            set = {},
            a = [],
            i = 0;

        for (i = 0; i < left.length; i++) {
            set[left[i]] = true;
        }
        for (i = 0; i < right.length; i++) {
            set[right[i]] = true;
        }
        for (i in set) {
            if (set.hasOwnProperty(i)) {
                a.push(i);
            }
        }
        return a;
    },

    visitUnaryOperation: function (node) {
        return node.arg.findParameters();
    }
});