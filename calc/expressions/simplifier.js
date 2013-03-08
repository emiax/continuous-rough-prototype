'use strict';
/*global CALC */

CALC.Node.extend({
    simplify: function () {
        return CALC.simplify({node: this});
    }
});

CALC.simplify = function (spec) {
    var d = new CALC.Simplifier(spec);
    return d.simplify();
};

(CALC.Simplifier = function (spec) {
    spec = spec || {};
    this.node = spec.node || null;
}).extends(CALC.NodeVisitor, {
    simplify: function () {
        return this.node.accept(this);
    },

    visitConstant: function (node) {
        return node.clone();
    },

    visitVariable: function (node) {
        return node.clone();
    },

    visitAddition: function (node) {
        var e,
            left = node.left.simplify(),
            right = node.right.simplify(),
            that = new CALC.Addition({
                left: left,
                right: right
            });


        if (left instanceof CALC.Constant && right instanceof CALC.Constant) {
            e = that.evaluate();
            if (e === Math.round(e)) {
                return new CALC.Constant({value: e});
            }
        }

        if (left instanceof CALC.Constant && !left.value) {
            return right;
        }
        if (right instanceof CALC.Constant && !right.value) {
            return left;
        }
        return that;
    },

    visitSubtraction: function (node) {
        var e,
            left = node.left.simplify(),
            right = node.right.simplify(),
            that = new CALC.Subtraction({
                left: left,
                right: right
            });

        if (left instanceof CALC.Constant && right instanceof CALC.Constant) {
            e = that.evaluate();

            if (e === Math.round(e)) {
                return new CALC.Constant({value: e});
            }
        }

        if (left instanceof CALC.Constant && !left.value) {
            return new CALC.Multiplication({
                left: new CALC.Constant({value: -1}),
                right: right
            });
        }
        if (right instanceof CALC.Constant && !right.value) {
            return left;
        }
        return that;
    },

    visitMultiplication: function (node) {
        var e,
            left = node.left.simplify(),
            right = node.right.simplify(),
            that = new CALC.Multiplication({
                left: left,
                right: right
            });

        if (left instanceof CALC.Constant && right instanceof CALC.Constant) {
            e = that.evaluate();
            if (e === Math.round(e)) {
                return new CALC.Constant({value: e});
            }
        }

        if (left instanceof CALC.Constant) {
            if (!left.value) {
                return left;
            }
            if (left.value === 1) {
                return right;
            }
        }
        if (right instanceof CALC.Constant) {
            if (!right.value) {
                return right;
            }
            if (right.value === 1) {
                return left;
            }
        }
        return that;
    },

    visitDivision: function (node) {
        var e,
            left = node.left.simplify(),
            right = node.right.simplify(),
            that = new CALC.Division({
                left: left,
                right: right
            });

        if (left instanceof CALC.Constant && right instanceof CALC.Constant) {
            e = that.evaluate();
            if (e === Math.round(e)) {
                return new CALC.Constant({value: e});
            }
        }

        if (left instanceof CALC.Constant) {
            if (!left.value) {
                return new CALC.Constant({value: 0});
            }
        } else if (right instanceof CALC.Constant) {
            if (right.value === 1) {
                return left;
            }
        }
        return that;

    },

    visitPower: function (node) {
        var e,
            left = node.left.simplify(),
            right = node.right.simplify(),
            that = new CALC.Power({
                left: left,
                right: right
            });

        if (left instanceof CALC.Constant && right instanceof CALC.Constant) {
            e = that.evaluate();
            if (e === Math.round(e)) {
                return new CALC.Constant({value: e});
            }
        }

        if (left instanceof CALC.Constant) {
            if (!left.value) {
                return new CALC.Constant({value: 0});
            }
        } else if (right instanceof CALC.Constant) {
            if (right.value === 1) {
                return left;
            }
        }

        return that;

    },

    visitExp: function (node) {
        return node.clone();
    },

    visitLn: function (node) {
        return node.clone();
    },

    visitSin: function (node) {
        return node.clone();
    },

    visitCos: function (node) {
        return node.clone();
    }

});
