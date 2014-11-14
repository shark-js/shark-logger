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

var API = function(options) {
	options = options || {};
	var streams = [
		{
			stream: new RawStream(),
			type: 'raw',
			level: typeof options.level !== 'undefined' ? options.level : 'info'
		}
	];

	if (options.streams && options.streams.length > 0) {
		streams = streams.concat(options.streams);
	}

	return bunyan.createLogger(extend({}, options, {
		streams: streams
	}));
};

API.time = function() {
	return Time();
};

API.OP_TYPE = {
	SUCCESS: 'success',
	ERROR: 'error',
	INFO: 'info',
	IMPORTANT: 'important'
};

module.exports = API;