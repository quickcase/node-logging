const merge = require('lodash.merge');
const moment = require('moment');
const {logging, outputTypes} = require('./config');
const levels = logging.log4js.levels;

let userConfig = {};

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

class Config {

}

module.exports = Logger;
