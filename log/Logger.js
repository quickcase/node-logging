const merge = require('lodash.merge');
const moment = require('moment');
const { logging, outputTypes } = require('./config');
const levels = logging.log4js.levels;

const RequestTracing = require('./tracing/requestTracing');

let userConfig = {};

function isBlank (str) {
  return !str || str.trim().length === 0;
}

class Logger {

  //----------------------------------------------------
  // Public functions
  //----------------------------------------------------

  constructor() {
  }

  trace(logEntry) {
    logEntry = this._wrap(logEntry);
    logEntry.level = levels.TRACE.toString();
    return this._log(logEntry);
  }

  debug(logEntry) {
    logEntry = this._wrap(logEntry);
    logEntry.level = levels.DEBUG.toString();
    return this._log(logEntry);
  }

  info(logEntry) {
    logEntry = this._wrap(logEntry);
    logEntry.level = levels.INFO.toString();
    return this._log(logEntry);
  }

  warn(logEntry) {
    logEntry = this._wrap(logEntry);
    logEntry.level = levels.WARN.toString();
    return this._log(logEntry);
  }

  error(logEntry) {
    logEntry = this._wrap(logEntry);
    logEntry.level = levels.ERROR.toString();
    return this._log(logEntry);
  }

  fatal(logEntry) {
    logEntry = this._wrap(logEntry);
    logEntry.level = levels.FATAL.toString();
    return this._log(logEntry);
  }

  //----------------------------------------------------
  // Public static functions
  //----------------------------------------------------

  static getLogger(name) {
    const logger = new Logger();
    logger.logger = logging.log4js.getLogger(name);

    return logger;
  }

  static config(config) {
    userConfig = config || {};
  }

  //----------------------------------------------------
  // Private functions
  //----------------------------------------------------

  _log(logEntry) {
    logEntry = merge({ }, logging.defaultLogEntry, logEntry);
    this._addTracingInformation(logEntry)
    logEntry.timestamp = moment().format(logging.timestampFormat);
    const level = logEntry.level.toLowerCase();

    logEntry.microservice = userConfig.microservice || 'not-configured';
    logEntry.team = userConfig.team || 'not-configured';
    logEntry.environment = userConfig.environment || 'not-configured';

    if (logging.output === outputTypes.single) {
      this.logger[level](JSON.stringify(logEntry));
    } else if (logging.output === outputTypes.multi) {
      this.logger[level](logEntry);
    } else {
      this.logger[level](`${logEntry.timestamp} ${logEntry.level} ${this.logger.category}: ${logEntry.message}`)
    }

    return logEntry;
  };

  _addTracingInformation (logEntry) {
    if (isBlank(logEntry.requestId)) {
      logEntry.requestId = RequestTracing.getCurrentRequestId() || logging.defaultLogEntry.requestId;
    }
    if (isBlank(logEntry.originRequestId)) {
      logEntry.originRequestId = RequestTracing.getOriginRequestId() || logging.defaultLogEntry.originRequestId;
    }
    if (isBlank(logEntry.rootRequestId)) {
      logEntry.rootRequestId = RequestTracing.getRootRequestId() || logging.defaultLogEntry.rootRequestId;
    }
  }

  _wrap(message) {
    if (typeof message === 'string') {
      return { message: message };
    } else if (message instanceof String) {
      return { message: message.toString() };
    } else {
      return message;
    }
  }

}

module.exports = Logger;
