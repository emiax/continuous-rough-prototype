'use strict';
/*global CALC */

(CALC.visualizations.TangentialPlane = function(title) {

    CALC.visualizations.Visualization.call( this, title );

}).extends(CALC.visualizations.Visualization, {

    init: function() {
        var scope = this;
        
        this.standardVisualizationSetup();
        var scene = this.scenes["std"];
        var objectBranch = new THREE.Object3D();
        
        scene.add(objectBranch);

        var label = new CALC.Label3D(this.renderers["std"], $('<p style="font-weight: bold;">f(x, y)</p>'));
        label.position.x = 0;
        label.position.y = 0;
        
        var boundingBox = [-10, -10, 10, 10];
        var resolution = 0.2;
        
        objectBranch.add(label);

        var expr = CALC.parse('sin(x)*cos(y)');
        
        var surface = new CALC.FunctionSurface({
            z: CALC.parse('sin(x)*cos(y) + x/2'),
            domain: {
                x: [-10, 10],
                y: [-10, 10]
            },
            attributes: {
                r: CALC.parse('((x+3)^2 + y^2)^(1/2)'),
                d: expr.differentiate(),
            },
            constraints: {
                /*r: {
                    lower: 7,
                    upper: 8,
                    upperFeather: 0.2
                }*/
            },
            resolution: resolution,
            appearance: {
                checkerPattern: {
                    opacity: 0.3,
                    color: new CALC.Color(255, 255, 255),
                    x: 1,
                    y: 1
                    
                },
                colorGradientParameter: 'd',
                colorGradient: {
                    '-1': new CALC.Color(0xbb, 0x00, 0x00),
                    '1': new CALC.Color(0x00, 0x99, 0x00)
                }
            }
        });
        
        objectBranch.add(surface);

        var surface2 = new CALC.FunctionSurface({
            z: CALC.parse('sin(x)*cos(y) + y/3'),
            domain: {
                x: [-10, 10],
                y: [-10, 10]
            },
            attributes: {
                r: CALC.parse('((x-3)^2 + y^2)^(1/2)'),
                d: expr.differentiate(),
            },
            constraints: {
                r: {
                    lower: 6,
                    upper: 7,
                    upperFeather: 0.2
                }
            },
            resolution: resolution,
            appearance: {
                checkerPattern: {
                    opacity: 0.3,
                    color: new CALC.Color(255, 255, 255),
                    x: {
                        distance: 0.4,
                        offset: 2
                    },
                    y: {
                        distance: 0.4,
                        offset: 1
                    }
                    
                },
                colorGradientParameter: 'r',
                colorGradient: {
                    '3': new CALC.Color(0xbb, 0x00, 0x00),
                    '5': new CALC.Color(0x00, 0xbb, 0x00),
                    '7': new CALC.Color(0x00, 0x80, 0xbb)
                }
            }
        });
        
        objectBranch.add(surface2);
        
        
        this.animate1 = function() {
            CALC.animator.animateProperties({
                object: surface2.rotation,
                frames: 100,
                parameters: {
                    x: 1,
                    y: 1
                },          
                end: scope.animate2,
                interpolation: CALC.interpolations.sinusodial
            });

            surface2.animate({
                frames: 100,
                interpolation: CALC.interpolations.sinusodial,
                checkerOpacity: 0.3,
                /*constraints: {
                    r: {
                        upper: 8,
                        lower: 7
                        
                    }
                }*/
            });

            surface.animate({
                frames: 100,
                interpolation: CALC.interpolations.sinusodial,
                constraints: {
                    /*r: {
                        lower: 4,
                        upper: 6
                    }*/
                }
            });

        };

        
        this.animate2 = function () {
            CALC.animator.animateProperties({
                object: surface2.rotation,
                frames: 100,
                parameters: {
                    x: 0,
                    y: 0
                },
                interpolation: CALC.interpolations.sinusodial,
                end: scope.animate1
            });   

            surface2.animate({
                frames: 100,
                interpolation: CALC.interpolations.sinusodial,
                checkerOpacity: 1,
                /*constraints: {
                    r: {
                        lower: 6,
                        upper: 7
                    }
                }*/
            });

            surface.animate({
                frames: 100,
                interpolation: CALC.interpolations.sinusodial,
                constraints: {
                    /*r: {
                        lower: 6,
                        upper: 8
                    }*/
                }
            });
        };
            
        this.animate1();
        
        this.renderers["std"].mouseStrategy = new CALC.NavigationStrategy(this.renderers["std"], objectBranch);

    }
    

});
