'use strict';
/*global CALC */

CALC.Node.extend({
    differentiate: function (symbol) {
        return CALC.differentiate({node: this, symbol: symbol});
    }
});


CALC.differentiate = function (spec) {
    var d = new CALC.Differentiator(spec);
    return d.differentiate();
};

(CALC.Differentiator = function (spec) {
    spec = spec || {};
    this.node = spec.node || null;
    this.symbol = spec.symbol || 'x';

}).extends(CALC.NodeVisitor, {
    differentiate: function () {
        return this.node.accept(this).simplify();
    },


    visitConstant: function (node) {
        return new CALC.Constant({value: 0});
    },

    visitVariable: function (node) {
        if (node.symbol === this.symbol) {
            return new CALC.Constant({value: 1});
        }
        return new CALC.Constant({value: 0});
    },

    visitAddition: function (node) {
        return new CALC.Addition({
            left: node.left.differentiate(this.symbol),
            right: node.right.differentiate(this.symbol)
        });
    },

    visitSubtraction: function (node) {
        return new CALC.Subtraction({
            left: node.left.differentiate(this.symbol),
            right: node.right.differentiate(this.symbol)
        });
    },

    visitMultiplication: function (node) {
        return new CALC.Addition({
            left: new CALC.Multiplication({
                left: node.left.differentiate(this.symbol),
                right: node.right.clone()
            }),
            right: new CALC.Multiplication({
                left: node.left.clone(),
                right: node.right.differentiate(this.symbol)
            })
        });
    },

    visitDivision: function (node) {
        return new CALC.Division({
            left: new CALC.Subtraction({
                left: new CALC.Multiplication({
                    left: node.left.differentiate(this.symbol),
                    right: node.right.clone()
                }),
                right: new CALC.Multiplication({
                    left: node.left.clone(),
                    right: node.right.differentiate(this.symbol)
                })
            }),
            right: new CALC.Power({
                left: node.right.clone(),
                right: new CALC.Constant({value: 2})
            })
        });
    },

    visitPower: function (node) {
        return new CALC.Addition({
            left: new CALC.Multiplication({
                left: node.right.clone(),
                right: new CALC.Multiplication({
                    left: new CALC.Power({
                        left: node.left.clone(),
                        right: new CALC.Subtraction({
                            left: node.right.clone(),
                            right: new CALC.Constant({value: 1})
                        })
                    }),
                    right: node.left.differentiate(this.symbol)
                })
            }),
            right: new CALC.Multiplication({
                left: new CALC.Power({
                    left: node.left.clone(),
                    right: node.right.clone()
                }),
                right: new CALC.Multiplication({
                    left: new CALC.Ln({
                        arg: node.left.clone()
                    }),
                    right: node.right.differentiate(this.symbol)
                })
            })
        });
    },

    visitExp: function (node) {
        return new CALC.Multiplication({
            left: node.arg.differentiate(this.symbol),
            right: node.clone()
        });
    },

    visitLn: function (node) {
        return new CALC.Division({
            left: node.arg.differentiate(this.symbol),
            right: node.arg.clone()
        });
    },

    visitSin: function (node) {
        return new CALC.Multiplication({
            left: node.arg.differentiate(this.symbol),
            right: new CALC.Cos({arg: node.arg.clone()})
        });
    },

    visitCos: function (node) {
        return new CALC.Multiplication({
            left: node.arg.differentiate(this.symbol),
            right: new CALC.Multiplication({
                left: new CALC.Constant({value: -1}),
                right: new CALC.Sin({arg: node.arg.clone()})
            })
        });
    }
});


