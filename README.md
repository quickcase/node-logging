# node-logging

[![Build status](https://github.com/quickcase/node-logging/workflows/check-main/badge.svg)](https://github.com/quickcase/node-logging/actions)
[![npm version](https://badge.fury.io/js/%40quickcase%2Fnode-logging.svg)](https://badge.fury.io/js/%40quickcase%2Fnode-logging)

NodeJS logging component for QuickCase applications.

Some background info:
* there are 6 log levels: `silly` (5), `debug` (4), `verbose` (3), `info` (2), `warn` (1) and `error` (0).
* log level can be set via an environment variable `LOG_LEVEL`, the default is `info`.
* logging output in JSON format can be enabled by setting environment variable `JSON_PRINT` to `true`, the default is `false`.
* by default logging is turned off when running the unit tests.

## Usage

Add it as your project's dependency:

```bash
npm i @quickcase/node-logging
```

Require it:

```javascript
const { Logger } = require('@quickcase/node-logging')
```

Then you can create a logger instance and use it to log information:

```javascript
const logger = Logger.getLogger('app.js') // app.js is just an example, can be anything that's meaningful to you
```

Usage are:

```javascript
logger.info({
  message: 'Yay, logging!'
})
```

or

```javascript
logger.log({
  level: 'info',
  message: 'What time is the testing at?'
});
```

Above will result in the following log printed (if JSON format is enabled).

```javascript
{
  level: 'info',
  message: 'What time is the testing at?',
  label: 'app.js',
  timestamp: '2017-09-30T03:57:26.875Z'
}
```

### Access logging for Express applications

Optionally you can use the built-in Express access logger:

```javascript
const { Express } = require('@quickcase/node-logging')

app.use(Express.accessLogger())
```

## Units Tests

Just do

```
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
