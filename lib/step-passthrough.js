/* jslint node: true, esnext: true */
"use strict";

const BaseStep = require('kronos-step').Step;


const PassthroughStep = {
	"name": "kronos-step-passthrough",
	"description": "This step just passes all requests from its 'in' endpoint to its 'out' endpoint.",
	"endpoints": {
		"in": {
			"in": true,
			"passive": true
		},
		"out": {
			"out": true,
			"active": true
		}
	},

	finalize(manager, scopeReporter, stepConfiguration) {
		const self = this;
		const inEndpoint = self.endpoints.in;
		const outEndpoint = self.endpoints.out;
		inEndpoint.setPassiveGenerator(function* () {
			while (self.isRunning) {
				let currentRequest = yield;
				outEndpoint.send(currentRequest);
			}
		});
	}

};

const StepPassThroughFactory = Object.assign({}, BaseStep, PassthroughStep);


module.exports = StepPassThroughFactory;
