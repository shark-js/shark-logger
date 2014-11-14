'use strict';

const bunyan        = require('bunyan');
const chalk         = require('chalk');
const extend        = require('node.extend');
const prettyBytes   = require('pretty-bytes');
const Time          = require('./time');

function getPrettyTime(nsecs) {
	var secs = nsecs / 1e9;

	if (secs < 1) {
		return chalk.styles.gray.open + (secs * 1000).toFixed(0) + 'ms' + chalk.styles.gray.close;
	}
	else {
		return chalk.styles.gray.open + secs.toFixed(2) + 's' + chalk.styles.gray.close;
	}
}

function RawStream() {}
RawStream.prototype.write = function (data) {
	var msg = data.msg;
	var duration = data.duration;
	var blockName = data.block;

	if (typeof msg === 'string') {
		switch(data.opType) {
			case 'success':
				msg = chalk.green(msg);
				break;

			case 'error':
				msg = chalk.red(msg);
				break;

			case 'info':
				msg = chalk.white(msg);
				break;

			case 'important':
				msg = chalk.bold(msg);
		}
	}

	if (typeof duration === 'number') {
		msg += ' ' + getPrettyTime(duration);
	}

	if (typeof blockName === 'string') {
		msg = chalk.gray(blockName) + ' ' + msg;
	}

	var nameFromLevel = {
		10: 'TRACE',
		20: 'DEBUG',
		30: 'INFO',
		40: 'WARN',
		50: 'ERROR',
		60: 'FATAL'
	};

	if (data.level >= 50) {
		console.error(msg);
	}
	else if(data.level <= 20) {
		console.info(msg);
	}
	else {
		console.log(msg);
	}
};

var OP_TYPE = {
	SUCCESS: 'success',
	ERROR: 'error',
	INFO: 'info',
	IMPORTANT: 'important'
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

	var b = bunyan.createLogger(extend({}, options, {
		streams: streams
	}));

	b.TRACE = bunyan.TRACE;
	b.DEBUG = bunyan.DEBUG;
	b.INFO = bunyan.INFO;
	b.WARN = bunyan.WARN;
	b.ERROR = bunyan.ERROR;
	b.FATAL = bunyan.FATAL;

	b.time = function() {
		return Time();
	};

	b.OP_TYPE = OP_TYPE;

	return b;
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

module.exports = API;