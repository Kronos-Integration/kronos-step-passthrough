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
					"in": true
				},
				"out": {
					"out": true
				}
			}
		});
		done();
	});


	it('Send a messsage throug the step', function (done) {

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
		let receiveEndpoint = step.createEndpoint("testEndpointIn", {
			"in": true
		});

		// This endpoint is the OUT endpoint of the previous step.
		// It will be connected with the OUT endpoint of the Adpater
		let sendEndpoint = step.createEndpoint("testEndpointOut", {
			"out": true
		});

		receiveEndpoint.receive = function (message) {
			// the received message should equal the sended one
			// before comparing delete the hops
			message.hops = [];

			assert.deepEqual(message, msgToSend);
			done();
		};


		outEndPoint.connect(receiveEndpoint);
		inEndPoint.connect(sendEndpoint);

		stepBase.start().then(function (step) {
			sendEndpoint.send(msgToSend);
		}, function (error) {
			done(error); // 'uh oh: something bad happened’
		});
	});



});
