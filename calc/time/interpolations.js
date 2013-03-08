CALC.interpolations = {
    linear: function (t) {
        return t;
    },
    sinusodial: function (t) {
        return (Math.sin((t - 1/2) * Math.PI) + 1)/2;
    },
    cubic: function (t) {
        return (3 - 2*t)*(t*t);
    },
    quintic: function (t) {
        return (6*t*t - 15*t + 10)*(t*t*t);
    }
};