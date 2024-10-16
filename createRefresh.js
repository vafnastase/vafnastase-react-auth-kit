"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _errors = require("./errors");
function createRefresh(param) {
  if (param.interval < 0) {
    throw new _errors.AuthError('Refresh interval is a time in seconds and can\'t be a negative(-ve)' + ' number. Make sure you are using possitive number.');
  }
  return param;
}
var _default = exports.default = createRefresh;