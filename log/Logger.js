const _ = require('lodash');
const moment = require('moment');
const {logging, outputTypes} = require('./config');
const levels = logging.log4js.levels;

let singleton = Symbol();
let singletonEnforcer = Symbol();
let userConfig;

class Logger {

  //----------------------------------------------------
  // Public functions
  //----------------------------------------------------

  constructor(enforcer) {
    if (enforcer != singletonEnforcer) {
      throw new Error('Cannot construct Logger singleton, use the static getLogger() function');
    }
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
    if (!this[singleton]) {
      this[singleton] = new Logger(singletonEnforcer);
    }
    this[singleton].logger = logging.log4js.getLogger(name);
    this[singleton].logger.setLevel(logging.currentLevel);

    return this[singleton];
  }

  static config(config) {
    userConfig = config;
  }

  //----------------------------------------------------
  // Private functions
  //----------------------------------------------------

  _log(logEntry) {
    logEntry = _.merge({ }, logging.defaultLogEntry, logEntry);
    logEntry.timestamp = moment().format(logging.timestampFormat);
    const level = logEntry.level.toLowerCase();

    // Set user defined properties
    if(!userConfig) {
        throw new Error('Please set a user config object');
    }

    logEntry.microservice = userConfig.microservice;
    logEntry.team = userConfig.team;
    logEntry.environment = userConfig.environment;

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
