/* jslint node: true, esnext: true */
"use strict";


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

module.exports = passthroughStep;
