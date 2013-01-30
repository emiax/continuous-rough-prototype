'use strict';
/*global CALC */

CALC.mouseHandler = (function () {

    var that = {},
        hold = [],
        drag = [],
        strategy,
        path = [];

    that.mouseDown = function (mouseStrategy, event) {
		var button = event.which;
        event.stopPropagation();
        event.preventDefault();
        path.push({x: event.clientX, y: event.clientY});
        strategy = mouseStrategy;
        hold[button] = true;
        strategy.mouseDown(event);
    };

    that.mouseUp = function (mouseStrategy, event) {
		var button = event.which;
        event.stopPropagation();
        event.preventDefault();
        if (!drag[button]) {
            strategy.click(event);
        }
        hold[button] = drag[button] = false;
        path = [];
        strategy.mouseUp(event);
    };

    that.mouseMove = function (mouseStrategy, event) {
		var button = event.which;
        event.stopPropagation();
        event.preventDefault();
        drag[button] = hold[button];
        if (drag[button]) {
            path.push({x: event.clientX, y: event.clientY});
            strategy.drag(event, path);
        } else {
            strategy = mouseStrategy;
        }
        strategy.mouseMove(event);
    };

    that.mouseWheel = function (mouseStrategy, event, delta) {
        event.stopPropagation();
        event.preventDefault();
        strategy.scroll(event, delta);
    };

    that.touchStart = function (mouseStrategy, event) {
        path = [];
        event.stopPropagation();
        event.preventDefault();
        //TODO IF WANTED
        /*if ( event.touches.length == 1 ) {

          event.preventDefault();

          onPointerDownPointerX = event.touches[ 0 ].pageX;
          onPointerDownPointerY = event.touches[ 0 ].pageY;

          onPointerDownLon = lon;
          onPointerDownLat = lat;
          }*/
    };

    that.touchEnd = function (mouseStrategy, event) {
        event.preventDefault();
        path = [];
    };

    that.touchMove = function (mouseStrategy, event) {
        event.stopPropagation();
        event.preventDefault();
        if (event.touches.length === 1) {
            path.push({x: event.touches[0].pageX, y: event.touches[0].pageY});
            strategy.drag(event, path);
        }
        /*if ( event.touches.length == 1 ) {
          event.preventDefault();

          lon = ( onPointerDownPointerX - event.touches[0].pageX ) * 0.1 + onPointerDownLon;
          lat = ( event.touches[0].pageY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

          render();
          }*/

    };

    return that;
}());