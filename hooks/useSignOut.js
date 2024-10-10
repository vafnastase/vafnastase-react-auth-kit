"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _errors = require("../errors");
var _reducers = require("../utils/reducers");
var _AuthContext = require("../AuthContext");
function useSignOut() {
  var context = (0, _AuthContext.useReactAuthKit)();
  var router = (0, _AuthContext.useReactAuthKitRouter)();
  var navigate = router ? router.useNavigate() : null;
  return function (navigateTo) {
    context.set((0, _reducers.doSignOut)());
    if (navigateTo) {
      if (router && navigate) {
        navigate({
          to: navigateTo
        });
      } else {
        throw new _errors.AuthError('Router Plugin is not implemented in the AuthProvider. Please' + ' use the router prop of AuthProvider and Router plugin to' + ' use this feture');
      }
    }
  };
}
var _default = exports.default = useSignOut;