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

        var label;



        
        var boundingBox = [-10, -10, 10, 10];
        var resolution = 0.2;

        var expr, tgExpr;
        
        var surface, plane, tangentButton;
        
        function createFunctionSurface(expr) {
            if (surface) {
                objectBranch.remove(surface);
            } 
            if (plane) {
                objectBranch.remove(plane);
            }

            if (tangentButton) {
                tangentButton.detach();
                objectBranch.remove(tangentButton);
            }


            surface = new CALC.FunctionSurface({
                z: expr,
                domain: {
                    x: [-10, 10],
                    y: [-10, 10]
                },
                attributes: {
                    r: CALC.parse('(x^2 + y^2)^(1/2)'),
                    d: expr.differentiate(),
                },
                constraints: {
                    r: {
                        lower: 0,
                        upper: -5,
                        upperFeather: 10
                    }
                },
                resolution: resolution,
                appearance: {
                    checkerPattern: {
                        opacity: 0.1,
                        color: new CALC.Color(0x22, 0x00, 0x00),
                        x: 1,
                        y: 1
                        
                    },
                    colorGradientParameter: 'z',
                    colorGradient: {
                        '-3': new CALC.Color(0xdd, 0x55, 0x00, 0xff),
                        '2': new CALC.Color(0xff, 0xbb, 0x00, 0xff)
                    }
                }
            });
            objectBranch.add(surface);
        }
        
        function createTangentialPlane(expr) {
            if (plane) {
                objectBranch.remove(plane);
            }
            if (tangentButton) {
                tangentButton.detach();
                objectBranch.remove(tangentButton);
            }

            plane = new CALC.FunctionSurface({
                z: expr,
                domain: {
                    x: [-10, 10],
                    y: [-10, 10]
                },
                attributes: {
                    r: CALC.parse('(x^2 + y^2)^(1/2)'),
                    d: expr.differentiate(),
                },
                constraints: {
                    r: {
                        lower: 0,
                        upper: -5,
                        upperFeather: 10
                    }
                },
                resolution: 10,
                appearance: {
                    checkerPattern: {
                        opacity: 0.1,
                        color: new CALC.Color(0x22, 0x00, 0x00),
                        x: 1,
                        y: 1
                        
                    },
                    colorGradientParameter: 'z',
                    colorGradient: {
                        '-5': new CALC.Color(0x00, 0x22, 0xaa, 0x85),
                        '5': new CALC.Color(0x00, 0x66, 0xff, 0x85)
                    }
                }
            });
            plane.material.transparent = true;
            objectBranch.add(plane);
        }
        

        var tgx =  Math.PI;
        var tgy = -Math.PI;



        function showSurface() {
            surface.animate({
                milliseconds: 3000,
                interpolation: CALC.interpolations.easeOut,
                constraints: {
                    r: {
                        upper: 20
                    }
                },
                end: function() {
                    if (!plane) {
                        createTangentialPlane(tgExpr);
                    }
                }
            });
            if (!label) {
                label = new CALC.Label3D(scope.renderers["std"], $('<math><mi>f</mi><mfenced open="(" close=")"><mrow><mi>x</mi><mo>,</mo><mi>y</mi></mwrow></mfenced></math>'));
                label.position.x = -5;
                label.position.y = -5;
                objectBranch.add(label);
            }
            
        }


        function showTangentialPlane() {
            plane.animate({
                milliseconds: 3000,
                interpolation: CALC.interpolations.easeOut,
                constraints: {
                    r: {
                        upper: 20
                    }
                }
            });
            
            
            tangentButton = new CALC.Button3D(scope.renderers["std"], $("<p></p>"), function() {});
            tangentButton.position.set(tgx, tgy, expr.evaluate({x: tgx, y: tgy}));
            objectBranch.add(tangentButton);

        }
        
        
        
        this.renderers["std"].mouseStrategy = new CALC.NavigationStrategy(this.renderers["std"], objectBranch);
        

        var $fnInputDiv = $('<div class="text-box"></div>');
        var $desc = $('<p>Välj en funktion av två variabler.</p>');
        var $input = $('<input class="function-input" value="cos(x)*sin(y)"></input>');
        var $createSurfaceButton = $('<a class="action-button">Rita ytan</a>');

        $createSurfaceButton.click(function() {
            expr = CALC.parse($input.val());
            tgExpr = CALC.tangentialPlane(expr, tgx, tgy);
            
            createFunctionSurface(expr);
            showSurface();
        });


        $fnInputDiv.append($desc);

        $fnInputDiv.append($input);
        $fnInputDiv.append($createSurfaceButton);


        var $tgDiv = $('<div class="text-box"></div>');
        var $descTg = $('<p>Välj en punkt där du vill räkna ut ett tangentplan</p>');
        var $inputX = $('<input class="scalar-input" value="0"></input>');
        var $inputY = $('<input class="scalar-input" value="0"></input>');
        var $createPlaneButton = $('<a class="action-button">Rita tangentplanet</a>');
        
        $createPlaneButton.click(function () {
            tgx = parseFloat($inputX.val());
            tgy = parseFloat($inputY.val());
            
            tgExpr = CALC.tangentialPlane(expr, tgx, tgy);
            
            createTangentialPlane(tgExpr);

            showTangentialPlane();

        });

        $tgDiv.append($descTg);
        $tgDiv.append($inputX);
        $tgDiv.append($inputY);
        $tgDiv.append($createPlaneButton);


        var step0 = new CALC.VisualizationStep("", [
            new CALC.TextPanelAction({
                panel: this.panels.text,
                elem: $fnInputDiv
            })
        ]);
        
        
        var step1 = new CALC.VisualizationStep("", [
            new CALC.TextPanelAction({
                panel: this.panels.text,
                elem: $tgDiv
            })
        ], function() {
            if (!expr) {
                expr = CALC.parse($input.val());

                createFunctionSurface(expr);
                showSurface();
            }
        });



        this.setSteps([step0, step1]);
        this.visitStep(0);

        
        
    }
    

});
