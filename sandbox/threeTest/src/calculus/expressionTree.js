
var createNode = function(spec) {
	var that = {},
		parent = null;

	that.getParent = function() {
		return parent;
	};

	that.setParent = function(node) {
		parent = node;
	};

	that.simplify = function() {
		return that;
	}	


	return that;
}

var createBinaryOperation = function(spec) {
	var that = createNode();
	var left = spec ? spec.left || null : null;
	var right = spec ? spec.right || null : null;
	
	that.isBinaryOperation = function () {return true; };

	that.getLeft = function() {
		return left;
	}
	that.getRight = function() {
		return right;
	}
	that.setLeft = function(node) {
		left = node;
		node.setParent(that);
	}
	that.setRight = function(node) {
		right = node;
		node.setParent(that);
	}

	that.simplify = function() {
		that.setLeft(that.getLeft().simplify());
		that.setRight(that.getRight().simplify());
		return that;
	}	

	return that;
}

var createUnaryOperation = function(spec) {
	var that = createNode();
	var arg = spec ? spec.arg || null : null;
	
	that.isUnaryOperation = function () {return true; };
	
	that.getArg = function() {
		return arg;
	}
	
	that.setArg = function(node) {
		arg = node;
		node.setParent(that);
	}

	that.simplify = function() {
		that.setArg(that.getArg().simplify());
		return that;
	}	

	return that;
}


var createMultiplication = function(spec) {
	var that = createBinaryOperation(spec);
	
	that.isMultiplication = function () {return true; };

	that.toS = function(n) {
		return '(' + that.getLeft().toS() + " * " + that.getRight().toS() + ')';
	}

	that.deepCopy = function() {
		return createMultiplication({left: that.getLeft().deepCopy(), right: that.getRight().deepCopy()});	
	}

	that.evaluate = function(variables) {
		return that.getLeft().evaluate(variables) * that.getRight().evaluate(variables);
	}

	that.simplify = function() {
		that.setLeft(that.getLeft().simplify());
		that.setRight(that.getRight().simplify());


		if (that.getLeft().isConstant && that.getRight().isConstant) {
			return createConstant({value: that.evaluate()});
		}

		if (that.getLeft().isConstant) {
			if (!that.getLeft().evaluate()) {
				return that.getLeft();
			}
			if (that.getLeft().evaluate() === 1) {
				return that.getRight();
			}
		}
		
		if (that.getRight().isConstant) {
			if (!that.getRight().evaluate()) {
				return that.getRight();
			}
			if (that.getRight().evaluate() === 1) {
				return that.getLeft();
			}
		}

		return that;
	}

	that.differentiate = function(symbol) {
		return createAddition({
				left: createMultiplication({
					left: that.getLeft().differentiate(symbol),
					right: that.getRight().deepCopy()
				}),
				right: createMultiplication({
					left: that.getLeft().deepCopy(),
					right: that.getRight().differentiate(symbol)
				})			
			});
	}

	return that;
}

var createDivision = function(spec) {
	var that = createBinaryOperation(spec);
	
	that.isDivision = function () {return true; };

	that.toS = function(n) {
		return '(' + that.getLeft().toS() + " / " + that.getRight().toS() + ')';
	}

	that.deepCopy = function() {
		return createDivision({left: that.getLeft().deepCopy(), right: that.getRight().deepCopy()});	
	}	

	that.evaluate = function(variables) {
		var numerator = that.getLeft().evaluate(variables);
		var denominator = that.getRight().evaluate(variables);
		if (denominator !== 0)
			return  numerator / denominator;
		throw {
			name: "DivisionByZero",
			message: 'trying to divide by zero'
		};
	}

	that.simplify = function() {
		that.setLeft(that.getLeft().simplify());
		that.setRight(that.getRight().simplify());

		if (that.getLeft().isConstant && that.getLeft().evaluate() === 0) {
			return that.getLeft();
		}

		if (that.getRight().isConstant && that.getRight().evaluate() === 1) {
			return that.getLeft();
		}

		return that;
	}

	that.differentiate = function(symbol) {
		return createDivision({
			left: createSubtraction({
				left: createMultiplication({
					left: that.getLeft().differentiate(symbol),
					right: that.getRight().deepCopy()
				}),
				right: createMultiplication({
					left: that.getLeft().deepCopy(),
					right: that.getRight().differentiate(symbol)
				})			
			}),
			right: createPower({left: that.getRight(), right: createConstant({value: 2})})
		});
	}

	return that;
}



var createPower = function(spec) {
	var that = createBinaryOperation(spec);
	
	that.isPower = function () {return true; };

	that.toS = function(n) {
		return '(' + that.getLeft().toS() + " ^ " + that.getRight().toS() + ')';
	}

	that.deepCopy = function() {
		return createPower({left: that.getLeft().deepCopy(), right: that.getRight().deepCopy()});	
	}	

	that.evaluate = function(variables) {
		return Math.pow(that.getLeft().evaluate(variables), that.getRight().evaluate(variables));
	}

	that.simplify = function() {
		that.setLeft(that.getLeft().simplify());
		that.setRight(that.getRight().simplify());

		if (that.getRight().isConstant) {
			if (that.getRight().evaluate() === 1) {
				return that.getLeft();
			}
			if (that.getRight().evaluate() === 0) {
				return createConstant({value: 1});
			}
		}

		return that;
	}


	that.differentiate = function(symbol) {
		return createAddition({
				left: createMultiplication({
					left: that.getRight().deepCopy(),
					right: createMultiplication({
						left: createPower({
							left: that.getLeft().deepCopy(),
							right: createSubtraction({
								left: that.getRight().deepCopy(),
								right: createConstant({value: 1})
							})
						}),
						right: that.getLeft().differentiate(symbol)
					})
				}),
				right: createMultiplication({
					left: createPower({
						left: that.getLeft().deepCopy(),
						right: that.getRight().deepCopy()
					}),
					right: createMultiplication({
						left: createLn({arg: that.getLeft().deepCopy()}),
						right: that.getRight().differentiate(symbol)
					})
				})
			});
	}
	
	return that;
}



var createLn = function(spec) {
	var that = createUnaryOperation(spec);
	
	that.isLn = function () {return true; };

	that.toS = function(n) {
		return 'ln(' + that.getArg().toS() + ')';
	}

	that.deepCopy = function() {
		return createLn({arg: that.getArg().deepCopy()});	
	}		

	that.evaluate = function(variables) {
		return Math.log(that.getArg().evaluate(variables));
	}

	that.simplify = function() {
		that.setArg(that.getArg().simplify());

		if (that.getArg().isConstant) {
			if (that.getArg().evaluate() === Math.exp(1)) {
				return createConstant({value: 1});
			}
			if (that.getArg().evaluate() === 1) {
				return createConstant({value: 0});
			}
		}
		return that;
	}

	that.differentiate = function(symbol) {
		return createDivision({
				left: that.getArg().differentiate(symbol),
				right: that.getArg().deepCopy()
			});
	}
	
	return that;
}


var createSin = function(spec) {
	var that = createUnaryOperation(spec);
	
	that.isSin = function () {return true; };

	that.toS = function(n) {
		return 'sin(' + that.getArg().toS() + ')';
	}

	that.deepCopy = function() {
		return createSin({arg: that.getArg().deepCopy()});	
	}		

	that.evaluate = function(variables) {
		return Math.sin(that.getArg().evaluate(variables));
	}

	that.simplify = function() {
		that.setArg(that.getArg().simplify());

		if (that.getArg().isConstant) {
			if (that.getArg().evaluate() % Math.PI === 0) {
				return createConstant({value: 0});
			}
			if (that.getArg().evaluate() % Math.PI/2 === 0) {
				return createConstant({value: 1});
			}
		}
		return that;
	}

that.differentiate = function(symbol) {
		return createMultiplication({
			left: that.getArg().differentiate(symbol),
			right: createCos({arg: that.getArg().deepCopy()})
		});
	}
	
	return that;
}


var createCos = function(spec) {
	var that = createUnaryOperation(spec);
	
	that.isCos = function () {return true; };

	that.toS = function(n) {
		return 'cos(' + that.getArg().toS() + ')';
	}

	that.deepCopy = function() {
		return createCos({arg: that.getArg().deepCopy()});	
	}		

	that.evaluate = function(variables) {
		return Math.cos(that.getArg().evaluate(variables));
	}

	that.simplify = function() {
		that.setArg(that.getArg().simplify());

		if (that.getArg().isConstant) {
			if (that.getArg().evaluate() % Math.PI === 0) {
				return createConstant({value: 1});
			}
			if (that.getArg().evaluate() % Math.PI/2 === 0) {
				return createConstant({value: 0});
			}
		}
		return that;
	}

	that.differentiate = function(symbol) {
		return createMultiplication({
			left: createMultiplication({
				left: createConstant({value: -1}),
				right: that.getArg().differentiate(symbol)
				}),
			right: createSin({arg: that.getArg().deepCopy()})
		});
	}
	
	return that;
}





var createAddition = function(spec) {
	var that = createBinaryOperation(spec);
	
	that.isAddition = function () {return true; };

	that.toS = function(n) {
		return '(' + that.getLeft().toS() + " + " + that.getRight().toS() + ')';
	}

	that.deepCopy = function() {
		return createAddition({left: that.getLeft().deepCopy(), right: that.getRight().deepCopy()});	
	}	

	that.evaluate = function(variables) {
		return that.getLeft().evaluate(variables) + that.getRight().evaluate(variables);
	}

	that.simplify = function() {
		that.setLeft(that.getLeft().simplify());
		that.setRight(that.getRight().simplify());

		if (that.getLeft().isConstant && that.getRight().isConstant) {
			return createConstant({value: that.evaluate()});
		}

		if (that.getLeft().isConstant && !that.getLeft().evaluate()) {
			return that.getRight();
		}

		if (that.getRight().isConstant && !that.getRight().evaluate()) {
			return that.getLeft();
		}

		return that;
	}

	that.differentiate = function(symbol) {
		return createAddition({
				left: that.getLeft().differentiate(symbol),
				right: that.getRight().differentiate(symbol)
			});
	}

	return that;
}

var createSubtraction = function(spec) {
	var that = createBinaryOperation(spec);
	
	that.isSubtraction = function () {return true; };

	that.toS = function(n) {
		return '(' + that.getLeft().toS() + " - " + that.getRight().toS() + ')';
	}

	that.deepCopy = function() {
		return createSubtraction({left: that.getLeft().deepCopy(), right: that.getRight().deepCopy()});	
	}

	that.evaluate = function(variables) {
		return that.getLeft().evaluate(variables) - that.getRight().evaluate(variables);
	}


	that.simplify = function() {
		that.setLeft(that.getLeft().simplify());
		that.setRight(that.getRight().simplify());

		if (that.getLeft().isConstant && that.getRight().isConstant) {
			return createConstant({value: that.evaluate()});
		}

		if (that.getRight().isConstant && !that.getRight().evaluate()) {
			return that.getLeft();
		}

		return that;
	}

	that.differentiate = function(symbol) {
		return createSubtraction({
				left: that.getLeft().differentiate(symbol),
				right: that.getRight().differentiate(symbol)
			});
	}	
	return that;
}


var createConstant = function(spec) {
	var that = createNode(),
		value = (spec && spec.value) || 0;

	that.isConstant = function () {return true; };

	that.toS = function(n) {
		return '<span style="color: #090">' + value + '</span>';
	}

	that.deepCopy = function() {
		return createConstant({value: value});
	}

	that.evaluate = function(variables) {
		return value;
	}

	that.differentiate = function(symbol) {
		return createConstant({value: 0});
	}

	return that;
}

var createVariable = function(spec) {
	var that = createNode(),
		symbol = '';
	if (!spec || typeof spec.symbol !== 'string') {
		throw {
			name: 'MissingSymbol',
			message: 'cannot create a variable without assigning a symbol to it'
		};	
	}
	symbol = spec.symbol;

	that.isVariable = function () {return true; };

	that.toS = function(n) {
		return '<span style="color: #00d">' + symbol + '</span>';
	}

	that.deepCopy = function() {
		return createVariable({symbol: symbol});
	}

	that.evaluate = function(variables) {
		var value = variables[symbol];
		if (typeof value !== 'number') {
			throw {
				name: 'MissingVariable',
				message: 'cannot create evaluate expresison. ' + symbol + ' was ' + typeof value
			};
		}
		return value;
	}



	that.differentiate = function(sym) {
		return createConstant({value: (sym == symbol ? 1 : 0)});
	}
	return that;
}


//try {
	/*var root = createAddition({
		left: createMultiplication({
			left: createConstant({value: 2}),
			right: createVariable({symbol: 'x'})
		}),
		right: createVariable({symbol: 'x'}),
	});
	pln(root.differentiate('x').evaluate({x: 3}));
	pln(root.evaluate({x: 3}));*/

	/*var root = createAddition({
		left: createMultiplication({
			left: createMultiplication({
				left: createVariable({symbol: 'x'}),
				right: createVariable({symbol: 'x'}),
			}),
			right: createConstant({value: 2}),
		}),
		right: createMultiplication({
			left: createMultiplication({
				left: createVariable({symbol: 'x'}),
				right: createVariable({symbol: 'y'}),
			}),
			right: createConstant({value: 3}),
		})
	});*/

	/*var root = createPower({
		left: createVariable({symbol: 'x'}),
		right: createConstant({value: 2}),		
	})*/	

	/*var root = createMultiplication({
		left: createConstant({value: 2}),
		right: createSin({
			arg: createMultiplication({
				left: createConstant({value: 3}),
				right: createVariable({symbol: 'x'})
			})		
		})
	});*/


	var parseExpression = function() {

		var operators = {
			'^': {precedence: 4, callback: createPower, requiresEsc: true, args: 2},
			'*': {precedence: 5, callback: createMultiplication, requiresEsc: true, args: 2},
			'/': {precedence: 5, callback: createDivision, requiresEsc: true, args: 2},
			'+': {precedence: 6, callback: createAddition, requiresEsc: true, args: 2},
			'-': {precedence: 6, callback: createSubtraction, requiresEsc: true, args: 2},
			'sin': {precedence: 3, callback: createSin, requiresEsc: false, args: 1},
			'cos': {precedence: 3, callback: createCos, requiresEsc: false, args: 1},
			'ln': {precedence: 3, callback: createLn, requiresEsc: false, args: 1}
		};

		var pattern = "(";
		for (i in operators) {
			pattern += ((operators[i].requiresEsc) ? '\\' : '') + i  + '|';
		}

		pattern += '\\(|\\)|(\\d+(?:\\.\\d*)?(?:e[+\\-]?\\d+)?|[a-zA-Z]))';

		var regex = new RegExp(pattern, 'gi')
		//pln(regex.source);

		return function(input) {
			var results = [], a = [];
			var stack = [], postfix = [];
			
			//Dijstra's shunting yard algorithm
			while(a = regex.exec(input)) {
				var token = a[1];

				if (operators[token]) {
					// for binary operators: if there is an operator on the stack with higher precedence on the stack,
					// then pop it and add it to the output
					if (operators[token].args == 2) {
						var topOperator = stack.length && stack[stack.length-1];
						if (stack.length && topOperator !== '(' && topOperator !== ')' && operators[topOperator].precedence < operators[token].precedence) {
							postfix.push(stack.pop());
						}
					}
					stack.push(token);
				} else if (token === '(') {
					stack.push(token);

				} else if (token === ')') {
					while(stack.length && stack[stack.length-1] !== '(') {
						postfix.push(stack.pop());
					}
				}
				// operands
				else {
					postfix.push(token);
				}
			}
			while(stack.length) {
				var operator = stack.pop();
				if (operator != '(') {
					postfix.push(operator);
				}
			}

			var nodes = [];
			for(i in postfix) {
				//pln(postfix[i]);

				token = postfix[i];
				var operator = operators[token];
				
				if (operator) {

					var newNode;
					if (operator.args === 2) {
						newNode = operator.callback({
						right: nodes.pop(),
						left: nodes.pop()
						});
					} else if (operator.args === 1) {
						newNode = operator.callback({
						arg: nodes.pop(),
						});
					}
					nodes.push(newNode);

				} else {
					if (token == 0 || parseFloat(token)) {
						nodes.push(createConstant({value: parseFloat(token)}));
					} else {
						nodes.push(createVariable({symbol: token}));
					}
				}
			}
			return nodes[0];
		}; 
	}();

var expression = {
	tesselate: function(expr, boundingRect, res) {
		var vertices = [];

		var pushVertex = function(a, vertex) {
			for(i in vertex) {
				a.push(vertex[i]);
			}
		};

		var xRes = res, yRes = res;

		for (var y = boundingRect[1]; y<boundingRect[2]-yRes; y+=yRes) {
			for (var x = boundingRect[0]; x<boundingRect[3]-xRes; x+=xRes) {
				//first triangle of square
				pushVertex(vertices, [x, y, expr.evaluate({x: x, y: y})]);
				pushVertex(vertices, [x+xRes, y, expr.evaluate({x: x+xRes, y: y})]);
				pushVertex(vertices, [x, y+yRes, expr.evaluate({x: x, y: y+yRes})]);
				//pln(expr.evaluate({x: x, y: y+yRes}));
				//second triangle of square
				//pushVertex(vertices, [x+xRes, y, quadratic.z(mat, x+xRes, y)]);
				//pushVertex(vertices, [x, y+yRes, quadratic.z(mat, x, y+yRes)]);
				pushVertex(vertices, [x+xRes, y, expr.evaluate({x: x+xRes, y: y})]);
				pushVertex(vertices, [x+xRes, y+yRes, expr.evaluate({x: x+xRes, y: y+yRes})]);	
				pushVertex(vertices, [x, y+yRes, expr.evaluate({x: x, y: y+yRes})]);		
			}
		}

		return vertices;
	},

	tangentialPlane: function(expr, x, y) {
		//pln("yo" + expr.differentiate('x').simplify().toS());
		var dzdx = expr.differentiate('x').simplify().evaluate({x: x, y: y});
		var dzdy = expr.differentiate('y').simplify().evaluate({x: x, y: y});
		//pln('dzdx: ' + dzdx);
		//pln('dzdy: ' + dzdy);

		//plc();		
		pln("z = " + expr.toS());		
		pln("dzdx = " + expr.differentiate('x').simplify().toS());
		pln("dzdy = " + expr.differentiate('y').simplify().toS());
		
		
		var n = vec3.cross([1, 0, dzdx], [0, 1, dzdy]);
		var a = n[0], b = n[1], c = n[2];
		var d = - a*x - b*y - c*expr.evaluate({x: x, y: y});
		
			
		return [-a/c, -b/c, -d/c];
	}
}
