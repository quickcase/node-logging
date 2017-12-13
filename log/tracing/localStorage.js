'use strict'

const { createNamespace } = require('continuation-local-storage')

const INITIAL_REQUEST = 'initialRequest'

const clsNamespace = createNamespace('uk.gov.hmcts.reform.tracing.localStorage')

class LocalStorage {
  static proceedWithinLocalStorageContext (req, res, next) {
    clsNamespace.run(() => {
      clsNamespace.bindEmitter(req)
      clsNamespace.bindEmitter(res)
      clsNamespace.set(INITIAL_REQUEST, req)
      next()
    })
  }

  static retrieveInitialRequest () {
    return clsNamespace.get(INITIAL_REQUEST)
  }
}

module.exports = LocalStorage
