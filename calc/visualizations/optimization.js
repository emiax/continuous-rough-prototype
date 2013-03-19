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

        var surface2 = new CALC.ParametricSurface({
            x: CALC.parse('u'),
            y: CALC.parse('v'),
            z: expr,
            domain: {
                u: [-1.2, 1.2],
                v: [-1.2, 1.2]
            },
            attributes: {
                r: CALC.parse('x^2 + y^2')
            },
            constraints: {
                r: {
                    upper: 1
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
                    '-5.0': new CALC.Color(0xcc, 0x00, 0x00, 0xff),
                    '0.0': new CALC.Color(0x00, 0xcc, 0x00, 0xff),
                    '5.0': new CALC.Color(0x00, 0x00, 0xcc, 0xff)
                }
            }
        });

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


        var expr2 = expr.replace({u: 'x', v: 'y'});
        var dx = expr2.differentiate('x');
        var dy = expr2.differentiate('y');

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
        var $infoParagraph2a = $('<p>Det största funktionsvärdet som uppfyller bivillkoret kommer att finnas i en punkt där ytans gradient är paralell med cylinderns normal.</p>');
        var $infoParagraph2b = $('<p>Den gröna vektorpilen som cirkulerar representerar ytans gradient, medan den röda pekar i normalens riktning</p>');

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
