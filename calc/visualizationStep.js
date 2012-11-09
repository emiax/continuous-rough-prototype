'use strict';
/*global CALC */

(CALC.VisualizationStep = function (title, actions) {
    this.title = title;
    this.actions = actions;
}).extend({
    getTitle: function () {
        return this.title;
    },

    visit: function () {
        var i;
        for (i = 0; i < this.actions.length; i++) {
            this.actions[i].perform();
        }
    },

    leave: function () {
        var i;
        for (i = 0; i < this.actions.length; i++) {
            this.actions[i].unperform();
        }
    }
});


//VISUALIZATION ACTION - to be moved to a separate file.
(CALC.VisualizationAction = function () {}).extend({
    perform: function () {
        throw new CALC.AbstractCallException();
    },
    unperform: function () {
        throw new CALC.AbstractCallException();
    }
});




// ABSOLUTE ROTATION - to be moved to a separate file.
(CALC.AbsoluteRotationAction = function (spec) {
    this.object = spec.object;
    this.x = spec.x;
    this.y = spec.y;
    this.z = spec.z;
    this.duration = spec.duration;
    this.delay = spec.delay;
    this.interpolation = spec.interpolation;
}).extends(CALC.VisualizationAction, {
    perform: function () {
        CALC.rotate(this.object, {x: this.x, y: this.y, z: this.z}, {duration: this.duration, interpolation: this.interpolation});
    },

    unperform: function () {
        // do nothing!
    }
});


//TextPanelAction - to be moved to a separate file.
(CALC.TextPanelAction = function (spec) {
    this.panel = spec.panel;
    this.elem = spec.elem;
}).extends(CALC.VisualizationAction, {
    perform: function () {
        //console.log("perform!");
        //this.elem.stop().hide();
        this.panel.append(this.elem);
        //this.elem.slideDown('slow');
    },

    unperform: function () {
        //console.log("unperform!");
        //this.elem.stop().slideUp('slow');
        this.elem.detach();
    }
});

//FadeAction - to be moved to a separate file.
(CALC.FadeAction = function (spec) {
    this.material = spec.material;
    this.opacity = spec.opacity;
    this.duration = spec.duration;
}).extends(CALC.VisualizationAction, {
    perform: function () {
        CALC.fade(this.material, {opacity: this.opacity }, {duration: this.duration, interpolation: this.interpolation});
    },

    unperform: function () {
        //do nothing
    }
});

//PerspectiveAction - to be moved to a separate file.
(CALC.CameraAction = function (spec) {
    this.camera = spec.camera;
    this.perspective = spec.perspective;
    this.zoom = spec.zoom;

    this.duration = spec.duration;
    this.delay = spec.delay;
    this.interpolation = spec.interpolation;
}).extends(CALC.VisualizationAction, {
    perform: function () {
        CALC.animateCamera(this.cameraBranch, {perspective: this.perspective, zoom: this.zoom }, {duration: this.duration, interpolation: this.interpolation});
    },

    unperform: function () {
        //do nothing
    }
});



//MaterialUniformAction - to be moved to a separate file.
(CALC.MaterialUniformAction = function (spec) {
    var v;

    this.material = spec.material;
    delete spec.material;

    this.duration = spec.duration;
    delete spec.duration;

    this.delay = spec.delay;
    delete spec.delay;

    this.interpolation = spec.interpolation;
    delete spec.interpolation;

    this.parameters = {};
    for (v in spec) {
        if (spec.hasOwnProperty(v)) {
            this.parameters[v] = spec[v];
        }
    }
}).extends(CALC.VisualizationAction, {
    perform: function () {
        var k, params = this.parameters;
        for (k in params) {
            if (params.hasOwnProperty(k)) {
                CALC.animate(this.material.uniforms[k], {
                    value: params[k],
                }, this.duration, this.interpolation, this.delay, null, null);
            }
        }
    },
    unperform: function () {
        //do nothing
    }
});
