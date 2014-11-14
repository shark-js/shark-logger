'use strict';

const Logger = require('../lib/logger');
const expect = require('chai').expect;

function TestRawStream() {}
TestRawStream.prototype.write = function (data) {
	if (typeof data.afterLog === 'function') {
		data.afterLog.call(null, data);
	}
};

describe('Initial test',function(){
	before(function() {
		this.loggerTrace = Logger({
			name: 'TestLogger',
			streams: [
				{
					stream: new TestRawStream(),
					type: 'raw'
				}
			],
			level: Logger.TRACE
		});

		this.loggerInfo = Logger({
			name: 'TestLogger',
			streams: [
				{
					stream: new TestRawStream(),
					type: 'raw'
				}
			],
			level: Logger.INFO
		});
	});

	it('should output valid params',function(){
		this.loggerTrace.info({
			opType: Logger.OP_TYPE.SUCCESS,
			afterLog: function(data) {
				expect(data.name).equal('TestLogger');
				expect(data.opType).equal(Logger.OP_TYPE.SUCCESS);
				expect(data.msg).equal('all done');
			}
		}, 'all done');
	});

	it('should output loggerTrace time delta as undefined', function() {
		var time = this.loggerTrace.time().start();

		expect(time.delta()).to.be.a('undefined');
	});

	it('should output loggerInfo time delta as number', function() {
		var time = this.loggerInfo.time().start();

		expect(time.delta()).to.be.a('number');
	});
});