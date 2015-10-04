/* global describe, it, beforeEach */
/* jslint node: true, esnext: true */
"use strict";

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

const stepPassThroughFactory = require('../lib/step-passthrough');
const Endpoint = require('kronos-step').endpoint;
const messageFactory = require('kronos-step').message;

describe('step-passthrough', function () {

	it('Just create the step', function (done) {
		let step1 = stepPassThroughFactory({}, {}, {
			"name": "myStep"
		});

		//
		done();
	});

	it('Check that the enpoints exists', function (done) {
		let step1 = stepPassThroughFactory({}, {}, {
			"name": "myStep"
		});

		let inEndPoint = step1.getEndpoint('inDummy');
		assert.ok(inEndPoint, 'The in endpoint is missing');

		let outEndPoint = step1.getEndpoint('outDummy');
		assert.ok(outEndPoint, 'The out endpoint is missing');

		done();
	});


	it('Send a messsage throug the step', function (done) {
		let step1 = stepPassThroughFactory({}, {}, {
			"name": "myStep"
		});

		const msgToSend = messageFactory({
			"file_name": "anyFile.txt"
		});

		msgToSend.payload = {
			"name": "pay load"
		};


		let inEndPoint = step1.getEndpoint('inDummy');
		let outEndPoint = step1.getEndpoint('outDummy');


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

		outEndPoint.connectedEndpoint = generatorFunction;
		outEndPoint.outActiveIterator = generatorFunction();
		outEndPoint
			.outActiveIterator
			.next();


		let it = inEndPoint.getInPassiveIterator()();
		it.next();

		it.next(msgToSend);



	});



});
