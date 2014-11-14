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

	delta: function() {
		if (this.timeFinish === null) {
			this.finish();
		}
		return this.timeFinish - this.timeStart;
	}
};

module.exports = function TimeLoggerCreator() {
	return new TimeLogger();
};