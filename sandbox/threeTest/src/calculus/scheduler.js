CALC.scheduler = function() {
	
	var nextId = 0;
	var events = [];
	var that = {};

	that.attach = function(fun, args, delay) {
		delay = delay || 0;
		events[nextId] = {
			fun: fun,
			args: args,
			delay: delay
		};
		return nextId++;
	};

	that.detach = function(id) {
		if (events[id] !== undefined) {
			delete events[id];
			return true;
		}
		return false;
	};

	that.animate = function() {
		var ev;
		
		//Copy all events, to prevent events queued in current event loop to be executed
		var currentEvents = [];
		for (e in events) {
			if (events.hasOwnProperty(e)) {
				currentEvents[e] = events[e];
			}
		}

		
		for (e in currentEvents) {
			if (currentEvents.hasOwnProperty(e)) {
				ev =  currentEvents[e];
				if (ev.delay-- <= 0)  {
					ev.funv(ev.args);
					that.detach(e);
				}
			}
		}
		requestAnimationFrame(that.animate);
	};


	return that;

}();


CALC.interpolations = {
	linear: function(t) {
		return t;
	},
	sinusodial: function(t) {
		return (Math.sin((t-1/2) * Math.PI) + 1)/2;
	},
	cubic: function(t) {
		return -2*(t^3)+3*(t^2);
	},
	quintic: function(t) {
		return 6*(t^5)-15*(t^4)+10*(t^3);
	}
};





var animate = function(object, args, duration, delay, interpolate) {

	// object[key] ska bli value på duration frames
	var t = 0;
	var source;

	var step = function() {
		var a;
		t += 1/duration;
		interpolation = interpolate(t);
		for (a in args) {
			if (args.hasOwnProperty(a)) {
				dest = args[a];
				object[a] = source[a] + interpolation*(dest - source[a]);
			}
		}
		if (t < 1) {
			CALC.scheduler.attach(step);
		}
	};

	var start = function() {
		source = {};
		for (a in args) {
			if (args.hasOwnProperty(a)) {
				source[a] = object[a];
			}
		}
		step();
	};

	CALC.scheduler.attach(start, null, delay);
}




THREE.Object3D.prototype.rotate = function(args, timing) {
	timing = timing || {};
	animate(this.rotation, {
		x: args.x,
		y: args.y,
		z: args.z
	}, timing.duration, timing.interpolation, timing.delay);
	return this;
};




/*
object.rotate({
	x: Math.PI/2,
	y: Math.PI
}, {
	duration: 120,
	interpolation: CALC.interpolations.quintic,
	delay: 120
});
*/


