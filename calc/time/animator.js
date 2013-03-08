'use strict';
/*global CALC */

CALC.animator = (function () {
    var that = {},
        scheduler = CALC.scheduler;

    /*
     * spec = {
     *    frames: a number, (or milliseconds: a number,)
     *    interpolation: CALC.interpolations.linear, ( function(0 < t < 1) -> 0 < x < 1
     *    callback: a function to be invoked when animation has finished
     *    step: function(x) -> fn(), where 0 < x < 1
     * }
     */
    that.animate = function (spec) {
        var animation = new CALC.Animation(spec);
        animation.start();
        return animation;
    },

    
    that.animateProperties = function (spec) {
        
        var obj = spec.object,
           parameters = Object.keys(spec.parameters),
           oldParameters = {},
           newParameters = spec.parameters,
           begin,
           step,
           beforeStep = spec.beforeStep || function () {},
           afterStep = spec.afterStep || function () {};

        begin = function() {
            parameters.forEach(function(p) {
                oldParameters[p] = obj[p];
            });
        };
        
        step = function(x) {
            beforeStep();
            parameters.forEach(function(p) {
                var a = oldParameters[p];
                var b = newParameters[p];
                obj[p] = a + (b - a)*x;
            });
            afterStep();
        }

        var animationSpec = {
            frames: spec.frames,
            milliseconds: spec.milliseconds,
            interpolation: spec.interpolation,
            begin: begin,
            step: step,
            end: spec.end
        }

        return that.animate(animationSpec);
    }

    
    return that;
}());