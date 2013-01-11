'use strict'
/*global CALC */

(CALC.AppearanceLayer = function () {}).extend({
    getNonSpacialSymbols: function() {
        throw new CALC.AbstractCallException();        
    }
    getFragmentShaderChunk: function(translationTable) {
        throw new CALC.AbstractCallException();
    }
});
