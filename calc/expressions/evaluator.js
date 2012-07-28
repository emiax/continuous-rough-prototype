'use strict';
/*global CALC */

CALC.Node.extend({
    evaluate: function (variables) {
        return CALC.evaluate({node: this, variables: variables});
    }
});

CALC.evaluate = function (spec) {
    var d = new CALC.Evaluator(spec);
    return d.evaluate();
};


(CALC.Evaluator = function (spec) {
    spec = spec || {};
    this.node = spec.node || null;
    this.variables = spec.variables || {};
}).extends(CALC.NodeVisitor, {
    evaluate: function () {
//        console.log(this.node);
        return this.node.accept(this);
    },

    visitConstant: function (node) {
        return node.value;
    },

    visitVariable: function (node) {
        if (typeof this.variables[node.symbol] === 'number') {
            return this.variables[node.symbol];
        }
        console.log(this.variables);
        console.log(node);

        throw {
            name: 'Missing variable',
            message: 'Cannot evaluate expresison. ' + node.symbol + ' is ' + this.variables[node.symbol] + '.'
        };
    },

    visitAddition: function (node) {
        return node.left.evaluate(this.variables) + node.right.evaluate(this.variables);
    },

    visitSubtraction: function (node) {
        return node.left.evaluate(this.variables) - node.right.evaluate(this.variables);
    },

    visitMultiplication: function (node) {
        return node.left.evaluate(this.variables) * node.right.evaluate(this.variables);
    },

    visitDivision: function (node) {
        var left = node.left.evaluate(this.variables),
            right = node.right.evaluate(this.variables);

        if (right === 0) {
            throw {
                name: 'Division by zero',
                message: 'Cannot evaluate expression, denominator is zero!'
            };
        }

        return left / right;
    },

    visitPower: function (node) {
        return Math.pow(node.left.evaluate(this.variables), node.right.evaluate(this.variables));
    },

    visitExp: function (node) {
        return Math.exp(node.arg.evaluate(this.variables));
    },

    visitLn: function (node) {
        return Math.log(node.arg.evaluate(this.variables));
    },

    visitSin: function (node) {
        return Math.sin(node.arg.evaluate(this.variables));
    },

    visitCos: function (node) {
        return Math.cos(node.arg.evaluate(this.variables));
    }
});