'use strict';
/*global CALC, THREE */

(CALC.visualizations.VectorTest = function (title) {
    CALC.visualizations.Visualization.call(this, title);
}).extends(CALC.visualizations.Visualization, {

    init: function () {
        var scope, scene, vector, helper, trans1, trans2, step0;

        scope = this;
        this.standardVisualizationSetup();

        scene = this.scenes.std;
        vector = new CALC.VectorArrow(3, -3, 3, 0xff0000);
        helper = new THREE.AxisHelper(0.000002);


        var objectBranch = new THREE.Object3D();        
        scene.add(objectBranch);

        objectBranch.add(vector);


        var cylinder = new CALC.ParametricSurface({
            x: CALC.parse('2*cos(s)'), 
            y: CALC.parse('2*sin(s)'),
            z: CALC.parse('t'),
            resolution: 0.2,
            attributes: {},
            constraints: {},
            domain: {
                s: [0, 2*Math.PI],
                t: [0, 2]
            },
            appearance: {
                checkerPattern: {
                    opacity: 0.2,
                    color: new CALC.Color(180, 180, 130),
                    z: 0.1
                },
                colorGradientParameter: 'z',
                colorGradient: {
                    '0': new CALC.Color(0xbb, 0xbb, 0xbb, 0x70),
                    '2': new CALC.Color(0xee, 0xee, 0xee, 0x70)
                }
            }

        });
        objectBranch.add(cylinder);
        cylinder.material.transparent = true;
        

        var xVector = new CALC.VectorArrow(1, 0, 0, 0xff0000);
        var yVector = new CALC.VectorArrow(0, 1, 0, 0x00ff00);
        var zVector = new CALC.VectorArrow(0, 0, 1, 0x0000ff);
        objectBranch.add(xVector);
        objectBranch.add(yVector);
        objectBranch.add(zVector);
        

        var funSurface = new CALC.FunctionSurface({
            z: CALC.parse('0.8*x^2 + 0.3*y^2'),
            resolution: 0.2,
            attributes: {
                r: CALC.parse('x^2 + y^2')
            },
            constraints: {},
            domain: {
                x: [-3, 3],
                y: [-3, 3]
            },
            appearance: {
                checkerPattern: {
                    opacity: 0.2,
                    color: new CALC.Color(180, 180, 130),
                    z: 0.1
                },
                colorGradientParameter: 'z',
                colorGradient: {
                    '0': new CALC.Color(0xbb, 0x00, 0x00, 0x70),
                    '3': new CALC.Color(0xbb, 0x22, 0x00, 0x70)
                }
            }
        });

        objectBranch.add(funSurface);
//        funSurface.position.x = 10;
        funSurface.material.transparent = true;
        
//        cylinder.material.opacity = 0.5;
        
        scene.add(objectBranch);

//        objectBranch.add(helper);

        vector.position.x = 0

        trans1 = function () {
            //CALC.translate(vector, {x: -5, z: -2}, {duration: 100, interpolation: CALC.interpolations.linear}, trans2);

            CALC.animator.animateProperties({
                object: vector.position,
                parameters: {
                    x: 10,
                    y: 0, 
                    z: 0
                },
                beforeStep: function() {

                },
                milliseconds: 1000
/*                end: function() {
                    trans2();
                }*/
            })
        };

        trans2 = function () {
            CALC.translate(vector, {x: 5, z: 2}, {duration: 100, interpolation: CALC.interpolations.linear}, trans1);
        };

       //trans1();

        step0 = new CALC.VisualizationStep("Vektor", []);

        this.setSteps([step0]);
        this.visitStep(0);
        this.renderers["std"].mouseStrategy = new CALC.NavigationStrategy(this.renderers["std"], objectBranch);
    }
});
