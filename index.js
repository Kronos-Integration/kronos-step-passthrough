/* jslint node: true, esnext: true */
"use strict";

const StepPassThrough = require('./lib/step-passthrough');
const Step = require('kronos-step');

module.exports.StepPassThrough = StepPassThrough;

exports.registerWithManager = function (manager) {
	manager.registerStepImplementation(Step.prepareStepForRegistration(manager, undefined, StepPassThrough));
};
