'use strict';

const hrtime = process.hrtime;
const chalk = require('chalk');

function TimeLogger() {
	this.timeStart = null;
	this.timeFinish = null;
}

TimeLogger.prototype = {
	constructor: TimeLogger,

	start: function() {
		var time = hrtime();
		this.timeStart = time[0] * 1e9 + time[1];

		return this;
	},

	finish: function() {
		var time = hrtime();
		this.timeFinish = time[0] * 1e9 + time[1];

		return this;
	},

	rawDelta: function() {
		return this.timeFinish - this.timeStart;
	},

	delta: function() {
		var secs = this.rawDelta() / 1e9;

		if (secs < 1) {
			return chalk.styles.gray.open + (secs * 1000).toFixed(0) + 'ms' + chalk.styles.gray.close;
		}
		else {
			return chalk.styles.gray.open + secs.toFixed(2) + 's' + chalk.styles.gray.close;
		}
	}
};

module.exports = function TimeLoggerCreator() {
	return new TimeLogger();
};