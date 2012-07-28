/*global CALC */
'use strict';

CALC.parse = function (str) {
    var parser = new CALC.Parser(str);
    return parser.parse();
};


CALC.Parser = function (str) {
    this.str = str;
};


CALC.Parser.prototype.operators = {
    '^': {precedence: 4, Node: CALC.Power, requiresEsc: true, args: 2},
    '*': {precedence: 5, Node: CALC.Multiplication, requiresEsc: true, args: 2},
    '/': {precedence: 5, Node: CALC.Division, requiresEsc: true, args: 2},
    '+': {precedence: 6, Node: CALC.Addition, requiresEsc: true, args: 2},
    '-': {precedence: 6, Node: CALC.Subtraction, requiresEsc: true, args: 2},
    'sin': {precedence: 3, Node: CALC.Sin, requiresEsc: false, args: 1},
    'cos': {precedence: 3, Node: CALC.Cos, requiresEsc: false, args: 1},
    'ln': {precedence: 3, Node: CALC.Ln, requiresEsc: false, args: 1}
};



CALC.Parser.extend({
    parse: function () {
        var postfixStack = this.infixToPostfix(this.tokenize());
        return this.buildExpressionTree(postfixStack);
    },


    tokenize: (function () {
        var a, k, operators, pattern, regex;

        operators = CALC.Parser.prototype.operators;
        pattern = "(";

        for (k in operators) {
            if (operators.hasOwnProperty(k)) {
                pattern += ((operators[k].requiresEsc) ? '\\' : '') + k  + '|';
            }
        }

        pattern += '\\(|\\)|(\\d+(?:\\.\\d*)?(?:e[+\\-]?\\d+)?|[a-zA-Z]))';

        regex = new RegExp(pattern, 'gi');

        return function () {
            var tokens = [];
            while (a = regex.exec(this.str)) {
                tokens.push(a[1]);
            }
            return tokens;
        };
    }()),

    infixToPostfix: function (tokens) {
        //Dijstra's shunting yard algorithm
        var token, stack = [], postfix = [], topOperator, operator, state = "empty";
        
        while (token = tokens.shift()) {
            if (this.operators[token]) {
                if (this.operators[token].args === 2) {
                    topOperator = stack.length && stack[stack.length - 1];
                    while (topOperator && topOperator !== '(' && topOperator !== ')' && this.operators[topOperator].precedence < this.operators[token].precedence) {
                        postfix.push(stack.pop());
                        topOperator = stack.length && stack[stack.length - 1];
                    }
                }
                stack.push(token);
                state = 'operator';
            } else if (token === '(') {
                stack.push(token);
                state = 'left-paranthesis';
            } else if (token === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    postfix.push(stack.pop());
                }
                if (stack.length) {
                    stack.pop();
                }
                if (stack.length && this.operators[stack[stack.length - 1]] && this.operators[stack[stack.length - 1]].args === 1) {
                    postfix.push(stack.pop());
                }
                state = 'right-paranthesis'
            } else {
                postfix.push(token);
                if (state === 'operand' || state === "right-paranthesis") {
                    console.log(token);
                    postfix.push('*');
                }
                state = 'operand';
            }
        }

        while (stack.length) {
            operator = stack.pop();
            if (operator !== '(') {
                postfix.push(operator);
            }
        }
        return postfix;
    },

    //tokens is an array with postfix notation
    buildExpressionTree: function (tokens) {
        var nodes = [], i, f, token, operator;

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            operator = this.operators[token];
            if (operator) {
                if (operator.args === 2) {
                    nodes.push(new operator.Node({
                        right: nodes.pop(),
                        left: nodes.pop()
                    }));
                } else if (operator.args === 1) {
                    nodes.push(new operator.Node({
                        arg: nodes.pop()
                    }));
                }
            } else {
                f = parseFloat(token);
                if (!token || f || f === 0) {
                    nodes.push(new CALC.Constant({value: parseFloat(token)}));
                } else {
                    nodes.push(new CALC.Variable({symbol: token}));
                }
            }
        }
        console.log(nodes[0]);
        return nodes[0];
    }
});

