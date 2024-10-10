"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createStore;
var _errors = require("./errors");
var _RxTokenObject = _interopRequireDefault(require("./RxTokenObject"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function createStore(params) {
  if (params.authType === 'cookie' && (params.cookieDomain === undefined || params.cookieSecure === undefined)) {
    throw new _errors.AuthError('authType \'cookie\' requires \'cookieDomain\'' + ' and \'cookieSecure\' to be present in the param');
  }
  const refreshTokenName = params.refresh ? `${params.authName}_refresh` : null;
  const tokenObject = new _RxTokenObject.default(params.authName, params.authType, refreshTokenName, params.debug === undefined ? false : params.debug, params.cookieDomain, params.cookieSecure);
  return {
    tokenObject,
    refresh: params.refresh
  };
}