'use strict';
/*global CALC */


CALC.Node.extend({
    replace: function (symbols) {
        return CALC.replace({node: this, symbols: symbols});
    }
});

CALC.replace = function (spec) {
    var d = new CALC.Replacer(spec);
    return d.replace();
};


(CALC.Replacer = function (spec) {
    spec = spec || {};
    this.node = spec.node || null;
    this.symbols = spec.symbols || {};
}).extends(CALC.NodeVisitor, {
    replace: function () {
        return this.node.accept(this);
    },

    visitConstant: function (node) {
        return new CALC.Constant({value: node.value});
    },

    visitVariable: function (node) {
        var s;
        for (s in this.symbols) {
            if (this.symbols.hasOwnProperty(s) && s === node.symbol) {
                if (typeof this.symbols[s] === 'number') {
                    return new CALC.Constant({value: this.symbols[s]});
                }
                if (typeof this.symbols[s] === 'string') {
                    return new CALC.Variable({symbol: this.symbols[s]});
                }
                throw new CALC.Exception("");
            }
        }
        return node.clone();
    },

    visitUnaryOperation: function (node) {
        return new node.constructor({arg: node.arg.replace(this.symbols)});
    },

    visitBinaryOperation: function (node) {
        return new node.constructor({left: node.left.replace(this.symbols), right: node.right.replace(this.symbols)});
    }
});