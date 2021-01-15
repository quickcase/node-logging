'use strict'
/* global beforeEach, before, after, describe, it */

const {expect, sinon} = require('../chai-sinon');
const util = require('util');
const SpyTransport = require('./spyTransport');

const logger = require('../../log/Logger')('test');

describe('Logging within the Node.js application', () => {
  let spy;
  const testMessage = 'Hello World';
  const testMeta = {hello: 'world'};

  const verify = (level) => {
    expect(spy).calledWith(sinon.match.has('level', level));
    expect(spy).calledWith(sinon.match.has('timestamp'));
    expect(spy).calledWith(sinon.match.has('name', 'test'));
    expect(spy).calledWith(sinon.match.has('message', testMessage + util.inspect(testMeta)));
  };

  describe('Logging an event at a given level', () => {

    let spyTransport;

    beforeEach(() => {
      spy = sinon.spy();
      spyTransport = new SpyTransport({spy, level: 'info'});
      logger.add(spyTransport);
    });

    afterEach(() => {
      logger.remove(spyTransport);
    });

    context('when logger default level is INFO', () => {
      beforeEach(() => {
        spyTransport.level = 'info';
      });

      it('should not log a message for VERBOSE', () => {
        logger.verbose(testMessage, testMeta);

        expect(spy).not.called;
      });

      it('should log a message for VERBOSE', () => {
        spyTransport.level = 'verbose';
        logger.verbose(testMessage, testMeta);

        expect(spy).calledOnce;
        verify('verbose');
      });

      it('should log a message for DEBUG', () => {
        spyTransport.level = 'debug';
        logger.debug(testMessage, testMeta);

        expect(spy).calledOnce;
        verify('debug');
      });

      it('should log a message for HTTP', () => {
        spyTransport.level = 'http';
        logger.http(testMessage, testMeta);

        expect(spy).calledOnce;
        verify('http');
      });

      it('should log a message for INFO', () => {
        logger.info(testMessage, testMeta);

        expect(spy).calledOnce;
        verify('info');
      });

      it('should log a message for WARN', () => {
        logger.warn(testMessage, testMeta);

        expect(spy).calledOnce;
        verify('warn');
      })

      it('should log a message for ERROR', () => {
        logger.error(testMessage, testMeta);

        expect(spy).calledOnce;
        verify('error');
      })
    })

    context('when logger default level matches level used to log the message', () => {
      it('should log a message at level DEBUG', () => {
        spyTransport.level = 'debug';

        logger.debug(testMessage, testMeta)

        expect(spy).calledOnce;
        verify('debug');
      })

      it('should log a message at level VERBOSE', () => {
        spyTransport.level = 'verbose';

        logger.verbose(testMessage, testMeta);

        expect(spy).calledOnce;
        verify('verbose');
      })

      it('should log a message at level INFO', () => {
        spyTransport.level = 'info';

        logger.info(testMessage, testMeta)

        expect(spy).calledOnce;
        verify('info');
      })

      it('should log a message at level WARN', () => {
        spyTransport.level = 'warn';

        logger.warn(testMessage, testMeta)

        expect(spy).calledOnce;
        verify('warn');
      })

      it('should log a message at level ERROR', () => {
        spyTransport.level = 'error';

        logger.error(testMessage, testMeta)

        expect(spy).calledOnce;
        verify('error');
      });
    });
  });

  describe('Obtaining a single instance of Logger', () => {
    let loggerInstance1, loggerInstance2, loggerInstance3

    beforeEach(() => {
      loggerInstance1 = require('../../log/Logger')('test1')
      loggerInstance2 = require('../../log/Logger')('test2')
      loggerInstance3 = require('../../log/Logger')('test3')
    })

    it('should create multiple instances', () => {
      expect(loggerInstance1).to.not.equal(loggerInstance2)
      expect(loggerInstance2).to.not.equal(loggerInstance3)
      expect(loggerInstance3).to.not.equal(loggerInstance1)
    });
  });

});
