'use strict';

const chalk         = require('chalk');
const figures       = require('figures');
const prettyBytes   = require('pretty-bytes');

function getPrettyTime(nsecs) {
	var secs = nsecs / 1e9;
	var result;

	if (secs < 1) {
		result = (secs * 1000).toFixed(0) + 'ms';
	}
	else {
		result = secs.toFixed(2) + 's';
	}

	result = chalk.styles.gray.open + result + chalk.styles.gray.close;

	return result;
}

function getPrettySize(size) {
	var type = ({}).toString.call(size);
	switch(type) {
		case '[object String]':
		case '[object Number]':
			return chalk.gray(prettyBytes(size));

		case '[object Object]':
			return chalk.gray(
				prettyBytes(size.before) + ' ' + figures.arrowRight + ' ' + prettyBytes(size.after)
			);

		default:
			return void 0;
	}
}

function RawStream() {}

RawStream.prototype.write = function (data) {
	var msg = data.msg || '';
	var duration = data.duration;
	var blockName = data.opName;
	var opType = data.opType;
	var deepLevel = data.deepLevel;
	var size = getPrettySize(data.size);

	if (typeof msg === 'string') {
		switch(opType) {
			case 'success':
				msg = chalk.green(msg);
				break;

			case 'error':
			case 'finished-error':
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
		if (msg.length > 0) {
			msg += ' ';
		}
		msg += getPrettyTime(duration);
	}

	if (typeof size !== 'undefined') {
		if (msg.length > 0) {
			if (typeof duration === 'number') {
				msg += chalk.gray(', ');
			}
			else {
				msg += ' ';
			}
		}
		msg += size;
	}

	if (typeof blockName === 'string') {
		if (opType === 'finished-error') {
			msg = chalk.red(blockName) + ' ' + msg;
		}
		else {
			msg = chalk.gray(blockName) + ' ' + msg;
		}
	}

	if (opType === 'started') {
		msg = chalk.gray(figures.checkboxOff) + ' ' + msg;
	}
	else if (opType === 'finished' || opType === 'finished-success') {
		msg = chalk.gray(figures.tick) + ' ' + msg;
	}
	else if (opType === 'finished-error') {
		msg = chalk.red(figures.warning) + ' ' + msg;
	}

	if (deepLevel) {
		msg = (new Array(deepLevel).join("    ")) + msg;
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

module.exports = RawStream;
