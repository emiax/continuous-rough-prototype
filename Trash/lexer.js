var CALC = {};


CALC.Token = function(type, lexeme, from, to) {
    this.type = type;
    this.lexeme = lexeme;
    this.from = from;
    this.to = to;
}

// return new Token("+", "+", n, m);
// return new Token("identifier", "ln", n, m);
// return new Token("(", "(", n, m);




CALC.Lexer = function(identifiers) {
    
    this.tokenize = function(input) {
        var tokens = [];
        var i = 0;

        var idRegexp = '(' + identifiers.join(')|(') + ')|([a-zA-Z]+)';
        
        var type = function(type, regex) {
            return {
                type: type,
                regex: regex
            }
        }

        tokenTypes = [
            type('i', /^[a-z]/g),
            type('+', /^\+/g),
            type('-', /^\-/g),
            type('*', /^\*/g),
            type('/', '/^\//g'),
            type('^', '/^\^/g'),
            type('(', /^\(/g),
            type(')', /^\)/g),
            type('[', /^\[/g),
            type(']', /^\]/g),
            type('whitespace', /\s/g),
            type('number', /^[0-9]+(\.[0-9]*)/g),
            type('identifier', new RegExp(idRegexp, 'g'))
            
        ];
        

        var i, n, j, m, t;

        for ( i = 0, n = input.length; i < n;) {
            for(j = 0, m = tokenTypes.length; j < m; j++) {
                t = tokenTypes[i];
                


                //console.log(input.substr(i));
                match = t.regex.exec(input.substr(i));
                t.regex.lastIndex = 0;
                
                if (match) {
                    console.log(match)
//                    t.regex.compile(t.regex);
                    tokens.push(new CALC.Token(t.type, match, i, i += match.length));
                    break;
                }

                if (j === m-1) {
                    console.log("unexpected '" + input.substr(i, 1) + "' at pos " + i);
                    throw 'syntax error!';
                }
            }

        }
            
        return tokens;
        
    }
}


var a = new CALC.Lexer([]);
a.tokenize('sin(x)');