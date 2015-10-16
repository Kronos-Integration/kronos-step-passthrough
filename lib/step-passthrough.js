/* jslint node: true, esnext: true */
"use strict";

const BaseStep = require('kronos-step').Step;

console.log(BaseStep);
/**
 * This is more or less just a step for testing and debugging
 * It takes any message from its 'in' endpoint and sends it to
 * its 'out' endpoint. The step will do nothing with the request
 */
class StepPassThrough extends BaseStep {
	/**
	 * This method should be overwritten by the dreived class to setup the endpoints
	 * for this step.
	 */
	_setupEndpoints(scopeReporter, stepDefinition) {
		const inEndpoint = this.endpoints.in;
		const outEndpoint = this.endpoints.out;

		inEndpoint.setPassiveGenerator(function* () {
			while (inEndpoint.step.isRunning) {
				let currentRequest = yield;
				outEndpoint.send(currentRequest);
			}
		});
	}
}

StepPassThrough.configuration = {
	"name": "kronos-step-passThrough",
	"description": "This step just forwards each request from its in endpoint to its out endpoint",
	"endpoints": {
		"in": {
			"in": true,
			"passive": true
		},
		"out": {
			"out": true,
			"active": true
		}
	}
};


module.exports = StepPassThrough;
