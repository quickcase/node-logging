const os = require('os');
const log4js = require('log4js');

const outputTypes = {
  single: 'single',
  multi: 'multi',
  human: 'human'
};

const nodejs = 'nodejs';

log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: process.env.LOG_OUTPUT === outputTypes.multi ? "%n%m" : "%m"
      }
    }
  },
  categories: { default: { appenders: ['console'], level: process.env.LOG_LEVEL || log4js.levels.INFO } }
})

const logging = {

  defaultLogEntry: {
    level: log4js.levels.INFO,
    message: '',
    rootRequestId: '',
    requestId: '',
    originRequestId: '',
    responseCode: '',
    fields: [],
    timestamp: '',
    type: nodejs,
    microservice: '',
    team: '',
    environment: '',
    hostname: os.hostname()
  },

  timestampFormat: 'YYYY-MM-DDTHH:mm:ssZ',

  // "single": view JSON logs on a single line - this setting should be used for production.
  // "multi": view JSON logs over multiple lines - helpful during development.
  // "human": view standard, one line per log statement output - helpful during development.
  output: process.env.LOG_OUTPUT || outputTypes.human,

  // The log4js instance
  log4js: log4js
};

module.exports =  {
  logging: logging,
  outputTypes: outputTypes
};
