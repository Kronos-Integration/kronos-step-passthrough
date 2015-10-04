/* jslint node: true, esnext: true */
"use strict";

const baseStep = require('kronos-step').step;
const LOG_LEVEL = require('kronos-step').log_level;
const messageFactory = require('kronos-step').message;

/**
 * Opens a read stream from a file from the file system
 */
class StepPassThrough extends baseStep {
	/**
	 * @param kronos The framework manager
	 * @param flow The flow this step was added to
	 * @param config The configration for this step
	 */
	constructor(kronos, flow, config) {
		super(kronos, flow, config);
	}


	/**
	 * receives messages from incomming endpoints
	 */
	_doReceive(endpointName, message) {
		const self = this;

		// This endpoint receives messages to read the given file
		if (endpointName === 'inDummy') {
			const newMessage = messageFactory(undefined, message);

			newMessage.payload = message.payload;
			self._push("outDummy", newMessage);
		}
	}


	/**
	 * This method should be overwritten by the dreived class to setup the endpoints
	 * for this step.
	 */
	_setupEndpoints() {
		// The 'out' endpoint for this steps. This endpoint will emit file read stream requests
		this._addEndpointFromConfig({
			"name": "outDummy",
			"active": true,
			"out": true
		});

		// This 'in' endpoint receives file read events. The payload in the message must have the following format:
		/*
		 * {
		 *  "directory" : dirname
		 *	"files" : [file1, .., fileN]
		 * }
		 * or {fileName}
		 * or [file1, .., fileN]
		 */
		this._addEndpointFromConfig({
			"name": "inDummy",
			"passive": true,
			"in": true
		});
	}
}

module.exports = function (kronos, flow, opts) {
	return new StepPassThrough(kronos, flow, opts);
};
