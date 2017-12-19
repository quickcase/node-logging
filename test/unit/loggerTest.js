'use strict'
/* global beforeEach, before, after, describe, it */

const RequestTracing = require('../../log/tracing/requestTracing')
const { expect, sinon } = require('../chai-sinon');
const logging = require('../../log/config').logging;
const defaultLogEntry = logging.defaultLogEntry;
const LEVELS = require('log4js').levels;

describe('Logging within the Node.js application', () => {

  let myLogger, logger;

  const CONFIG = {
    microservice: 'track-your-appeal',
    team: 'SSCS',
    environment: 'production'
  };

  beforeEach(() => {
    myLogger = require('../../log/Logger');
    myLogger.config(CONFIG);
    logger = myLogger.getLogger('test');
  });

  describe('Not setting the config object', () => {

    beforeEach(() => {
      myLogger.config(undefined);
    });

    it('should never throw an Error', () => {
      expect(() => {
        logger.info({});
      }).to.not.throw;
    });

  });

  describe('Adding default field settings to an empty log entry object', () => {

    let logged;

    beforeEach(() => {
      logged = logger.info({}); // Any log level will do.
    });

    it('should set the level field', () => {
      expect(logged.level).to.eql(LEVELS.INFO.toString());
    });

    it('should set the message field', () => {
      expect(logged.message).to.eql(defaultLogEntry.message);
    });

    it('should set the responseCode field', () => {
      expect(logged.responseCode).to.eql(defaultLogEntry.responseCode);
    });

    it('should set the rootRequestId field', () => {
      expect(logged.rootRequestId).to.eql(defaultLogEntry.rootRequestId);
    });

    it('should set the requestId field', () => {
      expect(logged.requestId).to.eql(defaultLogEntry.requestId);
    });

    it('should set the originRequestId field', () => {
      expect(logged.originRequestId).to.eql(defaultLogEntry.originRequestId);
    });

    it('should set the fields field', () => {
      expect(logged.fields).to.eql(defaultLogEntry.fields);
    });

    it('should set the type field', () => {
      expect(logged.type).to.eql(defaultLogEntry.type);
    });

    it('should set the microservice field', () => {
      expect(logged.microservice).to.eql(CONFIG.microservice);
    });

    it('should set the team field', () => {
      expect(logged.team).to.eql(CONFIG.team);
    });

    it('should set the environment', () => {
      expect(logged.environment).to.eql('production');
    });

    it('should set the hostname field', () => {
      expect(logged.hostname).to.be.a('string');
      expect(logged.hostname.length > 0).to.eql(true);
    });

    it('should set the timestamp field', () => {
      expect(logged.timestamp).to.be.a('string');
      expect(logged.timestamp.length > 0).to.eql(true);
    });
  });

  describe('Adding user defined fields to a log entry object', () => {

    let logged;

    const logEntry = {
      message: 'this is some information',
      responseCode: 404,
      rootRequestId: 'ac-23-4a-b8-4f',
      requestId: 'bc-63-4a-b8-4g',
      originRequestId: 'cc-93-4a-b8-4i',
      environment: 'production',
      hostname: 'myhostname',
      fields: [
        {key: 'a', value: 1},
        {key: 'b', value: 'foo'},
        {key: 'c', value: [1, 2, 3]}
      ]
    };

    beforeEach(() => {
      logged = logger.info(logEntry); // Any log level will do.
    });

    it('should set the level field', () => {
      expect(logged.level).to.eql(LEVELS.INFO.toString());
    });

    it('should set the message field', () => {
      expect(logged.message).to.eql('this is some information');
    });

    it('should set the response code', () => {
      expect(logged.responseCode).to.eql(404);
    });

    it('should set the rootRequestId', () => {
      expect(logged.rootRequestId).to.eql('ac-23-4a-b8-4f');
    });

    it('should set the requestId', () => {
      expect(logged.requestId).to.eql('bc-63-4a-b8-4g');
    });

    it('should set the originRequestId', () => {
      expect(logged.originRequestId).to.eql('cc-93-4a-b8-4i');
    });

    it('should set the environment', () => {
      expect(logged.environment).to.eql('production');
    });

    it('should set the hostname', () => {
      expect(logged.hostname).to.be.a('string');
      expect(logged.hostname.length > 0).to.eql(true);
    });

    it('should set the fields', () => {
      expect(logged.fields.length).to.eql(3);
      expect(logged.fields[0].key).to.eql('a');
      expect(logged.fields[1].key).to.eql('b');
      expect(logged.fields[2].key).to.eql('c');
      expect(logged.fields[0].value).to.eql(1);
      expect(logged.fields[1].value).to.eql('foo');
      expect(logged.fields[2].value).to.eql([1, 2, 3]);
    });

  });

  describe('Adding request IDs taken from local storage', () => {
    let sinonSandbox
    const testRequestId = 'test-request-id'
    const testRootRequestId = 'test-root-request-id'
    const testOriginRequestId = 'test-origin-request-id'

    before(() => {
      sinonSandbox = sinon.sandbox.create()
      sinonSandbox.stub(RequestTracing, 'getCurrentRequestId').callsFake(() => {
        return testRequestId
      })
      sinonSandbox.stub(RequestTracing, 'getRootRequestId').callsFake(() => {
        return testRootRequestId
      })
      sinonSandbox.stub(RequestTracing, 'getOriginRequestId').callsFake(() => {
        return testOriginRequestId
      })
    })

    after(() => {
      sinonSandbox.restore()
    })

    it('should take current request ID from local storage', () => {
      const logged = logger.info('testing')
      expect(logged.requestId).to.equal(testRequestId)
    })

    it('should take root request ID from local storage', () => {
      const logged = logger.info('testing')
      expect(logged.rootRequestId).to.equal(testRootRequestId)
    })

    it('should take origin request ID from local storage', () => {
      const logged = logger.info('testing')
      expect(logged.originRequestId).to.equal(testOriginRequestId)
    })
  })

  describe('Logging an event at a given level', () => {

    let logEntry;

    beforeEach(() => {
      logEntry = {};
      logger._log = sinon.spy();
    });

    it('should log a message at level TRACE', () => {
      logger.trace(logEntry);
      expect(logEntry.level).to.eql('TRACE');
      expect(logger._log).to.have.been.calledWith(logEntry);
    });

    it('should log a message at level DEBUG', () => {
      logger.debug(logEntry);
      expect(logEntry.level).to.eql('DEBUG');
      expect(logger._log).to.have.been.calledWith(logEntry);
    });

    it('should log a message at level INFO', () => {
      logger.info(logEntry);
      expect(logEntry.level).to.eql('INFO');
      expect(logger._log).to.have.been.calledWith(logEntry);
    });

    it('should log a message at level WARN', () => {
      logger.warn(logEntry);
      expect(logEntry.level).to.eql('WARN');
      expect(logger._log).to.have.been.calledWith(logEntry);
    });

    it('should log a message at level ERROR', () => {
      logger.error(logEntry);
      expect(logEntry.level).to.eql('ERROR');
      expect(logger._log).to.have.been.calledWith(logEntry);
    });

    it('should log a message at level FATAL', () => {
      logger.fatal(logEntry);
      expect(logEntry.level).to.eql('FATAL');
      expect(logger._log).to.have.been.calledWith(logEntry);
    });

  });

  describe('Wrapping of logger call parameters', () => {

    it('should wrap if the parameter is a string literal', () => {
      let wrapped = logger._wrap('Woohoo!');
      expect(wrapped).to.eql({ message: 'Woohoo!' })
    });

    it('should wrap if the parameter is a string object', () => {
      let wrapped = logger._wrap(new String('Woohoo!'));
      expect(wrapped).to.eql({ message: 'Woohoo!' })
    });

    it('should not wrap if the parameter is an object', () => {
      let wrapped = logger._wrap({ message: 'Woohoo!' });
      expect(wrapped).to.eql({ message: 'Woohoo!' })
    });

  });

  describe('Logging with a message directly', () => {

    beforeEach(() => {
      logger._log = sinon.spy();
    });

    it('Should wrap tha parameter for trace', () => {
      logger.trace('Hello, world!');
      expect(logger._log).to.have.been.calledWithMatch({ message: 'Hello, world!' });
    });

    it('Should wrap tha parameter for debug', () => {
      logger.debug('Hello, world!');
      expect(logger._log).to.have.been.calledWithMatch({ message: 'Hello, world!' });
    });

    it('Should wrap tha parameter for info', () => {
      logger.info('Hello, world!');
      expect(logger._log).to.have.been.calledWithMatch({ message: 'Hello, world!' });
    });

    it('Should wrap tha parameter for warn', () => {
      logger.warn('Hello, world!');
      expect(logger._log).to.have.been.calledWithMatch({ message: 'Hello, world!' });
    });

    it('Should wrap tha parameter for error', () => {
      logger.error('Hello, world!');
      expect(logger._log).to.have.been.calledWithMatch({ message: 'Hello, world!' });
    });

    it('Should wrap tha parameter for fatal', () => {
      logger.fatal('Hello, world!');
      expect(logger._log).to.have.been.calledWithMatch({ message: 'Hello, world!' });
    });

  });

  describe('Obtaining a single instance of Logger', () => {

    let Logger, loggerInstance1, loggerInstance2, loggerInstance3;

    beforeEach(() => {
      Logger = require('../../log/Logger');
      loggerInstance1 = Logger.getLogger('test1');
      loggerInstance2 = Logger.getLogger('test2');
      loggerInstance3 = Logger.getLogger('test3');
    });

    it('should create multiple instances', () => {
      expect(loggerInstance1).to.not.equal(loggerInstance2);
      expect(loggerInstance2).to.not.equal(loggerInstance3);
      expect(loggerInstance3).to.not.equal(loggerInstance1);
    });

  });

});
