'use strict';
/*global CALC, $ */

CALC.glslFormat = function (spec) {
    var g = new CALC.GLSLFormatter(spec);
    return g.format();
};

CALC.Node.extend({
    glsl: function (symbol) {
        return CALC.glslFormat({node: this});
    }
});

(CALC.GLSLFormatter = function (spec) {
    spec = spec || {};
    this.node = spec.node || null;

}).extends(CALC.NodeVisitor, {

    format: function () {
        return this.node.accept(this);
    },

    visitConstant: function (node) {
        var value = node.value.toString();
        if (value.indexOf('.') === value.indexOf('e')) {
            value += '.0';
        }
        return value;
    },

    visitVariable: function (node) {
        return 'parameter_' + node.symbol;
    },

    visitAddition: function (node) {
        return '(' + node.left.glsl() + ' + ' + node.right.glsl() + ')';
    },

    visitSubtraction: function (node) {
        return '(' + node.left.glsl() + ' - ' + node.right.glsl() + ')';
    },

    visitMultiplication: function (node) {
        return '(' + node.left.glsl() + '*' + node.right.glsl() + ')';
    },

    visitDivision: function (node) {
        return '(' + node.left.glsl() + '/' + node.right.glsl() + ')';
    },

    visitPower: function (node) {
        return 'pow(' + node.left.glsl() + ', ' + node.right.glsl() + ')';
    },

    visitExp: function (node) {
        return 'exp(' + node.right.glsl() + ')';
    },

    visitLn: function (node) {
        return 'log(' + node.arg.glsl() + ')';
    },

    visitSin: function (node) {
        return 'sin(' + node.arg.glsl() + ')';
    },

    visitCos: function (node) {
        return 'cos(' + node.arg.glsl() + ')';
    }
});