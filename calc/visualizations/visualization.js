'use strict';
/*global CALC, THREE, $ */

CALC.visualizations = {};

(CALC.visualizations.Visualization = function (title) {
    this.title = title;
    this.renderers = {};
    this.scenes = {};
    this.application = null;
    this.steps = [];
    this.currentStep = -1;
    this.stepLinks = [];

    this.lastRender = '';
}).extend({
    render: function (forceUpdate) {
        var renderer, geo, geoPos, camPos, r;

        function update(renderer) {
            THREE.SceneUtils.traverseHierarchy(renderer.scene, function (obj) {
                if (typeof obj.prepareFrame === 'function') {
                    obj.prepareFrame(renderer, forceUpdate);
//                    console.log(obj);
                }
            });
        }

        for (r in this.renderers) {
            if (this.renderers.hasOwnProperty(r)) {
                renderer = this.renderers[r];
                update(renderer);
                // We assume that renderer has been augmented with 'scene' and 'camera' properties.
                // This is done in visualization.attachRenderer
                if (renderer.scene && renderer.camera) {
                    renderer.render(renderer.scene, renderer.camera);
                }
            }
        }
    },


    attachRenderer: function ($elem, renderer, scene, camera) {
        var mh = CALC.mouseHandler, $domElement;

        renderer.setSize($elem.innerWidth(), $elem.innerHeight());
        // Augment renderer object with scene and camera, to simplify rendereing process
        renderer.camera = camera;
        renderer.scene = scene;
        renderer.mouseStrategy = new CALC.MouseStrategy(renderer);
        $domElement = $(renderer.domElement);
        $elem.append($domElement);

        $domElement.mousedown(function (evt) {
            mh.mouseDown(renderer.mouseStrategy, evt);
        });

        $domElement.mouseup(function (evt) {
            mh.mouseUp(renderer.mouseStrategy, evt);
        });

        $domElement.mousemove(function (evt) {
            mh.mouseMove(renderer.mouseStrategy, evt);
        });

        $domElement.mousewheel(function (evt, delta) {
            mh.mouseWheel(renderer.mouseStrategy, evt, delta);
        });

        renderer.domElement.touchStart = function (evt) {
            mh.touchStart(renderer.mouseStrategy, evt);
        };

        renderer.domElement.touchMove = function (evt) {
            mh.touchMove(renderer.mouseStrategy, evt);
        };



        return renderer;
    },

    updateRenderers: function () {
        var $panel, w, h, renderers, renderer, r;
        renderers = this.renderers;
        for (r in renderers) {
            if (renderers.hasOwnProperty(r)) {
                renderer = renderers[r];
                $panel = $(renderer.domElement).parent();
                w = $panel.innerWidth();
                h = $panel.innerHeight();
                if (w && h) {
                    renderer.setSize(w, h);
                    renderer.camera.aspect = w/h;
                    renderer.camera.updateProjectionMatrix();
                } else {
                    renderer.setSize(0, 0);
                }
            }
        }
        this.render(true);
    },

    appendTextBox: function ($panel, content) {
        var $box = $('<div class="text-box"></div>');
        $box.html(content);
        $box.hide();
        $panel.append($box);
        $box.slideDown('slow');
    },

    appendPanel: function ($panel, $content) {
        // todo: do something to preserve state somewhere..
        $panel.append($content);
    },

    clearPanel: function ($panel, $content) {
        // todo: do something to preserve state somewhere..
        $panel.html($content);
    },
    standardVisualizationSetup: function () {
        var renderer, camera, scene, origin, light;

        this.dom = $('<div id="visualization">' +
                     '<div id="main-row">' +
                     '<div id="graphics-panel"></div>' +
                     '<div id="text-panel"></div>' +
                     '</div>');

        this.panels = {
            graphics: $("#graphics-panel", this.dom),
            text: $("#text-panel", this.dom),
            navigation: $("#navigation-panel", this.dom)
        };

        renderer = new THREE.WebGLRenderer({ antialias: true });


        scene = new THREE.Scene();
        origin = new THREE.Vector3(0, 0, 0);

        //camera = new THREE.PerspectiveCamera(45, /* Temporary aspect ratio is set to 1, but will be set in updateRenderers */ 1, 1, 2000);
		camera = new CALC.Camera();

        camera.position.y = -20;
        scene.add(camera);
        camera.rotation = new THREE.Vector3(Math.PI / 2, 0, 0);//-Math.PI/2);

        light = new THREE.AmbientLight(0x282828);
        scene.add(light);

        light = new THREE.PointLight(0xFFFFFF);
        light.position = new THREE.Vector3(4, -2, 1);
        scene.add(light);

         this.scenes.std = scene;
        this.renderers.std = this.attachRenderer(this.panels.graphics, renderer, scene, camera);
    },

    setSteps: function (steps) {
        var scope = this,
            text = "",
            i,
            $a;

        this.steps = steps;
        this.stepLinks = [];

        function createVisitCallback(i) {
            return function () {
                scope.visitStep(i);
            };
        }

        for (i = 0; i < this.steps.length; i++) {
            $a = $('<a class="visualization-step">' + this.steps[i].getTitle() + '</a> ');
            $a.click(createVisitCallback(i));

            this.stepLinks.push($a);
            this.panels.navigation.append($a);
        }

    },


    visitStep: function (i) {
        if (this.stepLinks[this.currentStep]) {
            this.stepLinks[this.currentStep].removeClass("active");
        }

        if (i <= this.currentStep && this.steps[i]) {
            this.steps[this.currentStep].leave();
        }

        var step = this.steps[i];

        if (step) {
            step.visit();
            this.stepLinks[i].addClass("active");
            this.currentStep = i;
        }
    }
});
