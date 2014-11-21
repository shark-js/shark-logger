const chalk = require('chalk');
const figures = require('figures');

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

function RawStream() {}

RawStream.prototype.write = function (data) {
	var msg = data.msg || '';
	var duration = data.duration;
	var blockName = data.opName;
	var opType = data.opType;
	var deepLevel = data.deepLevel;

	if (typeof msg === 'string') {
		switch(opType) {
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

	if (opType === 'started') {
		msg = chalk.gray(figures.checkboxOff) + ' ' + msg;
	}
	else if (opType === 'finished') {
		msg = chalk.gray(figures.tick) + ' ' + msg;
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
