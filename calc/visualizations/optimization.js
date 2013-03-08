'use strict';
/*global CALC */

(CALC.visualizations.Optimization = function(title) {

    CALC.visualizations.Visualization.call( this, title );

}).extends(CALC.visualizations.Visualization, {

    init: function() {
        var scope = this;
        
        this.standardVisualizationSetup();
        var scene = this.scenes["std"];
        var objectBranch = new THREE.Object3D();
        
        scene.add(objectBranch);
		
		objectBranch.rotation = new THREE.Vector3(Math.PI / 8, 0, Math.PI / 2);
        
        //var boundingBox = [-1.2, -10, 10, 10];
        var resolution = 0.1;
		
		var expr = CALC.parse('(2*u + 3*v + 1)^2 / 25');
        
        var surface = new CALC.ParametricSurface({
			x: CALC.parse('u'),
			y: CALC.parse('v'),
            z: expr,
            domain: {
                u: [-1.2, 1.2],
                v: [-1.2, 1.2]
            },
			attributes: {
			},
            constraints: {
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
        
        var line1 = new CALC.ParametricSurface({
			x: CALC.parse('u'),
			y: CALC.parse('v'),
            z: CALC.parse('(2*u + 3*v + 1)^2 / 25 + 0.01'),
            domain: {
                u: [-1.2, 1.2],
                v: [-1.2, 1.2]
            },
			attributes: {
				r: CALC.parse('x^2 + y^2')
			},
            constraints: {
                r: {
                    lower: 0.98,
                    upper: 1.02
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
        
        var line2 = new CALC.ParametricSurface({
			x: CALC.parse('u'),
			y: CALC.parse('v'),
            z: CALC.parse('(2*u + 3*v + 1)^2 / 25 - 0.01'),
            domain: {
                u: [-1.2, 1.2],
                v: [-1.2, 1.2]
            },
			attributes: {
				r: CALC.parse('x^2 + y^2')
			},
            constraints: {
                r: {
                    lower: 0.98,
                    upper: 1.02
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
                v: [-0.2, 1.2]
            },
			attributes: {
			},
            constraints: {
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
        
        objectBranch.add(cylinder);
		cylinder.material.transparent = true;
        objectBranch.add(surface2);
        objectBranch.add(line1);
        objectBranch.add(line2);
		
		var gradient = new CALC.VectorArrow(dx, dy, 0, 0xaaffaa);
        objectBranch.add(gradient);
		var normal = new CALC.VectorArrow(CALC.parse('x'), CALC.parse('y'), 0, 0xffaaaa);
        objectBranch.add(normal);
		
		CALC.animator.animate({
			milliseconds: 40000,
			interpolation: CALC.interpolations.linear,
			begin: function(){},
			step: function(t) {
				var ang = t * 10 * Math.PI;
				gradient.position.x = Math.cos(ang);
				gradient.position.y = Math.sin(ang);
				gradient.position.z = expr2.evaluate({x: Math.cos(ang), y: Math.sin(ang)});
				
				normal.position.x = Math.cos(ang);
				normal.position.y = Math.sin(ang);
				normal.position.z = expr2.evaluate({x: Math.cos(ang), y: Math.sin(ang)});
			},
			end: function (){}
		});
		
		// for (var ang = 0; ang < 2*Math.PI; ang += Math.PI / 3) {
			// var vec = new CALC.VectorArrow(Math.cos(ang), Math.sin(ang), 0, 0xffffff);
			// vec.position.x = Math.cos(ang);
			// vec.position.y = Math.sin(ang);
			// vec.position.z = expr.evaluate({u: Math.cos(ang), v: Math.sin(ang)});
			// objectBranch.add(vec);
		// }
        
        this.renderers["std"].mouseStrategy = new CALC.NavigationStrategy(this.renderers["std"], objectBranch);
		
		
		// Step 0
			var $fnInfoDiv = $('<div class="text-box"></div>');

			var $infoParagraph = $('<p>Betrakta funktionsytan</p>');
			$fnInfoDiv.append($infoParagraph);
			
			var $mml = expr2.mathMLElement();
			
			$infoParagraph.append($mml);

			var $next = $('<a href="#" class="next-button">Gå vidare</a>');
			$fnInfoDiv.append($next);

			$next.click(function() {
				scope.visitStep(1);
			});
	
			var step0 = new CALC.VisualizationStep("Funktionsytan", [
				new CALC.TextPanelAction({
					panel: 		this.panels.text,
					elem:		$fnInfoDiv
				})
			]);
			
		// Step 1
			
		
		this.setSteps([step0]);
		this.visitStep(0);

    }
    

});
