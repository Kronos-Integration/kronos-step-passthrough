/* global describe, it, beforeEach */
/* jslint node: true, esnext: true */
"use strict";

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const step = require('kronos-step');
const testStep = require('kronos-test-step');
const stepPassThrough = require('../index.js');
const createMessage = require('kronos-message').createMessage;

// ---------------------------
// Create a mock manager
// ---------------------------
const manager = testStep.managerMock;

stepPassThrough.registerWithManager(manager);

const stepBase = manager.getStepInstance({
	"type": "kronos-step-passthrough",
	"name": "myPassThrough"
});

describe('step-passthrough', () => {

	it('Check that the step was created with its own name', done => {

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
					"in": true
				},
				"out": {
					"out": true
				}
			}
		});
		done();
	});


	it('Send a messsage throug the step', done => {

		const msgToSend = createMessage({
			"file_name": "anyFile.txt"
		});

		msgToSend.payload = {
			"name": "pay load"
		};

		let inEndPoint = stepBase.endpoints.in;
		let outEndPoint = stepBase.endpoints.out;

		// This endpoint is the IN endpoint of the next step.
		// It will be connected with the OUT endpoint of the Adpater
		const receiveEndpoint = new step.endpoint.ReceiveEndpoint("testEndpointIn");

		// This endpoint is the OUT endpoint of the previous step.
		// It will be connected with the OUT endpoint of the Adpater
		const sendEndpoint = new step.endpoint.SendEndpoint("testEndpointOut");

		receiveEndpoint.receive = message => {
			// the received message should equal the sended one
			// before comparing delete the hops
			message.hops = [];

			assert.deepEqual(message, msgToSend);
			done();
		};

		outEndPoint.connected = receiveEndpoint;
		sendEndpoint.connected = inEndPoint;

		stepBase.start().then(step => sendEndpoint.receive(msgToSend),
			done // 'uh oh: something bad happened’
		).catch(done);
	});

});
