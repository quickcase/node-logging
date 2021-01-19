'use strict'

const Logger = require('./log/logger');
const Express = require('./log/express');

module.exports = Logger;
module.exports.Logger = Logger;
module.exports.Express = Express;
