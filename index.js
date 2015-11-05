/* jslint node: true, esnext: true */
"use strict";

const StepPassThroughFactory = require('./lib/step-passthrough');
const Step = require('kronos-step');
const BaseStep = Step.BaseStep;

module.exports.StepPassThrough = StepPassThroughFactory;

exports.registerWithManager = function (manager) {
	manager.registerStepImplementation(StepPassThroughFactory);
};
