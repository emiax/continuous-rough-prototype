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
        var i = 0,
            n = input.length;
            c;

        while (i < n) {

            // ignore whitespace
            c = input.charAt(i);
            if (' \t\n'.indexOf(c)) {
                i++;
            }
            
            // find symbols
            var symbols = '+-*/^()[]';
            c = input.charAt(i);
            var j = symbols.indexOf(c);
            
            if (j >= 0) {
                s = symbols[j];
                tokens.push(new Token(s, s, i, i+1)); 
                i++;
            }
            
            // identifiers
            for (j = 0, m = identifiers.length; i < m; i++) {
                var id = identifiers[j];
                var length = id.length;
                if (input.substr(i, length) === id) {
                    tokens.push(new Token('identifier', identifier, i, i + length));
                }
            }

            // numbers
            for (
            

        }
            
        return tokens;
        
    }
}


var a = new CALC.Lexer([]);
a.tokenize('sin(x)');