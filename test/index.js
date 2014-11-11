'use strict';

const Logger = require('../lib/logger');
const chai      = require('chai');
const expect    = chai.expect;

function TestRawStream() {}
TestRawStream.prototype.write = function (data) {
	if (typeof data.afterLog === 'function') {
		data.afterLog.call(null, data);
	}
};

describe('Initial test',function(){
	before(function() {
		this.logger = Logger.createLogger({
			name: 'TestLogger',
			streams: [
				{
					stream: new TestRawStream(),
					type: 'raw'
				}
			]
		});
	});

	it('should output valid params',function(){
		this.logger.info({
			opType: Logger.OP_TYPE.SUCCESS,
			afterLog: function(data) {
				expect(data.name).equal('TestLogger');
				expect(data.opType).equal(Logger.OP_TYPE.SUCCESS);
				expect(data.msg).equal('all done');
			}
		}, 'all done');
	});
});