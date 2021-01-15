/* global describe, it */

const expect = require('chai').expect

const AccessLogger = require('../../log/express').AccessLoggingHandler;
const logger = require('../../log/Logger')('express.access');

describe('AccessLogger', () => {
  it('should have a default logger', () => {
    const accessLogger = new AccessLogger()
    expect(accessLogger.logger).to.eql(logger)
  })

  it('should have a default formatter', () => {
    const accessLogger = new AccessLogger()
    expect(accessLogger.formatter).to.be.instanceOf(Function)
  })

  it('should have a default level function', () => {
    const accessLogger = new AccessLogger()
    expect(accessLogger.level).to.be.instanceOf(Function)
  })
})
