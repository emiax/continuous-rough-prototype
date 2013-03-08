'use strict';
/*global CALC, $ */

CALC.mathMLFormat = function (spec) {
    var d = new CALC.MathMLFormatter(spec);
    return d.format();
};

CALC.Node.extend({
    mathML: function (symbol) {
        return CALC.mathML({node: this});
    },

    mathMLElement: function (symbol) {
        // requires jQuery to work
        return $('<math>' + CALC.mathML({node: this}) + '</math>');
    }
});

(CALC.MathMLFormatter = function (spec) {
    spec = spec || {};
    this.node = spec.node || null;

}).extends(CALC.NodeVisitor, {

    format: function () {
        return this.node.accept(this);
    },

    visitConstant: function (node) {
        return '<mn>' + node.value + '</mn>';
    },

    visitVariable: function (node) {
        return '<mi>' + node.symbol + '</mi>';
    },

    visitAddition: function (node) {
        return node.left.mathML() + '<mo>+</mo>' + node.right.mathML();
    },

    visitSubtraction: function (node) {
        return node.left.mathML() + '<mo>-</mo>' + node.right.mathML();
    },

    visitMultiplication: function (node) {
        var left = node.left.mathML(),
            right = node.right.mathML(),
            explicit = false;

        if (left instanceof CALC.Addition || left instanceof CALC.Subtraction) {
            left = this.parenthesize(left);
            explicit = true;
        }
        if (right instanceof CALC.Addition || right instanceof CALC.Subtraction) {
            right = this.parenthesize(right);
            explicit = true;
        }

        if (explicit) {
            return node.left.mathML() + '<mo>&times;</mo>' + node.right.mathML();
        }
        return node.left.mathML() + '<mo>&InvisibleTimes;</mo>' + node.right.mathML();

    },

    visitDivision: function (node) {
        return '<mfrac><mrow>' + node.left.mathML() + '</mrow><mrow>' + node.right.mathML() + '</mfrac>';
    },

    visitPower: function (node) {
        return '<msup>' + node.left.mathML() + node.right.mathML() + '</msup>';
    },

    visitExp: function (node) {
        return '<msup><mi>e</mi>' + node.right.mathML() + '</msup>';
    },

    visitLn: function (node) {
        return '<mi>ln</mi>' + this.parenthesize(node.arg.mathML());
    },

    visitSin: function (node) {
        return '<mi>sin</mi>' + this.parenthesize(node.arg.mathML());
    },

    visitCos: function (node) {
        return '<mi>cos</mi>' + this.parenthesize(node.arg.mathML());
    },

    parenthesize: function (s) {
        return '<mo>(</mo>' + s + '<mo>)</mo>';

    }
});