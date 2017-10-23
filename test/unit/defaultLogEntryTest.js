'use strict';
/* global describe, it, beforeEach */

const expect = require('chai').expect;
const cloneDeep = require('lodash.clonedeep');

const defaultLogEntry = require('../../log/config').logging.defaultLogEntry;
const Logger = require('../../log/Logger');

Logger.config({
  microservice: '',
  team: '',
  environment: ''
});

describe('Logger default log entry', () => {
  const logger = Logger.getLogger('logEntryTest');
  const defaultLogEntryClone = cloneDeep(defaultLogEntry);

  const logEntry = {
      level: 'TRACE',
      message: 'An important logging message',
      rootRequestId: 'The root request ID',
      requestId: 'The request ID',
      originRequestId: 'The origin request ID',
      responseCode: 'The response code',
      fields: [ { key: 'Sample key', value: 'Sample value' } ],
      type: 'An application type',
      microservice: 'A service name',
      team: 'The reform team',
      environment: 'The current environment',
      hostname: 'The current host'
  };

  it('should not have properties overwritten across logging calls', () => {
    logger._log(logEntry);
    expect(defaultLogEntry).to.deep.equal(defaultLogEntryClone);
  });
});
