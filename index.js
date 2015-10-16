/* jslint node: true, esnext: true */
"use strict";

const Step = require('./lib/step-passthrough');

module.exports.Step = Step;

exports.registerWithManager = function (manager) {
	manager.registerStep(Step);
};
