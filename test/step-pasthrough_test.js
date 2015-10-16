/* global describe, it, beforeEach */
/* jslint node: true, esnext: true */
"use strict";

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const events = require('events');
const StepPassThrough = require('../lib/step-passthrough');
const Endpoint = require('kronos-step');
const messageFactory = require('kronos-step').message;

const manager = Object.create(new events.EventEmitter(), {});


describe('step-passthrough', function () {

	it('Just create the step', function (done) {
		let step1 = new StepPassThrough(manager, undefined, "myStep", StepPassThrough.configuration);
		done();
	});

	it('Check that the enpoints exists', function (done) {
		let step1 = new StepPassThrough(manager, undefined, "myStep", StepPassThrough.configuration);

		let inEndPoint = step1.endpoints.in;
		assert.ok(inEndPoint, 'The in endpoint is missing');

		let outEndPoint = step1.endpoints.out;
		assert.ok(outEndPoint, 'The out endpoint is missing');

		done();
	});


	it('Send a messsage throug the step', function (done) {
		let step1 = new StepPassThrough(manager, undefined, "myStep", StepPassThrough.configuration);

		const msgToSend = messageFactory({
			"file_name": "anyFile.txt"
		});

		msgToSend.payload = {
			"name": "pay load"
		};


		let inEndPoint = step1.endpoints.in;
		let outEndPoint = step1.endpoints.out;

		// This endpoint is the IN endpoint of the next step.
		// It will be connected with the OUT endpoint of the Adpater
		let receiveEndpoint = Endpoint.createEndpoint("testEndpointIn", {
			"in": true,
			"passive": true
		});

		// This endpoint is the OUT endpoint of the previous step.
		// It will be connected with the OUT endpoint of the Adpater
		let sendEndpoint = Endpoint.createEndpoint("testEndpointOut", {
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

		step1.start();

		sendEndpoint.send(msgToSend);
	});



});
