SYM.parse = function(str) {
	var parser = new SYM.Parser(str);
	return parser.parse();
}


SYM.Parser = function(str) {
	this.str = str;
}


SYM.Parser.prototype.parse = function() {

	var tokens = this.tokenize();
	//todo: add multiplications between duplicate operand tokens.
	var postfixStack = this.infixToPostfix(tokens);
	// console.log("----postfix----");
	// for (i in postfixStack) {
	// 	console.log(postfixStack[i]);
	// }
	var tree = this.buildExpressionTree(postfixStack);
	return tree;
}

SYM.Parser.prototype.operators = {
	'^': {precedence: 4, Node: SYM.Power, requiresEsc: true, args: 2},
	'*': {precedence: 5, Node: SYM.Multiplication, requiresEsc: true, args: 2},
	'/': {precedence: 5, Node: SYM.Division, requiresEsc: true, args: 2},
	'+': {precedence: 6, Node: SYM.Addition, requiresEsc: true, args: 2},
	'-': {precedence: 6, Node: SYM.Subtraction, requiresEsc: true, args: 2},
	'sin': {precedence: 3, Node: SYM.Sin, requiresEsc: false, args: 1},
	'cos': {precedence: 3, Node: SYM.Cos, requiresEsc: false, args: 1},
	'ln': {precedence: 3, Node: SYM.Ln, requiresEsc: false, args: 1}
};

SYM.Parser.prototype.tokenize = function() {
	var pattern = "(";
		
	for (i in SYM.Parser.prototype.operators) {
		pattern += ((SYM.Parser.prototype.operators[i].requiresEsc) ? '\\' : '') + i  + '|';
	}
	
	pattern += '\\(|\\)|(\\d+(?:\\.\\d*)?(?:e[+\\-]?\\d+)?|[a-zA-Z]))';
	
	var regex = new RegExp(pattern, 'gi');	
	return function() {
		var tokens = [];
		while(a = regex.exec(this.str)) {
			tokens.push(a[1]);
		}
		return tokens;
	};
}();

SYM.Parser.prototype.infixToPostfix = function(tokens) {
	//Dijstra's shunting yard algorithm
	var token;
	var stack = [];
	var postfix = [];
	//console.log("----infix----");
	while (token = tokens.shift()) {
		// console.log(token);
		if (this.operators[token]) {
			if (this.operators[token].args == 2) {
				var topOperator = stack.length && stack[stack.length-1];
				while (topOperator && topOperator !== '(' && topOperator !== ')' && this.operators[topOperator].precedence < this.operators[token].precedence) {
					postfix.push(stack.pop());
					topOperator = stack.length && stack[stack.length-1];
				}
			}
			stack.push(token);
		} else if (token === '(') {
			stack.push(token);
		} else if (token === ')') {
			while (stack.length && stack[stack.length-1] !== '(') {
				postfix.push(stack.pop());
			}
			if (stack.length) {
				stack.pop();
			}
			if (stack.length && this.operators[stack[stack.length-1]] && this.operators[stack[stack.length-1]].args === 1) {
				postfix.push(stack.pop());
			}
		} else {
			postfix.push(token);
		}
	}

	while(stack.length) {
		var operator = stack.pop();
		if (operator != '(') {
			postfix.push(operator);
		}
	}	
	return postfix;
}


SYM.Parser.prototype.buildExpressionTree = function(tokens) {
	//tokens is an array with postfix notation
	var nodes = [];
	for (var i = 0; i < tokens.length; i++) {
		var token = tokens[i];
		var operator = this.operators[token];
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
			if (token == 0 || parseFloat(token)) {
				nodes.push(new SYM.Constant({value: parseFloat(token)}));
			} else {
				nodes.push(new SYM.Variable({symbol: token}));
			}
		}
	}
	return nodes[0];
}


