'use strict'
/* global describe, context, it, beforeEach */

const uuid = require('uuid')

const { expect, sinon } = require('../../chai-sinon')

const RequestTracing = require('../../../log/tracing/requestTracing')
const { REQUEST_ID_HEADER, ROOT_REQUEST_ID_HEADER, ORIGIN_REQUEST_ID_HEADER } = require('../../../log/tracing/headers')

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

// Needed by CLS Namespace#bindEmitter
class MockedEventEmitter {
  on () { }
  addListener () { }
  removeListener () { }
  emit () { }
}

describe('RequestTracing', () => {
  let req, res, next

  beforeEach(() => {
    req = new MockedEventEmitter()
    req.headers = { }
    res = new MockedEventEmitter()
    next = sinon.stub()
  })

  describe('middleware', () => {
    const GIBBERISH = 'gibberish'

    function itShouldSetNewRequestIdValues () {
      it(`should set ${REQUEST_ID_HEADER} header with UUID`, () => {
        RequestTracing.middleware(req, req, next)
        expect(req.headers[REQUEST_ID_HEADER]).to.match(UUID_REGEX)
      })

      it(`should set ${ROOT_REQUEST_ID_HEADER} header with UUID`, () => {
        RequestTracing.middleware(req, req, next)
        expect(req.headers[ROOT_REQUEST_ID_HEADER]).to.match(UUID_REGEX)
      })

      it(`should set ${REQUEST_ID_HEADER} and ${ROOT_REQUEST_ID_HEADER} headers with the same value`, () => {
        RequestTracing.middleware(req, req, next)
        expect(req.headers[REQUEST_ID_HEADER]).to.equal(req.headers[ROOT_REQUEST_ID_HEADER])
      })

      it(`should not set ${ORIGIN_REQUEST_ID_HEADER} header`, () => {
        RequestTracing.middleware(req, req, next)
        expect(req.headers[ORIGIN_REQUEST_ID_HEADER]).to.be.undefined
      })

      it(`should overwrite existing ${ROOT_REQUEST_ID_HEADER} value if it's present`, () => {
        req.headers[ROOT_REQUEST_ID_HEADER] = 'gibberish'
        RequestTracing.middleware(req, req, next)
        expect(req.headers[ROOT_REQUEST_ID_HEADER]).not.to.equal('gibberish')
      })

      it(`should blank existing ${ORIGIN_REQUEST_ID_HEADER} if it's present`, () => {
        req.headers[ORIGIN_REQUEST_ID_HEADER] = 'gibberish'
        RequestTracing.middleware(req, req, next)
        expect(req.headers[ORIGIN_REQUEST_ID_HEADER]).to.be.undefined
      })

      it('should call the next function', () => {
        RequestTracing.middleware(req, res, next)
        expect(next).calledOnce
      })
    }

    context(`when ${REQUEST_ID_HEADER} is not initially present`, () => {
      itShouldSetNewRequestIdValues()
    })

    context(`when ${REQUEST_ID_HEADER} is not a valid UUID`, () => {
      beforeEach(() => {
        req.headers[REQUEST_ID_HEADER] = GIBBERISH
      })

      itShouldSetNewRequestIdValues()
    })

    context(`when ${REQUEST_ID_HEADER} is valid UUID but ${ROOT_REQUEST_ID_HEADER} is not`, () => {
      beforeEach(() => {
        req.headers[REQUEST_ID_HEADER] = uuid()
        req.headers[ROOT_REQUEST_ID_HEADER] = GIBBERISH
      })

      itShouldSetNewRequestIdValues()
    })

    context(`when ${REQUEST_ID_HEADER} is valid UUID but ${ORIGIN_REQUEST_ID_HEADER} is not`, () => {
      beforeEach(() => {
        req.headers[REQUEST_ID_HEADER] = uuid()
        req.headers[ORIGIN_REQUEST_ID_HEADER] = GIBBERISH
      })

      itShouldSetNewRequestIdValues()
    })

    context('when all header values are valid UUIDs', () => {
      const requestId = uuid()
      const rootRequestId = uuid()
      const originRequestId = uuid()

      beforeEach(() => {
        req.headers[REQUEST_ID_HEADER] = requestId
        req.headers[ROOT_REQUEST_ID_HEADER] = rootRequestId
        req.headers[ORIGIN_REQUEST_ID_HEADER] = originRequestId
      })

      it('should keep those values', () => {
        RequestTracing.middleware(req, req, next)
        expect(req.headers[REQUEST_ID_HEADER]).to.equal(requestId)
        expect(req.headers[ROOT_REQUEST_ID_HEADER]).to.equal(rootRequestId)
        expect(req.headers[ORIGIN_REQUEST_ID_HEADER]).to.equal(originRequestId)
      })

      it('should call the next function', () => {
        RequestTracing.middleware(req, res, next)
        expect(next).calledOnce
      })
    })
  })

  describe('getInitialRequest', () => {
    it('should return the request object', (done) => {
      function createNextFunction (done) {
        return function () {
          const initialRequest = RequestTracing.getInitialRequest()
          expect(initialRequest).to.equal(req)
          done()
        }
      }

      RequestTracing.middleware(req, req, createNextFunction(done))
    })
  })

  describe('getRootRequestId', () => {
    it(`should return the ${ROOT_REQUEST_ID_HEADER}`, (done) => {
      function createNextFunction (done) {
        return function () {
          const rootRequestId = RequestTracing.getRootRequestId()
          expect(rootRequestId).to.equal(req.headers[ROOT_REQUEST_ID_HEADER])
          done()
        }
      }

      RequestTracing.middleware(req, req, createNextFunction(done))
    })
  })

  describe('getCurrentRequestId', () => {
    it(`should return the ${REQUEST_ID_HEADER}`, (done) => {
      function createNextFunction (done) {
        return function () {
          const rootRequestId = RequestTracing.getCurrentRequestId()
          expect(rootRequestId).to.equal(req.headers[REQUEST_ID_HEADER])
          done()
        }
      }

      RequestTracing.middleware(req, req, createNextFunction(done))
    })
  })

  describe('createNextRequestId', () => {
    it('should return a UUID value', () => {
      const nextRequestId = RequestTracing.createNextRequestId()
      expect(nextRequestId).to.match(UUID_REGEX)
    })
  })
})
