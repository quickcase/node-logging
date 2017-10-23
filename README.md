## Logging

* There are 8 log levels: ALL, TRACE, DEBUG, INFO, WARN, ERROR, FATAL and OFF.
* A level can be set via an environment variable LOG_LEVEL, the default is**info**.
* There are 2 types of logging output which is set via an environment variable LOG_OUTPUT, the default is**single**.
  1. Production - a single line output - LOG_OUTPUT=single.
  2. Development - a multi line output - LOG_OUTPUT=multi.
* By default logging is turned off when running these unit tests.

#### Use

```
yarn add @hmcts/nodejs-logging
```

```
// Require it
const logging = require('nodejs-logging');
```

```
// Set this config only once
logging.config({ 
    microservice: 'your-service-name', 
    team: 'YOURTEAM'
    environment: 'some-environemnt'
});
```

```
// Get your logger
logger = logging.getLogger('app.js');
```

```
// Get logging
  logger.info({
    message: 'Yay, logging!'
  });
```

Optionally you can use the built in express.js access logger.

```
app.use(logging.express.accessLogger());
```

A typical HTTP 404 log error when encountering an error would look like the following.
```
{
  responseCode: 404,
  message: 'Not Found',
  fields: [],
  level: 'ERROR',
  environment: 'some-environemnt',
  hostname: 'My-MacBook-Pro.local',
  rootRequestId: '',
  requestId: '',
  originRequestId: '',
  type: 'nodejs',
  microservice: 'your-service-name',
  team: 'YOURTEAM',
  timestamp: '2017-01-27T11:27:23+00:00'
}
```

#### Units Tests

```
yarn test
```

