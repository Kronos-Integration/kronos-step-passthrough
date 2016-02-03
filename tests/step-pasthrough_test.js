/* global describe, it, beforeEach */
/* jslint node: true, esnext: true */
"use strict";

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const endpoint = require('kronos-endpoint');
const testStep = require('kronos-test-step');
const stepPassThrough = require('../index.js');
const createMessage = require('kronos-message').createMessage;
const serviceManager = require('kronos-service-manager');


// ---------------------------
// Create a mock manager
// ---------------------------
const managerPromise = serviceManager.manager({}, [stepPassThrough]);

describe('step-passthrough', () => {

	it('Check that the step was created with its own name', () => {

		return managerPromise.then(manager => {
			const stepBase = manager.createStepInstanceFromConfig({
				"type": "kronos-step-passthrough",
				"name": "myPassThrough"
			}, manager);

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
			return Promise.resolve("OK");
		});

	});


	it('Send a messsage throug the step', () => {
		return managerPromise.then(manager => {
			const stepBase = manager.createStepInstanceFromConfig({
				"type": "kronos-step-passthrough",
				"name": "myPassThrough"
			}, manager);

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
			const receiveEndpoint = new endpoint.ReceiveEndpoint("testEndpointIn");

			// This endpoint is the OUT endpoint of the previous step.
			// It will be connected with the OUT endpoint of the Adpater
			const sendEndpoint = new endpoint.SendEndpoint("testEndpointOut");

			receiveEndpoint.receive = message => {
				// the received message should equal the sended one
				// before comparing delete the hops
				message.hops = [];

				assert.deepEqual(message, msgToSend);
				return Promise.resolve("OK");
			};

			outEndPoint.connected = receiveEndpoint;
			sendEndpoint.connected = inEndPoint;

			return stepBase.start().then(step => sendEndpoint.receive(msgToSend));
		});



	});

});
