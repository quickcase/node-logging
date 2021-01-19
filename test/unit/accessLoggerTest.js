/* global describe, it */

const {expect, sinon} = require('../chai-sinon');

const AccessLogger = require('../../log/express').AccessLoggingHandler;
const logger = require('../../log/logger')('express.access');
const SpyTransport = require('./spyTransport');

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

  it('should log api call', () => {
    const spy = sinon.spy();
    const spyTransport = new SpyTransport({spy, level: 'info'});
    const accessLogger = new AccessLogger();
    accessLogger.logger.add(spyTransport);

    const req = {method: 'GET', url: '/api/test', httpVersionMajor: 1, httpVersionMinor: 1};
    const res = {statusCode: 200};
    accessLogger.log(req, res);

    expect(spy).calledWith(sinon.match.has('level', 'info'));
    expect(spy).calledWith(sinon.match.has('timestamp'));
    expect(spy).calledWith(sinon.match.has('name', 'express.access'));
    expect(spy).calledWith(sinon.match.has('responseCode', 200));
    expect(spy).calledWith(sinon.match.has('message', '"GET /api/test HTTP/1.1" 200'));
  });

});
