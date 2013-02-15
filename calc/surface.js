'use strict'
/*global CALC */


/*
 * Example input
 * spec = {[
 *   {
 *      function: a CALC.Function object
 *      appearance: a CALC.Appearance object
 *   },
 *   {
 *      function: a CALC.Function object
 *      appearance: a CALC.Appearance object
 *   }
 * ]};
 */
CALC.Surface = (function (spec) {

    CALC.ParametricObject.call(this, spec);

}).extends(CALC.ParametricObject, {

    

});
