/* jslint node: true, esnext: true */
"use strict";

const BaseStep = require('kronos-step').Step;

const passthroughStep = {
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

	_initialize(manager, scopeReporter, name, stepConfiguration, endpoints, props) {
		const step = this;
		const inEndpoint = endpoints.in;
		const outEndpoint = endpoints.out;
		inEndpoint.setPassiveGenerator(function* () {
			while (step.isRunning) {
				let currentRequest = yield;
				outEndpoint.send(currentRequest);
			}
		});
	}

};

module.exports = passthroughStep;
