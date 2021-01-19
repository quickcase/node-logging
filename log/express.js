'use strict'

const onFinished = require('on-finished');
const logger = require('./logger')('express.access');

class AccessLogger {
  constructor(config = { }) {
    this.logger = config.logger || logger;
    this.formatter = config.formatter || AccessLogger.defaultFormatter;
    this.userLevel = config.level || AccessLogger.defaultLevel;
  }

  static middleware(config = { }) {
    const accessLogger = new AccessLogger(config);

    return (req, res, next) => {
      onFinished(res, () => {
        accessLogger.log(req, res);
      });

      next();
    };
  }

  log(req, res) {
    const level = this.level(req, res);
    level.call(this.logger, {
      responseCode: res.statusCode,
      message: this.formatter(req, res)
    });
  }

  level(req, res) {
    return this.userLevel(this.logger, req, res);
  }

  static defaultLevel(logger, req, res) {
    if (res.statusCode < 400 || res.statusCode === 404) {
      return logger.info;
    } else if (res.statusCode >= 500) {
      return logger.error;
    } else {
      return logger.warn;
    }
  }

  static defaultFormatter(req, res) {
    return '"' + req.method + ' ' + (req.originalUrl || req.url) +
      ' HTTP/' + req.httpVersionMajor + '.' + req.httpVersionMinor + '" ' +
      res.statusCode;
  }
}

module.exports = {
  AccessLoggingHandler: AccessLogger,
  accessLogger: AccessLogger.middleware,
};
