/* jslint node: true, esnext: true */
'use strict';

const StepPassThroughFactory = require('./lib/step-passthrough');

module.exports.StepPassThrough = StepPassThroughFactory;

exports.registerWithManager = manager => manager.registerStep(StepPassThroughFactory);
