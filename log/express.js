'use strict'

const onFinished = require('on-finished');

class AccessLogger {
  constructor(config={}) {
    this.logger = config.logger || require('./Logger').getLogger('express.access');
    this.formatter = config.formatter || this.defaultFormatter;
    this.userLevel = config.level || function() {};
  }

  static middleware(config={}) {
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
    return this.userLevel(this.logger, req, res) || this.defaultLevel(req, res);
  }

  defaultLevel(req, res) {
    if (res.statusCode < 400 || res.statusCode == 404) {
      return this.logger.info;
    } else if (res.statusCode >= 500) {
      return this.logger.error;
    } else {
      return this.logger.warn;
    }
  }

  defaultFormatter(req, res) {
    return '"' + req.method + ' ' + (req.originalUrl || req.url) +
      ' HTTP/' + req.httpVersionMajor + '.' + req.httpVersionMinor + '" ' +
      res.statusCode;
  }
}



module.exports = {
  accessLogger: AccessLogger.middleware,
};
