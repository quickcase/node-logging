# node-logging

[![Build status](https://github.com/quickcase/node-logging/workflows/check-main/badge.svg)](https://github.com/quickcase/node-logging/actions)
[![npm version](https://badge.fury.io/js/%40quickcase%2Fnode-logging.svg)](https://badge.fury.io/js/%40quickcase%2Fnode-logging)

NodeJS logging component for QuickCase applications.

Some background info:
* there are 6 log levels: `trace` (5), `debug` (4), `http` (3), `info` (2), `warn` (1) and `error` (0).
* log level can be set via an environment variable `LOG_LEVEL`, the default is `info`.
* log output can be set to json, pretty print json and printf by setting environment variable `LOG_FORMAT` to either `prettyprint` or `printf` or `json`. The default is `json`.
* by default logging is turned off when running the unit tests.

## Usage

Add it as your project's dependency:

```bash
npm i @quickcase/node-logging
```

Require it:

```javascript
const logger = require('@quickcase/node-logging')('moduleName')
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
  name: 'moduleName',
  timestamp: '2021-01-30T17:57:26.875Z'
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
