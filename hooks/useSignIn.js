"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _errors = require("../errors");
var _reducers = require("../utils/reducers");
var _AuthContext = require("../AuthContext");
function useSignIn() {
  var context = (0, _AuthContext.useReactAuthKit)();
  var router = (0, _AuthContext.useReactAuthKitRouter)();
  var navigate = router ? router.useNavigate() : null;
  var redirectAfterSignin = function redirectAfterSignin(to) {
    if (to) {
      if (router && navigate) {
        navigate({
          to: to
        });
      } else {
        throw new _errors.AuthError('Router Plugin is not implemented in the AuthProvider. Please' + ' use the router prop of AuthProvider and Router plugin to' + ' use this feture');
      }
    }
  };
  return function (signInConfig) {
    if (context.value.isUsingRefreshToken) {
      if (signInConfig.refresh) {
        context.set((0, _reducers.doSignIn)(signInConfig));
        redirectAfterSignin(signInConfig.navigateTo);
        return true;
      } else {
        throw new _errors.AuthError('This appication is using refresh token feature.' + ' So please include `refresh` param in the parameters');
      }
    } else if (signInConfig.refresh) {
      throw new _errors.AuthError('This appication is not using refresh token feature.' + ' So please remove the `refresh` param in the parameters.' + ' In Case you want to use refresh token feature,' + ' make sure you added that while creating the store.');
    } else {
      context.set((0, _reducers.doSignIn)(signInConfig));
      redirectAfterSignin(signInConfig.navigateTo);
      return true;
    }
  };
}
var _default = exports.default = useSignIn;