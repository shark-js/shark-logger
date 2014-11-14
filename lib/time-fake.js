'use strict';

function TimeLoggerFake() {

}

TimeLoggerFake.prototype = {
	constructor: TimeLoggerFake,

	start: function() {
		return this;
	},

	finish: function() {
		return this;
	},

	delta: function() {
		return void 0;
	}
};

module.exports = function TimeLoggerFakeCreator() {
	return new TimeLoggerFake();
};