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
        var animation = {},
            fn,
            startFrame = scheduler.frame(),
            startMillisecond = scheduler.millisecond(),
            endFrame,
            endMillisecond,
            interpolation,
            callback,
            step;
        


        if (spec.frames !== undefined) {
            endFrame = startFrame + spec.frames;
        } else if (spec.milliseconds !== undefined) {
            endMillisecond = startMillisecond + spec.milliseconds;
        } else { 
            endMillisecond = startMillisecond + 1000; 
        }
        
        interpolation = spec.interpolation || CALC.interpolations.linear;
        callback = spec.callback || function() {};
        step = spec.step;


        function f() {
            var t, x;
            
            if (endFrame !== undefined) {
                t = (scheduler.frame() - startFrame)/(endFrame - startFrame);
            } else {
                t = (scheduler.millisecond() - startMillisecond)/(endMillisecond - startMillisecond);
            }
            
            if (t > 1) t = 1;
            if (t < 0) t = 0;

            x = interpolation(t);
            step(x);

            if (t < 1) {
                scheduler.attach(f, 0);
            } else {
                callback();
            }
        };
        
        scheduler.attach(f, 0);
        return animation;
    },

    
    that.animateObjectParameters = function (spec) {
        
        var obj = spec.object,
           parameters = Object.keys(spec.parameters),
           oldParameters = {},
           newParameters = spec.parameters,
           step;

        parameters.forEach(function(p) {
            oldParameters[p] = obj[p];
        });

        step = function(x) {
            parameters.forEach(function(p) {
                var a = oldParameters[p];
                var b = newParameters[p];
                obj[p] = a + (b - a)*x;
            });
        }

        var animationSpec = {
            frames: spec.frames,
            milliseconds: spec.milliseconds,
            interpolation: spec.interpolation,
            callback: spec.callback,
            step: step
        }

        return that.animate(animationSpec);
    }

    
    return that;
}());


