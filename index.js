/* jslint node: true, esnext: true */
"use strict";

const step = require('./lib/step-passthrough');

module.exports.Step = step.Step;

exports.registerWithManager = function (manager) {
	manager.registerStep(step);
};
