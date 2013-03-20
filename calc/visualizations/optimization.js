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
                    opacity: 0.1,
                    color: new CALC.Color(0, 0, 0),
                    x: 0.2,
                    y: 0.2
                },
                colorGradientParameter: 'z',
                colorGradient: {
                    '-2.5': new CALC.Color(0x00, 0x00, 0xcc, 0xff),
                    '5.0': new CALC.Color(0x00, 0xcc, 0xcc, 0xff)
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
        var points = [{}, {}, {}, {}], buttons = [], pointLabels = [], pointLabelTexts = [];
        
        
        points[0] = new THREE.Vector3(2/13*(3*sqrt(3)-1), 1/13*(-3 - 4*sqrt(3)), 0);
        points[1] = new THREE.Vector3(-2/13*(1 + 3*sqrt(3)), 1/13*(4*sqrt(3) - 3), 0);
        points[2] = new THREE.Vector3(-2/sqrt(13), -3/sqrt(13), 0);
        points[3] = new THREE.Vector3(2/sqrt(13), 3/sqrt(13), 0);

//        pointLabelTexts[0] = $('<math><msub><mi>x</mi><mn>0</mn></msub></math>');
        pointLabelTexts[0] = $('<p>Lokalt minima</p>');
        pointLabelTexts[1] = $('<p>Lokalt minima</p>');
        pointLabelTexts[2] = $('<p>Lokalt maxmia</p>');
        pointLabelTexts[3] = $('<p>Globalt maxima,</p><math><mi>z</mi><mo>=</mo><mn>50</mn></math>');


        for (var i = 0; i < 4; i++) {
            points[i].z = expr2.evaluate({x: points[i].x, y: points[i].y});
            (function (j) {
                var button = new CALC.Button3D(scope.renderers["std"], $("<p></p>"), function() {setVectorState(j);});
                button.position = points[i];
                button.setEnabled(false);
                button.setOpacity(0);
                objectBranch.add(button);
                buttons.push(button);

                var pointLabel = new CALC.Label3D(scope.renderers["std"], pointLabelTexts[i], 10, 10);
                pointLabel.position = points[i];
                objectBranch.add(pointLabel);
                pointLabel.setOpacity(0);
                pointLabels.push(pointLabel);

            })(i);
        }

        
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
                    '0.0': new CALC.Color(0xcc, 0x00, 0x22, 0x88)
                }
            }
        });



        cylinder.material.transparent = true;
        cylinder.position.z = 0.5;

        //objectBranch.add(surface2);
        
        
        objectBranch.add(surface);
        
        function rotateArrows(toAngle, milliseconds, interpolation) {
            if (arrowRotation) { arrowRotation.abort(); }
            var gradientAngle, normalAngle;
            
            toAngle %= 2*Math.PI;
            if (toAngle > Math.PI) {
                toAngle -= 2*Math.PI;
            }
            if (toAngle < -Math.PI) {
                toAngle += 2*Math.PI;
            }

            arrowRotation = CALC.animator.animate({
                milliseconds: milliseconds,
                interpolation: interpolation,
                begin: function() {
                    gradientAngle = Math.atan2(gradient.position.y, gradient.position.x);
                    normalAngle = Math.atan2(normal.position.y, normal.position.x);
                    
                    if (gradientAngle - toAngle > Math.PI) {
                        gradientAngle -= 2*Math.PI;
                    }
                    if (toAngle - gradientAngle > Math.PI) {
                        gradientAngle += 2*Math.PI;
                    }
                },
                step: function(t) { 
                    var ga = toAngle*t + gradientAngle*(1-t);
                    gradient.position.x = Math.cos(ga);
                    gradient.position.y = Math.sin(ga);
                    gradient.position.z = expr2.evaluate({x: Math.cos(ga), y: Math.sin(ga)});

                    var na = toAngle*t + normalAngle*(1-t);
                    normal.position.x = Math.cos(ga);
                    normal.position.y = Math.sin(ga);
                    normal.position.z = expr2.evaluate({x: Math.cos(ga), y: Math.sin(ga)}) - 0.05;
                },
                end: function() {}
            });


        }

        var gradient = new CALC.VectorArrow(
            new CALC.Addition({
                left: dx,
                right: CALC.parse('x/100')
            }),
            new CALC.Addition({
                left: dy,
                right: CALC.parse('y/100')
            }), 0, 0x2255cc);
        var normal = new CALC.VectorArrow(CALC.parse('x'), CALC.parse('y'), 0, 0xff2222);

        var arrowRotation;
        var pointFade, pointLabelFade;
        var zoom;

        function showPoints() {
            pointFade = CALC.animator.animate({
                milliseconds: 1000,
                interpolation: CALC.interpolations.linear,
                begin: function() {
                    if (pointFade) {
                        pointFade.abort();
                    }
                    for (var i = 0; i < 4; i++) {
                        buttons[i].setEnabled(true);
                    }
                },
                step: function(t) {
                    for (var i = 0; i < 4; i++) {
                        buttons[i].setOpacity(t*0.4);
                    }
                },
                end: function() {}
            })
        }

        function showPointLabels() {
            pointLabelFade = CALC.animator.animate({
                milliseconds: 1000,
                interpolation: CALC.interpolations.linear,
                begin: function() {
                    if (pointLabelFade) {
                        pointLabelFade.abort();
                    }
                },
                step: function(t) {
                    for (var i = 0; i < 4; i++) {
                        pointLabels[i].setOpacity(t*0.8);
                    }
                },
                end: function() {}
            })
        }


        function hidePoints() {
            pointFade = CALC.animator.animate({
                milliseconds: 1000,
                interpolation: CALC.interpolation.linear,
                begin: function() {
                    if (pointFade) {
                        pointFade.abort();
                    }

                    for (var i = 0; i < 4; i++) {
                        buttons[i].setEnabled(false);
                    }
                },
                step: function(t) {
                    for (var i = 0; i < 4; i++) {
                        buttons[i].setOpacity(0.4*(1-t));
                        pointLabels[i].setOpacity(0.8*(1-t));
                    }
                },
                end: function() {}
            })
        }

        function showArrows() {
            objectBranch.add(gradient);

            objectBranch.add(normal);
            
            function rArrows() {
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
                        normal.position.z = expr2.evaluate({x: Math.cos(ang), y: Math.sin(ang)}) - 0.05;                
                    },
                    end: function (){
                        rArrows();
                    }
                });
            }
            rArrows();
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

        function zoomTo(level) {
            var before = 0, camera = scope.renderers["std"].camera;
            zoom = CALC.animator.animate({
                milliseconds: 1000,
                interpolation: CALC.interpolations.sinusodial,
                begin: function(){
                    before = camera.getZoom();
                },
                step: function(t) {
                    camera.zoom(t*level + (1-t)*before, true);                
                },
                end: function (){
                }
            });

            console.log(objectBranch);
            CALC.animator.animateProperties({
                'object': objectBranch.position,
                parameters: {
                    x: 0, y: 0, z: 0
                },
                milliseconds: 1000,
                interpolation: CALC.interpolations.sinusodial
            });
        };
        

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


        function setVectorState(index) {
            arrowRotation.abort();
            rotateArrows(Math.atan2(points[index].y, points[index].x), 1500, CALC.interpolations.sinusodial);
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

        var $next = $('<a href="#" class="next-button">Gå vidare</a>');

        var step1 = new CALC.VisualizationStep("Funktionsytan", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv1
            })
        ], function() {
            addCylinder();
        });
        
//       Step 2
        var $fnInfoDiv2 = $('<div class="text-box"></div>');
        var $infoParagraph2a = $('<p>Den gröna vektorpilen som cirkulerar representerar ytans gradient, medan den röda pekar i cylinderns normals riktning</p>');
        var $infoParagraph2b = $('<p>Det största funktionsvärdet som uppfyller bivillkoret kommer att finnas i en punkt där dessa två vektorer är paralella, dvs då ekvationen BLAH uppfyllsx.</p>');

        $fnInfoDiv2.append($infoParagraph2a);
        $fnInfoDiv2.append($infoParagraph2b);


        var step2 = new CALC.VisualizationStep("Funktionsytan", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv2
            })], function() {
                shrink();
                showArrows();
            });
        
//       Step 3
        var $fnInfoDiv3 = $('<div class="text-box"></div>');
        var $infoParagraph3 = $('<p>Ekvationssystemet ger 4 lösningar, som alla visualiseras med varsina blå cirkar. Klicka på cirklarna för att se hur gradient och cylindernormal pekar just i dessa punkter.</p>');


        $fnInfoDiv3.append($infoParagraph3);
        $fnInfoDiv3.append($infoParagraph3);
        //var $mml2 = expr2.mathMLElement();
        //x$infoParagraph2.append($mml2);

        var step3 = new CALC.VisualizationStep("Funktionsytan", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv3
            })],
            function() {
                setVectorState(3);
                showPoints();
            });

//       Step 4
        var $fnInfoDiv4 = $('<div class="text-box"></div>');
        var $infoParagraph4 = $('<p>Genom att jämföra funktionsvärdet i de olika punkterna går det att hitta de optimala värdena</p>');


        $fnInfoDiv4.append($infoParagraph4);
        $fnInfoDiv4.append($infoParagraph4);

        var step4 = new CALC.VisualizationStep("Funktionsytan", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv4
            })],
            function() {
                setVectorState(3);
                showPointLabels();
                zoomTo(34);
            });


        this.setSteps([step0, step1, step2, step3, step4]);
        this.visitStep(0);

    }


});
