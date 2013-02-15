'use strict'
/*global CALC */

CALC.AppearanceLayer = (function () {}).extend({
    getNonSpatialSymbols: function() {
        throw new CALC.AbstractCallException();        
    },

    /* context is a CALC.surface or a CALC.curve */

    getFragmentShaderChunk: function(context) {
        throw new CALC.AbstractCallException();
    }
});
