'use strict';
/*global CALC */

/*
 * General Node
 */

CALC.Node = function () {};

CALC.Node.prototype = {
    constructor: CALC.Node,
    clone: function () {
        return this.constructor();
    },
    accept: function (visitor) {
        return visitor.visitNode();
    }
};


/*
 * Basic Node types
 */

(CALC.Operation = function () {}).extends(CALC.Node);


/*
 * Constant
 */

(CALC.Constant = function (parameters) {
    parameters = parameters || {};
    this.value = parameters.value || 0;
}).extends(CALC.Node, {
    accept: function (visitor) {
        return visitor.visitConstant(this);
    },

    toString: function () {
        return this.value;
    },

    clone: function () {
        return new this.constructor({
            value: this.value
        });
    }
});



/*
 * Variable
 */

(CALC.Variable = function (parameters) {
    parameters = parameters || {};
    this.symbol = parameters.symbol || 'x';
}).extends(CALC.Node, {
    accept: function (visitor) {
        return visitor.visitVariable(this);
    },

    toString: function () {
        return this.symbol;
    },

    clone: function () {
        return new this.constructor({
            symbol: this.symbol
        });
    }
});



/*
 * Binary operation
 */
(CALC.BinaryOperation = function (parameters) {
    parameters = parameters || {};
    this.left = parameters.left || null;
    this.right = parameters.right || null;
}).extends(CALC.Operation, {
    accept: function (visitor) {
        return visitor.visitBinaryOperation(this);
    },

    clone: function () {
        return new this.constructor({
            left: this.left.clone(),
            right: this.right.clone()
        });
    }
});

/*
 * Unary operation
 */

(CALC.UnaryOperation = function (parameters) {
    parameters = parameters || {};
    this.arg = parameters.arg;
}).extends(CALC.Operation, {
    clone: function () {
        return new this.constructor({
            arg: this.arg.clone()
        });
    }
});


// Power

(CALC.Power = function (parameters) {
    parameters = parameters || {};
    this.left = parameters.left || new CALC.Constant({value: 0});
    this.right = parameters.right || new CALC.Constant({value: 1});
}).extends(CALC.BinaryOperation, {
    accept: function (visitor) {
        return visitor.visitPower(this);
    },

    toString: function () {
        return '(' + this.left.toString() + ' ^ ' + this.right.toString() + ')';
    }
});


// Multiplication

(CALC.Multiplication = function (parameters) {
    parameters = parameters || {};
    this.left = parameters.left || new CALC.Constant({value: 1});
    this.right = parameters.right || new CALC.Constant({value: 1});
}).extends(CALC.BinaryOperation, {
    accept: function (visitor) {
        return visitor.visitMultiplication(this);
    },

    toString: function () {
        return '(' + this.left.toString() + ' * ' + this.right.toString() + ')';
    }
});



// Division


(CALC.Division = function (parameters) {
    parameters = parameters || {};
    this.left = parameters.left || new CALC.Constant({value: 0});
    this.right = parameters.right || new CALC.Constant({value: 1});
}).extends(CALC.BinaryOperation, {

    accept: function (visitor) {
        return visitor.visitDivision(this);
    },

    toString: function () {
        return '(' + this.left.toString() + ' / ' + this.right.toString() + ')';
    }
});

// Addition

(CALC.Addition = function (parameters) {
    parameters = parameters || {};
    this.left = parameters.left || new CALC.Constant({value: 0});
    this.right = parameters.right || new CALC.Constant({value: 0});
}).extends(CALC.BinaryOperation, {

    accept: function (visitor) {
        return visitor.visitAddition(this);
    },

    toString: function () {
        return '(' + this.left.toString() + ' + ' + this.right.toString() + ')';
    }
});

//Subtraction

(CALC.Subtraction = function (parameters) {
    parameters = parameters || {};
    this.left = parameters.left || new CALC.Constant({value: 0});
    this.right = parameters.right || new CALC.Constant({value: 0});
}).extends(CALC.BinaryOperation, {
    accept: function (visitor) {
        return visitor.visitSubtraction(this);
    },

    toString: function () {
        return '(' + this.left.toString() + ' - ' + this.right.toString() + ')';
    }
});

// Natural Logarithm

(CALC.Ln = function (parameters) {
    parameters = parameters || {};
    this.arg = parameters.arg || new CALC.Constant({value: 1});
}).extends(CALC.UnaryOperation, {
    accept: function (visitor) {
        return visitor.visitLn(this);
    },

    toString: function () {
        return 'ln(' + this.arg.toString() + ')';
    }
});

// Exponential function

(CALC.Exp = function (parameters) {
    parameters = parameters || {};
    this.arg = parameters.arg || new CALC.Constant({value: 0});
}).extends(CALC.UnaryOperation, {
    accept: function (visitor) {
        return visitor.visitExp(this);
    },

    toString: function () {
        return 'e^(' + this.arg.toString() + ')';
    }
});

// Sine

(CALC.Sin = function (parameters) {
    parameters = parameters || {};
    this.arg = parameters.arg || new CALC.Constant({value: 0});
}).extends(CALC.UnaryOperation, {
    accept: function (visitor) {
        return visitor.visitSin(this);
    },

    toString: function () {
        return 'sin(' + this.arg.toString() + ')';
    }
});


// Cosine

(CALC.Cos = function (parameters) {
    parameters = parameters || {};
    this.arg = parameters.arg || new CALC.Constant({value: 0});
}).extends(CALC.UnaryOperation, {
    accept: function (visitor) {
        return visitor.visitCos(this);
    },

    toString: function () {
        return 'cos(' + this.arg.toString() + ')';
    }
});



// TODO? Let mathematical functions be Nodes, (generalize node concept to do some lazy evaluation stuff..?)
/*

  CALC.Function = function (parameters) {
  parameters = parameters || {};
  this.name = parameters.name || CALC.getAnonymousFunctionName();
  this.args = parameters.args || {};
  }.extends(CALC.Node);


  CALC.Function.prototype.accept = function (visitor) {
  return visitor.visitFunction (this);
  }

  CALC.Ln.prototype.toString = function () {
  return this.name + '(' + this.arg.toString() + ')';
  };

*/

