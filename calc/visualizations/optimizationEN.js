'use strict';
/*global CALC */

(CALC.visualizations.OptimizationEN = function(title) {

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
        var r2 = CALC.parse('x^2 + y^2');
        

        var dx = CALC.parse('(8*x + 12*y + 4) / 25'); //expr2.differentiate('x');
        var dy = CALC.parse('(12*x + 18*y + 6) / 25');
//        var dy = expr2.differentiate('y');
        
        var dxMml = dx.mathML();
        var dyMml = dx.mathML();


        var exprMmlNum = CALC.parse('(2*x + 3*y + 1)^2').mathML();
        var dxMmlNum = CALC.parse('4*(2*x + 3*y + 1)').mathML();
        var dyMmlNum = CALC.parse('6*(2*x + 3*y + 1').mathML();
        
        var fxyMml = '<mi>f</mi><mfenced open="(" close=")"><mrow><mi>x</mi><mo>,</mo><mi>y</mi></mrow></mfenced>'
        var gxyMml = '<mi>g</mi><mfenced open="(" close=")"><mrow><mi>x</mi><mo>,</mo><mi>y</mi></mrow></mfenced>'
        var r2Mml = r2.mathML();



        var surface = new CALC.ParametricSurface({
            x: CALC.parse('u'),
            y: CALC.parse('v'),
            z: expr,
            domain: {
                u: [-2, 2],
                v: [-2, 2]
            },
            attributes: {
                r: r2
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

        var xLabel = new CALC.AxisLabel3D(this.renderers["std"], $('<math><mi>x</mi></math>'));
        xLabel.position.set(axisLength, 0, 0);
        objectBranch.add(xLabel);

        var yLabel = new CALC.AxisLabel3D(this.renderers["std"], $('<math><mi>y</mi></math>'));
        yLabel.position.set(0, axisLength, 0);
        objectBranch.add(yLabel);

        var zLabel = new CALC.AxisLabel3D(this.renderers["std"], $('<math><mi>z</mi></math>'));
        zLabel.position.set(0, 0, axisLength);
        objectBranch.add(zLabel);


        
        var sqrt = Math.sqrt;
        var points = [{}, {}, {}, {}], buttons = [], pointLabels = [], pointLabelTexts = [];
        
        
        points[0] = new THREE.Vector3(2/13*(3*sqrt(3)-1), 1/13*(-3 - 4*sqrt(3)), 0);
        points[1] = new THREE.Vector3(-2/13*(1 + 3*sqrt(3)), 1/13*(4*sqrt(3) - 3), 0);
        points[2] = new THREE.Vector3(-2/sqrt(13), -3/sqrt(13), 0);
        points[3] = new THREE.Vector3(2/sqrt(13), 3/sqrt(13), 0);

//        pointLabelTexts[0] = $('<math><msub><mi>x</mi><mn>0</mn></msub></math>');
//        pointLabelTexts[0] = $('<p>Lokalt min</p>');
 //       pointLabelTexts[1] = $('<p>Lokalt min</p>');
        pointLabelTexts[0] = $('Local man, <math><mi>f</mi><mfenced open="(" close=")"><mrow><msub><mi>x</mi><mn>0</mn></msub><mo>,</mo><msub><mi>y</mi><mn>0</mn></msub></mrow></mfenced><mo>=</mo><mn>0</mn></math>');

        pointLabelTexts[1] = $('Local min, <math><mi>f</mi><mfenced open="(" close=")"><mrow><msub><mi>x</mi><mn>1</mn></msub><mo>,</mo><msub><mi>y</mi><mn>1</mn></msub></mrow></mfenced><mo>=</mo><mn>0</mn></math>');


        pointLabelTexts[2] = $('Local max, <math><mi>f</mi><mfenced open="(" close=")"><mrow><msub><mi>x</mi><mn>2</mn></msub><mo>,</mo><msub><mi>y</mi><mn>2</mn></msub></mrow></mfenced><mo>=</mo><msup><mrow><mfenced open="(" close=")"><mrow><msqrt><mn>13</mn></msqrt><mo>-</mo><mn>1</mn></mrow></mfenced></mrow><mn>2</mn></msup></math>');
        pointLabelTexts[3] = $('Global max, <math><mi>f</mi><mfenced open="(" close=")"><mrow><msub><mi>x</mi><mn>3</mn></msub><mo>,</mo><msub><mi>y</mi><mn>3</mn></msub></mrow></mfenced><mo>=</mo><msup><mrow><mfenced open="(" close=")"><mrow><msqrt><mn>13</mn></msqrt><mo>+</mo><mn>1</mn></mrow></mfenced></mrow><mn>2</mn></msup></math>');
            

        for (var i = 0; i < 4; i++) {
            points[i].z = expr2.evaluate({x: points[i].x, y: points[i].y});
            (function (j) {
                var button = new CALC.Button3D(scope.renderers["std"], $("<p></p>"), function() {
                    setVectorState(j);
                }, function() {
                    $("#sol" + j).addClass('hover');
                }, function() {
                    $("#sol" + j).removeClass('hover');
                });

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
                    '0.0': new CALC.Color(0xcc, 0x00, 0x22, 0x44)
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
            gradient.position.set(1, 0, expr2.evaluate({x: 0, y: 1}));
            normal.position.set(1, 0, expr2.evaluate({x: 0, y: 1}) - 0.05);



            objectBranch.add(gradient);
            objectBranch.add(normal);
            
            function rArrows() {
                arrowRotation = CALC.animator.animate({
                    milliseconds: 10000,
                    interpolation: CALC.interpolations.linear,
                    begin: function(){
                        

                    },
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
            
            $(".boxbutton").removeClass('selected');
            $("#sol" + index).addClass('selected');
/*            buttons.forEach(function (button) {
                button.setOpacity(0.4);
            });
            buttons[index].setOpacity(0.9);*/

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

        var $infoParagraph0a = $('<p>Optimization with equality constraints means finding the extreme values of a function given the fulfillment of an equation. Here follows an example, where we will explain how to find the greatest value that a function genererates on its intersection with the unit circle.</p>');

        var $infoParagraph0b = $('<p>Consider the function </p>');
        $fnInfoDiv0.append($infoParagraph0a);
        $fnInfoDiv0.append($infoParagraph0b);



//        var fxy = '<mi>f</mi><mo>(</mo><mi>x</mi><mo>,</mo><mi>y</mi><mo>)</mo>';
        var $mml0 = $('<math>' + fxyMml + '<mo>=</mo>' +  exprMmlNum + '</math>');
        $infoParagraph0b.append($mml0);

        var step0 = new CALC.VisualizationStep("Funktionsytan", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv0
            })
        ]);

//       Step 1
        var $fnInfoDiv1 = $('<div class="text-box"></div>');
        var $infoParagraph1a = $('<p>Let us plot our constraint <math>' + r2Mml + '<mo>=</mo><mn>1</mn>' + '</math>. In three dimentions, the unit circle can be visualized as a cylinder.</p>');

        var $infoParagraph1b = $('<p>We are searching for the greatest value of <math>' + fxyMml + '</math> along the intersection with the cylinder.</p>');


        $fnInfoDiv1.append($infoParagraph1a);
        $fnInfoDiv1.append($infoParagraph1b);


        var step1 = new CALC.VisualizationStep("The Surface", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv1
            })
        ], function() {
            addCylinder();
        });
        

        var nablaMml = '<mo mathvariant="bold">&nabla;</mo>';
//        var nMml = '<mi mathvariant="bold">n</mi>';

//       Step 2
        var $fnInfoDiv2 = $('<div class="text-box"></div>');

        var $infoParagraph2a = $('<p>The largest value fullfilling the constraint will be found in a position where the gradient of <math>' + fxyMml + '</math> <em>is parallel to</em> the gradient of <math><mi>g</mi><mfenced open="(" close=")"><mrow><mi>x</mi><mo>,</mo><mi>y</mi></mrow></mfenced><mo>=</mo>' + r2Mml + '</math>. We can see that </p><math style="color: #800">' + nablaMml + gxyMml + '<mo>=</mo><mfenced><mtable><mtr><mtd><mn>2</mn><mi>x</mi></mtd></mtr><mtr><mtd><mn>2</mn><mi>y</mi></mtd></mtr></mtable></mfenced></math> <p>is parallel to the normal of the cylinder. We can also derive </p>');



        var $infoParagraph2b = $('<p><math style="color: #008">' + nablaMml + fxyMml + '<mo>=</mo><mfenced><mtable><mtr><mtd>' + dxMmlNum + '</mtd></mtr><mtr><mtd>' + dyMmlNum + '</mtd></mtr></mtable></mfenced></math>');

        var $infoParagraph2c = $('<p>The blue vector <math style="color: #008">' + nablaMml + '<mi>f</mi></math> orbiting the cylinder represents the gradient of the of the function, while the red vector <math style="color: #800">' + nablaMml + '<mi>g</mi></math> is pointing in the direction of the cylinder\'s normal.</p>');

/*        var $infoParagraph2d = $('<p>Potentiella max- och min-punkter finns där följande ekvationssystem uppfylls.</p>');

        var eq1Mml = '<mtr><mtd columnalign="right"><mi>&lambda;</mi><mi>x</mi></mtd><mo>=</mo><mtd columnalign="left">' + dxMmlNum + '</mtd></mtr>';
        var eq2Mml = '<mtr><mtd columnalign="right"><mi>&lambda;</mi><mi>y</mi></mtd><mo>=</mo><mtd columnalign="left">' + dyMmlNum + '</mtd></mtr>';
        var eq3Mml = '<mtr><mtd columnalign="right"><mn>1</mn></mtd><mo>=</mo><mtd columnalign="left">' + r2Mml + '</mtd></mtr>';
*/

        var $infoParagraph2d = $('<p>The vectors are parallel if and only if </p><math><mfenced open="|" close="|"><mtable><mtr><mtd>' + dxMmlNum  + '</mtd><mtd>' + dyMmlNum + '</mtd></mtr><mtr><mtd><mn>2</mn><mi>x</mi></mtd><mtd><mn>2</mn><mi>y</mi></mtd></mtr></mtable></mfenced><mo>=</mo><mn>0</mn></math>');


        //var $infoParagraph2e = $('<p><math><mrow><mo>{</mo><mtable>' + eq1Mml + eq2Mml + eq3Mml + '</mtable></math></p>');







        $fnInfoDiv2.append($infoParagraph2a);
        $fnInfoDiv2.append($infoParagraph2b);
        $fnInfoDiv2.append($infoParagraph2c);
        $fnInfoDiv2.append($infoParagraph2d);
        //$fnInfoDiv2.append($infoParagraph2e);


        var step2 = new CALC.VisualizationStep("Funktionsytan", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv2
            })], function() {
                shrink();
                showArrows();
            });
        
        var sol0 = '<msub><mi>x</mi><mn>0</mn></msub><mo>=</mo><mfrac><mn>2</mn><mn>13</mn></mfrac><mfenced open="(" close=")"><mrow><mn>3</mn><msqrt><mn>3</mn></msqrt><mo>-</mo><mn>1</mn></mrow></mfenced><mo>,</mo>' + 
                   '<msub><mi>y</mi><mn>0</mn></msub><mo>=</mo><mo>-</mo><mfrac><mn>1</mn><mn>13</mn></mfrac><mfenced open="(" close=")"><mrow><mn>4</mn><msqrt><mn>3</mn></msqrt><mo>+</mo><mn>3</mn></mrow></mfenced>';

        var sol1 = '<msub><mi>x</mi><mn>1</mn></msub><mo>=</mo><mo>-</mo><mfrac><mn>2</mn><mn>13</mn></mfrac><mfenced open="(" close=")"><mrow><mn>3</mn><msqrt><mn>3</mn></msqrt><mo>+</mo><mn>1</mn></mrow></mfenced><mo>,</mo>' + 
                   '<msub><mi>y</mi><mn>1</mn></msub><mo>=</mo><mfrac><mn>1</mn><mn>13</mn></mfrac><mfenced open="(" close=")"><mrow><mn>4</mn><msqrt><mn>3</mn></msqrt><mo>-</mo><mn>3</mn></mrow></mfenced>';

        var sol2 = '<msub><mi>x</mi><mn>2</mn></msub><mo>=</mo><mo>-</mo><mfrac><mn>2</mn><msqrt><mn>13</mn></msqrt></mfrac><mo>,</mo>' + 
                   '<msub><mi>y</mi><mn>2</mn></msub><mo>=</mo><mo>-</mo><mfrac><mn>3</mn><msqrt><mn>13</mn></msqrt></mfrac>';

        var sol3 = '<msub><mi>x</mi><mn>3</mn></msub><mo>=</mo><mfrac><mn>2</mn><msqrt><mn>13</mn></msqrt></mfrac><mo>,</mo>' + 
                   '<msub><mi>y</mi><mn>3</mn></msub><mo>=</mo><mfrac><mn>3</mn><msqrt><mn>13</mn></msqrt></mfrac>';




//       Step 3
        var $fnInfoDiv3 = $('<div class="text-box"></div>');

                var $infoParagraph3 = $('<p>Along with the constraints, the determinant equation generates the following roots: </p><a class="boxbutton" id="sol0"><div class="smallButton"></div><math>' + sol0 + '</math></a><a class="boxbutton" id="sol1"><div class="smallButton"></div><math>' + sol1 + '</math></a><a class="boxbutton" id="sol2"><div class="smallButton"></div><math>' + sol2 + '</math></a><a class="boxbutton" id="sol3"><div class="smallButton"></div><math>' + sol3 + '</math></a>The four roots are visaulized as white circles. Click on the circles or on the expressions above to see how the gradient and the normal of the cylinder are pointing in these positions.</p>');

        $fnInfoDiv3.append($infoParagraph3);
        //var $mml2 = expr2.mathMLElement();
        //x$infoParagraph2.append($mml2);

        var step3 = new CALC.VisualizationStep("Funktionsytan", [
            new CALC.TextPanelAction({
                panel:          this.panels.text,
                elem:           $fnInfoDiv3
            })],
            function() {
                setVectorState(0);
                showPoints();
                $('#sol0').click(function() {
                    setVectorState(0);                    
                });
                $('#sol1').click(function() {
                    setVectorState(1);
                });
                $('#sol2').click(function() {
                    setVectorState(2);
                });
                $('#sol3').click(function() {
                    setVectorState(3);
                });

                $('#sol0').hover(function() {
                    buttons.forEach(function (button) {
                        button.setOpacity(0.4);
                    });
                    buttons[0].setOpacity(0.9);
                }, function () {
                    buttons.forEach(function (button) {
                        button.setOpacity(0.4);
                    });
                });
                $('#sol1').hover(function() {
                    buttons.forEach(function (button) {
                        button.setOpacity(0.4);
                    });
                    buttons[1].setOpacity(0.9);
                }, function () {
                    buttons.forEach(function (button) {
                        button.setOpacity(0.4);
                    });
                });

                $('#sol2').hover(function() {
                    buttons.forEach(function (button) {
                        button.setOpacity(0.4);
                    });
                    buttons[2].setOpacity(0.9);
                }, function () {
                    buttons.forEach(function (button) {
                        button.setOpacity(0.4);
                    });
                });

                $('#sol3').hover(function() {
                    buttons.forEach(function (button) {
                        button.setOpacity(0.4);
                    });
                    buttons[3].setOpacity(0.9);
                }, function () {
                    buttons.forEach(function (button) {
                        button.setOpacity(0.4);
                    });
                });



            });

//       Step 4
        var $fnInfoDiv4 = $('<div class="text-box"></div>');


        var $infoParagraph4 = $('<p>We can now find the greatest value by comparing the function values in the four points. <math><mi>f</mi><mfenced open="(" close=")"><mrow><msub><mi>x</mi><mn>3</mn></msub><mo>,</mo><msub><mi>y</mi><mn>3</mn></msub></mrow></mfenced><mo>=</mo><msup><mrow><mfenced open="(" close=")"><mrow><msqrt><mn>13</mn></msqrt><mo>+</mo><mn>1</mn></mrow></mfenced></mrow><mn>2</mn></msup></math></p>');


        $fnInfoDiv4.append($infoParagraph4);
        $fnInfoDiv4.append($infoParagraph4);

        var step4 = new CALC.VisualizationStep("Function Surface", [
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

