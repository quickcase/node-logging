'use strict'

const uuid = require('uuid')

const LocalStorage = require('./localStorage')
const { REQUEST_ID_HEADER, ROOT_REQUEST_ID_HEADER, ORIGIN_REQUEST_ID_HEADER } = require('./headers')

function setInitialRequestTracingHeaders (req) {
  const id = uuid()
  req.headers[REQUEST_ID_HEADER] = id
  req.headers[ROOT_REQUEST_ID_HEADER] = id
  req.headers[ORIGIN_REQUEST_ID_HEADER] = undefined
}

function tracingHeadersNotPresentOrInvalid (req) {
  return notUUID(req.headers[REQUEST_ID_HEADER])
    || notUUID(req.headers[ROOT_REQUEST_ID_HEADER])
    || notUUID(req.headers[ORIGIN_REQUEST_ID_HEADER])
}

function notUUID (uuidString) {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  return !UUID_REGEX.test(uuidString)
}

class RequestTracing {
  static middleware (req, res, next) {
    if (tracingHeadersNotPresentOrInvalid(req)) {
      setInitialRequestTracingHeaders(req)
    }
    LocalStorage.proceedWithinLocalStorageContext(req, res, next)
  }

  static getInitialRequest () {
    return LocalStorage.retrieveInitialRequest()
  }

  static getRootRequestId () {
    return RequestTracing.getInitialRequest().headers[ROOT_REQUEST_ID_HEADER]
  }

  static getCurrentRequestId () {
    return RequestTracing.getInitialRequest().headers[REQUEST_ID_HEADER]
  }

  static createNextRequestId () {
    return uuid()
  }
}

module.exports = RequestTracing
