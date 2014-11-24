'use strict';

const bunyan        = require('bunyan');
const extend        = require('node.extend');
const figures       = require('figures');
const Time          = require('./time');
const RawStream     = require('./logger-stream');

var OP_TYPE = {
	SUCCESS: 'success',
	ERROR: 'error',
	INFO: 'info',
	IMPORTANT: 'important',
	STARTED: 'started',
	FINISHED: 'finished',
	FINISHED_SUCCESS: 'finished-success',
	FINISHED_ERROR: 'finished-error'
};

var toCopy = {
	TRACE: bunyan.TRACE,
	DEBUG: bunyan.DEBUG,
	INFO: bunyan.INFO,
	WARN: bunyan.WARN,
	ERROR: bunyan.ERROR,
	FATAL:bunyan.FATAL,
	time: function() {
		return Time();
	},
	OP_TYPE: OP_TYPE,
	SYMBOLS: figures
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

	return loggerInstance;
};

Object.keys(toCopy).forEach(function(key) {
	bunyan.prototype[key] = toCopy[key];
	API[key] = toCopy[key];
});

bunyan.prototype.getDeepLevel = function() {
	return this.fields.deepLevel;
};

API.INTERNAL_LOGGER = bunyan;

module.exports = API;
