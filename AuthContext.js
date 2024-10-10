"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.useReactAuthKit = useReactAuthKit;
exports.useReactAuthKitConfig = useReactAuthKitConfig;
exports.useReactAuthKitRouter = useReactAuthKitRouter;
var _react = require("react");
var _errors = require("./errors");
function getContext() {
  var context = (0, _react.createContext)(null);
  if (process.env.NODE_ENV !== 'production') {
    context.displayName = 'ReactAuthKit';
  }
  return context;
}
var AuthKitContext = getContext();
function useReactAuthKit() {
  var context = (0, _react.useContext)(AuthKitContext);
  if (context === null) {
    throw new _errors.AuthError('Auth Provider is missing. ' + 'Make sure, you are using this component inside the auth provider.');
  }
  return context.token;
}
function useReactAuthKitRouter() {
  var context = (0, _react.useContext)(AuthKitContext);
  if (context === null) {
    throw new _errors.AuthError('Auth Provider is missing. ' + 'Make sure, you are using this component inside the auth provider.');
  }
  return context.router;
}
function useReactAuthKitConfig() {
  var context = (0, _react.useContext)(AuthKitContext);
  if (context === null) {
    throw new _errors.AuthError('Auth Provider is missing. ' + 'Make sure, you are using this component inside the auth provider.');
  }
  return context.config;
}
var _default = exports.default = AuthKitContext;