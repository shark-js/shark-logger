'use strict';

const bunyan        = require('bunyan');
const extend        = require('node.extend');
const prettyBytes   = require('pretty-bytes');
const figures       = require('figures');
const Time          = require('./time');
const RawStream     = require('./logger-stream');

var OP_TYPE = {
	SUCCESS: 'success',
	ERROR: 'error',
	INFO: 'info',
	IMPORTANT: 'important',
	STARTED: 'started',
	FINISHED: 'finished'
};

var API = function(options) {
	options = options || {};
	var level = typeof options.level !== 'undefined' ? options.level : bunyan.INFO;
	var streams = [
		{
			stream: new RawStream(),
			type: 'raw',
			level: level
		}
	];

	if (options.streams && options.streams.length > 0) {
		streams = streams.concat(options.streams);
	}

	var loggerInstance = bunyan.createLogger(extend({}, options, {
		streams: streams
	}));

	loggerInstance.TRACE = bunyan.TRACE;
	loggerInstance.DEBUG = bunyan.DEBUG;
	loggerInstance.INFO = bunyan.INFO;
	loggerInstance.WARN = bunyan.WARN;
	loggerInstance.ERROR = bunyan.ERROR;
	loggerInstance.FATAL = bunyan.FATAL;

	loggerInstance.time = function() {
		return Time();
	};

	loggerInstance.OP_TYPE = OP_TYPE;
	loggerInstance.SYMBOLS = figures;

	return loggerInstance;
};

API.time = function() {
	return Time();
};

API.OP_TYPE = OP_TYPE;

API.TRACE = bunyan.TRACE;
API.DEBUG = bunyan.DEBUG;
API.INFO = bunyan.INFO;
API.WARN = bunyan.WARN;
API.ERROR = bunyan.ERROR;
API.FATAL = bunyan.FATAL;

API.SYMBOLS = figures;

API.INTERNAL_LOGGER = bunyan;

module.exports = API;
