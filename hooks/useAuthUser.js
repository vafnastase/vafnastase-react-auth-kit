"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _AuthContext = require("../AuthContext");
var _useIsAuthenticated = _interopRequireDefault(require("./useIsAuthenticated"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function useAuthUser() {
  var _useReactAuthKit = (0, _AuthContext.useReactAuthKit)(),
    value = _useReactAuthKit.value;
  var isAuthenticated = (0, _useIsAuthenticated.default)();
  return function () {
    if (isAuthenticated()) {
      return value.userState;
    } else {
      return null;
    }
  };
}
var _default = exports.default = useAuthUser;