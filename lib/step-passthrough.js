/* jslint node: true, esnext: true */
"use strict";

const BaseStep = require('kronos-step').Step;

const PassthroughStep = {
	"name": "kronos-step-passthrough",
	"description": "This step just passes all requests from its 'in' endpoint to its 'out' endpoint.",
	"endpoints": {
		"in": {
			"in": true
		},
		"out": {
			"out": true
		}
	},

	_start() {
		this.endpoints.in.receive = request => this.endpoints.out.connected.receive(request);
		return Promise.resolve(this);
	}
};


const StepPassThroughFactory = Object.assign({}, BaseStep, PassthroughStep);
module.exports = StepPassThroughFactory;
