/* global describe, it, beforeEach */
/* jslint node: true, esnext: true */
"use strict";

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const events = require('events');

const step = require('kronos-step');
const scopeDefinitions = step.ScopeDefinitions;
const scopeReporter = require('scope-reporter');
const stepPassThrough = require('../index.js');
const messageFactory = require('kronos-message');

// ---------------------------
// Create a mock manager
// ---------------------------
const sr = scopeReporter.createReporter(scopeDefinitions);
var stepImplementations = {};
const manager = Object.create(new events.EventEmitter(), {
	steps: {
		value: stepImplementations
	},
	scopeReporter: {
		value: sr
	}
});
manager.registerStepImplementation = function (si) {
	stepImplementations[si.name] = si;
};

manager.getStepInstance = function (configuration) {
	const stepImpl = stepImplementations[configuration.type];
	if (stepImpl) {
		return stepImpl.createInstance(this, this.scopeReporter, configuration);
	}
};

stepPassThrough.registerWithManager(manager);

const stepBase = manager.getStepInstance({
	"type": "kronos-step-passthrough",
	"name": "myPassThrough"
});

describe('step-passthrough', function () {

	it('Check that the step was created with its own name', function (done) {

		assert.ok(stepBase);
		assert.deepEqual(stepBase.toJSONWithOptions({
			includeRuntimeInfo: false,
			includeDefaults: false,
			includeName: true
		}), {
			"type": "kronos-step-passthrough",
			"description": "This step just passes all requests from its 'in' endpoint to its 'out' endpoint.",
			"name": "myPassThrough",
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
		});
		done();
	});


	it('Send a messsage throug the step', function (done) {

		const msgToSend = messageFactory({
			"file_name": "anyFile.txt"
		});

		msgToSend.payload = {
			"name": "pay load"
		};


		let inEndPoint = stepBase.endpoints.in;
		let outEndPoint = stepBase.endpoints.out;

		// This endpoint is the IN endpoint of the next step.
		// It will be connected with the OUT endpoint of the Adpater
		let receiveEndpoint = step.createEndpoint("testEndpointIn", {
			"in": true,
			"passive": true
		});

		// This endpoint is the OUT endpoint of the previous step.
		// It will be connected with the OUT endpoint of the Adpater
		let sendEndpoint = step.createEndpoint("testEndpointOut", {
			"out": true,
			"active": true
		});


		// This generator emulates the IN endpoint of the next step.
		// It will be connected with the OUT endpoint of the Adpater
		let generatorFunction = function* () {
			while (true) {
				const message = yield;


				// the received message should equal the sended one
				// before comparing delete the hops
				message.hops = [];

				assert.deepEqual(message, msgToSend);
				done();
			}
		};
		receiveEndpoint.setPassiveGenerator(generatorFunction);
		outEndPoint.connect(receiveEndpoint);
		inEndPoint.connect(sendEndpoint);

		stepBase.start().then(function (step) {
			sendEndpoint.send(msgToSend);
		}, function (error) {
			done(error); // 'uh oh: something bad happened’
		});
	});



});
