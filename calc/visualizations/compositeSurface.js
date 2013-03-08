'use strict';
/*global CALC, THREE */

(CALC.visualizations.CompositeSurface = function (title) {
    CALC.visualizations.Visualization.call(this, title);
}).extends(CALC.visualizations.Visualization, {

    init: function () {
        var scope, scene, vector, helper, trans1, trans2, step0;

        scope = this;
        this.standardVisualizationSetup();

        scene = this.scenes.std;


        var objectBranch = new THREE.Object3D();        
        scene.add(objectBranch);

        var testFun1 = new CALC.Function({
            domain: {
                s: [0, 2*Math.PI],
                t: [0, 2]
            },
            values: {
                x: CALC.parse('t*cos(s)'), 
                y: CALC.parse('t*sin(s)'),
                z: CALC.parse('-2')
            },
            tessellationDistance: 0.2
        });

        var testFun2 = new CALC.Function({
            domain: {
                s: [0, 2*Math.PI],
                t: [-2, 2]
            },
            values: {
                x: CALC.parse('2*cos(s)'), 
                y: CALC.parse('2*sin(s)'),
                z: CALC.parse('t')
            },
            tessellationDistance: 0.2
        });

        var testFun3 = new CALC.Function({
            domain: {
                s: [0, 2*Math.PI],
                t: [1.5, 2]
            },
            values: {
                x: CALC.parse('t*cos(s)'), 
                y: CALC.parse('t*sin(s)'),
                z: CALC.parse('2'),
                u: CALC.parse('sin(s)')
            },
            tessellationDistance: 0.20
        });


        var testBottom = new CALC.Function({
            domain: {
                x: [-4, 4],
                y: [-4, 4]
            },
            values: {
                z: CALC.parse('cos(x) * sin(y)'), 
            },
            tessellationDistance: 0.20
        });

        var testAppearance1 = new CALC.SurfaceAppearance([
            new CALC.GradientLayer('t', new CALC.ColorGradient({                
                '0': new CALC.Color(0xbb, 0xbb, 0xbb, 0x70),
                '2': new CALC.Color(0xee, 0xee, 0xee, 0x70)
            })),
            new CALC.CheckerLayer({
                z: 0.2,
                color: new CALC.Color(180, 180, 130)
            })]
        );


        var testAppearance2 = new CALC.SurfaceAppearance([
            new CALC.GradientLayer('t', new CALC.ColorGradient({                
                '0': new CALC.Color(0x00, 0xbb, 0xbb, 0x70),
                '2': new CALC.Color(0x00, 0xee, 0xee, 0x70)
            })),
            new CALC.CheckerLayer({
                z: 0.2,
                color: new CALC.Color(180, 180, 0)
            })]
        );



        var testAppearance3 = new CALC.SurfaceAppearance([
            new CALC.GradientLayer('t', new CALC.ColorGradient({                
                '0': new CALC.Color(0xbb, 0x00, 0x00, 0x70),
                '2': new CALC.Color(0xee, 0x00, 0x00, 0x70)
            })),
            new CALC.CheckerLayer({
                z: 0.2,
                color: new CALC.Color(180, 180, 0)
            })]
        );





        var testSurface = new CALC.Surface([
            {
                'function': testFun1,
                'appearance': testAppearance1
            },
            {
                'function': testFun3,
                'appearance': testAppearance1
            },
            {
             
                'function': testFun2,
                'appearance': testAppearance2
            },
            {
                'function': testBottom,
                'appearance': testAppearance3
            }

        ]);
        
        objectBranch.add(testSurface);
        scene.add(objectBranch);

        step0 = new CALC.VisualizationStep("Composite surface", []);

        this.setSteps([step0]);
        this.visitStep(0);
        this.renderers["std"].mouseStrategy = new CALC.NavigationStrategy(this.renderers["std"], objectBranch);
    }
});
