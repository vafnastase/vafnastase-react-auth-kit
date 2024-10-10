"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _AuthContext = require("../AuthContext");
var _useIsAuthenticated = _interopRequireDefault(require("./useIsAuthenticated"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function useAuthHeader() {
  var _useReactAuthKit = (0, _AuthContext.useReactAuthKit)(),
    value = _useReactAuthKit.value;
  var isAuthenticated = (0, _useIsAuthenticated.default)();
  return function () {
    if (!!value.auth && isAuthenticated()) {
      return "".concat(value.auth.type, " ").concat(value.auth.token);
    } else {
      return null;
    }
  };
}
var _default = exports.default = useAuthHeader;