'use strict';

Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

Function.method('extend', function (map) {
    this.prototype.constructor = this;
    var k;
    for (k in map) {
        if (map.hasOwnProperty(k)) {
            this.prototype[k] = map[k];
        }
    }
    return this;
});

Function.extend({
    extends: function (Parent, map) {
        this.prototype = new Parent();
        this.prototype.super = Parent.prototype;
        if (map) {
            this.extend(map);
        }
        
        return this;
    }
});

var CALC = {};
