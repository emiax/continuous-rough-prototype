'use strict';
/*global CALC */

(CALC.visualizations.Optimization = function(title) {

    CALC.visualizations.Visualization.call( this, title );

}).extends(CALC.visualizations.Visualization, {

    init: function() {
        var scope = this;

        this.standardVisualizationSetup();
        var scene = this.scenes["std"];
        var camera = this.renderers["std"].camera.zoom(12, true);
        var objectBranch = new THREE.Object3D();

        
        scene.add(objectBranch);

        objectBranch.rotation = new THREE.Vector3(Math.PI / 8, 0, 2 * Math.PI / 5);

        //var boundingBox = [-1.2, -10, 10, 10];
        var resolution = 0.1;

        var expr = CALC.parse('(2*u + 3*v + 1)^2 / 25');

        var expr2 = expr.replace({u: 'x', v: 'y'});
        var dx = expr2.differentiate('x');
        var dy = expr2.differentiate('y');


        var surface = new CALC.ParametricSurface({
            x: CALC.parse('u'),
            y: CALC.parse('v'),
            z: expr,
            domain: {
                u: [-2, 2],
                v: [-2, 2]
            },
            attributes: {
                r: CALC.parse('x^2 + y^2')
            },
            constraints: {
                r: {
                    upper: 8,
                    upperFeather: 4
                }
            },
            resolution: resolution,
            appearance: {
                checkerPattern: {
                    opacity: 0.3,
                    color: new CALC.Color(0, 0, 0),
                    x: 0.2,
                    y: 0.2
                },
                colorGradientParameter: 'z',
                colorGradient: {
                    '-2.5': new CALC.Color(0x00, 0xcc, 0x00, 0xff),
                    '5.0': new CALC.Color(0x00, 0x00, 0xcc, 0xff)
                }
            }
        });

/*        var xyPlane = new CALC.ParametricSurface({
            x: CALC.parse('u'),
            y: CALC.parse('v'),
            z: CALC.parse('0'),
            domain: {
                u: [-1000, 1000],
                v: [-1000, 1000],
            },
            attributes: {},
            constraints: {},
            resolution: 1000,
            appearance: {
                checkerPattern: {
                    opacity: 0.05, 
                    color: new CALC.Color(0, 0, 0),
                    x: 1,
                    y: 1
                },
                colorGradientParameter: 'z',
                colorGradient: {
                    '0.0': new CALC.Color(0x40, 0x40, 0x40, 0x70)
                }
            }
        });
        objectBranch.add(xyPlane);*/

        var axisLength = 3;
        
        var xGeo = new THREE.Geometry();
        xGeo.vertices.push(new THREE.Vector3(-axisLength, 0, 0));
        xGeo.vertices.push(new THREE.Vector3(axisLength, 0, 0));

        var yGeo = new THREE.Geometry();
        yGeo.vertices.push(new THREE.Vector3(0, -axisLength, 0));
        yGeo.vertices.push(new THREE.Vector3(0, axisLength, 0));


        var zGeo = new THREE.Geometry();
        zGeo.vertices.push(new THREE.Vector3(0, 0, -axisLength));
        zGeo.vertices.push(new THREE.Vector3(0, 0, axisLength));


        var lineMat = new THREE.LineBasicMaterial({
            color: 0x444444
        });

        var xLabel = new CALC.AxisLabel3D(this.renderers["std"], $('<p>x</p>'));
        xLabel.position.set(axisLength, 0, 0);
        objectBranch.add(xLabel);

        var yLabel = new CALC.AxisLabel3D(this.renderers["std"], $('<p>y</p>'));
        yLabel.position.set(0, axisLength, 0);
        objectBranch.add(yLabel);

        var zLabel = new CALC.AxisLabel3D(this.renderers["std"], $('<p>z</p>'));
        zLabel.position.set(0, 0, axisLength);
        objectBranch.add(zLabel);


        
        var sqrt = Math.sqrt;
        var x0 = 2/13*(3*sqrt(3)-1), y0 = 1/13*(-3 - 4*sqrt(3)),
            x1 = -2/13*(1 + 3*sqrt(3)), y1 = 1/13*(4*sqrt(3) - 3),
            x2 = -2/sqrt(13), y2 = -3/sqrt(13),
            x3 = 2/sqrt(13), y3 = 3/sqrt(13);


        var z0 = expr2.evaluate({x: x0, y: y0});
        var z1 = expr2.evaluate({x: x1, y: y1});
        var z2 = expr2.evaluate({x: x2, y: y2});
        var z3 = expr2.evaluate({x: x3, y: y3});
           

        //x = 2/13 (3 sqrt(3)-1),   y = 1/13 (-3-4 sqrt(3))
        var button0 = new CALC.Button3D(this.renderers["std"], $("<p></p>"), function(){});
        button0.position.set(x0, y0, z0);
        objectBranch.add(button0);

        var button1 = new CALC.Button3D(this.renderers["std"], $("<p></p>"), function(){});
        button1.position.set(x1, y1, z1);
        objectBranch.add(button1);

        var button2 = new CALC.Button3D(this.renderers["std"], $("<p></p>"), function(){});
        button2.position.set(x2, y2, z2);
        objectBranch.add(button2);

        var button3 = new CALC.Button3D(this.renderers["std"], $("<p></p>"), function(){});
        button3.position.set(x3, y3, z3);
        objectBranch.add(button3);



        

        var xAxis = new THREE.Line(xGeo, lineMat);
        var yAxis = new THREE.Line(yGeo, lineMat);
        var zAxis = new THREE.Line(zGeo, lineMat);
        objectBranch.add(xAxis);
        objectBranch.add(yAxis);
        objectBranch.add(zAxis);
        

        var upperLine = new CALC.ParametricSurface({
            x: CALC.parse('u'),
            y: CALC.parse('v'),
            z: CALC.parse('(2*u + 3*v + 1)^2 / 25 + 0.01'),
            domain: {
                u: [-1.2, 1.2],
                v: [-1.2, 1.2]
            },
            attributes: {
                r: CALC.parse('x^2 + y^2'),
                zabs: CALC.parse('(v*v)^0.5'),
            },
            constraints: {
                r: {
                    lower: 0.98,
                    upper: 1.02
                },
                zabs: {
                    lower: 0,
                    upper: -1,
                    upperFeather: 2
                }
            },
            resolution: resolution,
            appearance: {
                checkerPattern: {
                    opacity: 0.0,
                    color: new CALC.Color(0, 0, 0),
                    x: 0.2,
                    y: 0.2
                },
                colorGradientParameter: 'z',
                colorGradient: {
                    '0.0': new CALC.Color(0xff, 0xff, 0xff, 0xff)
                }
            }
        });

        var lowerLine = new CALC.ParametricSurface({
            x: CALC.parse('u'),
            y: CALC.parse('v'),
            z: CALC.parse('(2*u + 3*v + 1)^2 / 25 - 0.01'),
            domain: {
                u: [-1.2, 1.2],
                v: [-1.2, 1.2]
            },
            attributes: {
                r: CALC.parse('x^2 + y^2'),
                zabs: CALC.parse('(v*v)^0.5'),
            },
            constraints: {
                r: {
                    lower: 0.98,
                    upper: 1.02
                },
                zabs: {
                    lower: 0,
                    upper: -1,
                    upperFeather: 2
                }
            },
            resolution: resolution,
            appearance: {
                checkerPattern: {
                    opacity: 0.0,
                    color: new CALC.Color(0, 0, 0),
                    x: 0.2,
                    y: 0.2
                },
                colorGradientParameter: 'z',
                colorGradient: {
                    '0.0': new CALC.Color(0xff, 0xff, 0xff, 0xff)
                }
            }
        });

        var cylinder = new CALC.ParametricSurface({
            x: CALC.parse('cos(u)'),
            y: CALC.parse('sin(u)'),
            z: CALC.parse('v'),
            domain: {
                u: [0, 2 * Math.PI],
                v: [-1.2, 1.2]
            },
            attributes: {
                zabs: CALC.parse('(v*v)^0.5')
            },
            constraints: {
                zabs: {
                    lower: 0,
                    upper: -1,
                    upperFeather: 2
                }
            },
            resolution: resolution,
            appearance: {
                checkerPattern: {
                    opacity: 0,
                    color: new CALC.Color(0, 0, 0),
                    x: 1,
                    y: 1
                },
                colorGradientParameter: 'z',
                colorGradient: {
                    '0.0': new CALC.Color(0xcc, 0x00, 0x00, 0x77)
                }
            }
        });



        cylinder.material.transparent = true;
        cylinder.position.z = 0.5;

        //objectBranch.add(surface2);
        
        
        objectBranch.add(surface);
        
        var arrowRotation;
        function showArrows() {
        
            var gradient = new CALC.VectorArrow(dx, dy, 0, 0x66ff66);
            objectBranch.add(gradient);
            var normal = new CALC.VectorArrow(CALC.parse('x'), CALC.parse('y'), 0, 0xff6666);
            objectBranch.add(normal);
            
            function rotateArrows() {
                arrowRotation = CALC.animator.animate({
                    milliseconds: 10000,
                    interpolation: CALC.interpolations.linear,
                    begin: function(){},
                    step: function(t) {
                        var ang = t * 2 * Math.PI;
                        gradient.position.x = Math.cos(ang);
                        gradient.position.y = Math.sin(ang);
                        gradient.position.z = expr2.evaluate({x: Math.cos(ang), y: Math.sin(ang)});
                        
                        normal.position.x = Math.cos(ang);
                        normal.position.y = Math.sin(ang);
                        normal.position.z = expr2.evaluate({x: Math.cos(ang), y: Math.sin(ang)});                
                    },
                    end: function (){
                        rotateArrows();
                    }
                });
            }
            rotateArrows();
        }
        
        function shrink() {
            surface.animate({
                milliseconds: 3000,
                interpolation: CALC.interpolations.easeOut,
                constraints: {
                    r: {
                        lower: 0,
                        upper: 1,
                        upperFeather: 0
                    }
                }
            });
        }



        function removeSurface() {
            surface.animate({
                milliseconds: 2000,
                interpolation: CALC.interpolations.sinusodial,
                constraints: {
                    r: {
                        lower: 1,
                        upper: 1
                    }
                }
            });
        }

        function fadeCylinder() {
            cylinder.animate({
                milliseconds: 2000,
                interpolation: CALC.interpolations.easeOut,
                constraints: {
                    zabs: {
                        upper: 1, 
                        lower: -1,
                        upperFeather: 10
                    }
                }
            });
        }

        function addCylinder() {
            objectBranch.add(cylinder);
            objectBranch.add(upperLine);
            objectBranch.add(lowerLine);

            cylinder.animate({
                milliseconds: 2000,
                interpolation: CALC.interpolations.easeOut,
                constraints: {
                    zabs: {
                        upper: 1, 
                        lower: -1,
                        upperFeather: 0
                    }
                }
            });

            setTimeout(function() {
                upperLine.animate({
                    milliseconds: 2000,
                    interpolation: CALC.interpolations.sinusodial,
                    constraints: {
                        zabs: {
                            upper: 1, 
                            lower: -1,
                            upperFeather: 10
                        }
                    }
                });
            }, 0);
               

        }

        
        function showIntersection() {
        }




/*
        setTimeout(showIntersection, 3800);

        setTimeout(shrink, 4000);
//        setTimeout(removeSurface, 5000);
        setTimeout(showArrows, 8000);
  */          
        // for (var ang = 0; ang < 2*Math.PI; ang += Math.PI / 3) {
        // var vec = new CALC.VectorArrow(Math.cos(ang), Math.sin(ang), 0, 0xffffff);
        // vec.position.x = Math.cos(ang);
        // vec.position.y = Math.sin(ang);
        // vec.position.z = expr.evaluate({u: Math.cos(ang), v: Math.sin(ang)});
        // objectBranch.add(vec);
        // }

        this.renderers["std"].mouseStrategy = new CALC.NavigationStrategy(this.renderers["std"], objectBranch);


        // Step 0
        var $fnInfoDiv0 = $('<div class="text-box"></div>');
        var $infoParagraph0 = $('<p>Betrakta funktionsytan</p>');
        $fnInfoDiv0.append($infoParagraph0);
        var $mml0 = expr2.mathMLElement();
        $infoParagraph0.append($mml0);

        var $next = $('<a href="#" class="next-button">Gå vidare</a>');
        $fnInfoDiv0.append($next);

        $next.click(function() {
            scope.visitStep(1);
            addCylinder();
        });

        var step0 = new CALC.VisualizationStep("Funktionsytan", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv0
            })
        ]);

//       Step 1
        var $fnInfoDiv1 = $('<div class="text-box"></div>');
        var $infoParagraph1 = $('<p>Vi ritar enhetscirkeln, som i tre dimensioner kan visualiseras som en cylinder </p>');
        $fnInfoDiv1.append($infoParagraph1);
        //var $mml1 = expr2.mathMLElement();
        //x$infoParagraph1.append($mml1);

        var $next = $('<a href="#" class="next-button">Gå vidare</a>');
        $fnInfoDiv1.append($next);

        $next.click(function() {
            scope.visitStep(2);
            shrink();
            showArrows();
            //fadeCylinder();
        });

        var step1 = new CALC.VisualizationStep("Funktionsytan", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv1
            })
        ]);


//       Step 2
        var $fnInfoDiv2 = $('<div class="text-box"></div>');
        var $infoParagraph2a = $('<p>Den gröna vektorpilen som cirkulerar representerar ytans gradient, medan den röda pekar i cylinderns normals riktning</p>');

        var $infoParagraph2b = $('<p>Det största funktionsvärdet som uppfyller bivillkoret kommer att finnas i en punkt där dessa två vektorer är paralella, dvs då ekvationen BLAH uppfyllsx.</p>');


        $fnInfoDiv2.append($infoParagraph2a);
        $fnInfoDiv2.append($infoParagraph2b);
        //var $mml2 = expr2.mathMLElement();
        //x$infoParagraph2.append($mml2);

        var $next = $('<a href="#" class="next-button">Gå vidare</a>');
        $fnInfoDiv2.append($next);

        $next.click(function() {
            scope.visitStep(3);
            arrowRotation.abort();
        });

        var step2 = new CALC.VisualizationStep("Funktionsytan", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv2
            })
        ]);





        this.setSteps([step0, step1, step2]);
        this.visitStep(0);

    }


});
