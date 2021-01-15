const util = require('util');
const {createLogger, format, transports} = require('winston');
const {errors, json, metadata, prettyPrint, printf, splat, timestamp} = format;

const DEFAULT_LOG_FORMAT = 'json';
const DEFAULT_LOG_LEVEL = 'info';
const NPM_LOG_LEVEL_MAP = {
  error: 'error',
  warn: 'warn',
  info: 'info',
  debug: 'debug',
  trace: 'verbose'
}

const customMessageFormat = format((info) => {
  const {message: infoMsg, metadata, ...otherInfo} = info;
  let message = infoMsg;
  if (metadata && typeof metadata === 'object' && Object.keys(metadata).length) {
    message = message + util.inspect(metadata);
  }

  return {
    message,
    ...otherInfo
  };
});

const logLevel = () => {
  const level = NPM_LOG_LEVEL_MAP[(process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL).toLowerCase()];
  return level || DEFAULT_LOG_LEVEL;
};

const logFormat = () => {
  const logFormat = (process.env.LOG_FORMAT || DEFAULT_LOG_FORMAT).toLowerCase();

  switch (logFormat) {
    case 'prettyprint':
      return prettyPrint();
    case 'printf':
      return printf(({timestamp, level, message, name, stack}) => {
        return `${timestamp} [${level}] : [${name}] ${message} ${stack ? '\n' + stack : ''}`;
      });
    default:
      return json();
  }
};

/**
 * This logger outputs the logs in json format with fields
 *   level: log level,
 *   timestamp: timestamp the message was received,
 *   moduleName: name of the module/file logging the message,
 *   message: logger statement with dynamic data,
 *   stack: error stack trace if any
 * e.g.
 * {
 *   "level":"info",
 *   "timestamp":"2021-01-14T11:40:54.859Z",
 *   "message":"Hello World { hello: 'world' }",
 *   "moduleName":"loggerTest",
 *   "stack": "Error: ...."
 * }
 */
const logger = createLogger({
  level: logLevel(),
  format: format.combine(
    timestamp(),
    splat(),
    metadata({fillExcept: ['level', 'timestamp', 'message', 'name', 'stack']}),
    customMessageFormat(),
    errors({stack: true}),
    logFormat()
  ),
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL || 'info'
    })],
  exitOnError: false
});

module.exports = (name) => logger.child({name});
