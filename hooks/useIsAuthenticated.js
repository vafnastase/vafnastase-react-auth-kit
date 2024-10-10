"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _AuthContext = require("../AuthContext");
var _reducers = require("../utils/reducers");
function useIsAuthenticated() {
  var _useReactAuthKit = (0, _AuthContext.useReactAuthKit)(),
    value = _useReactAuthKit.value,
    set = _useReactAuthKit.set;
  var router = (0, _AuthContext.useReactAuthKitRouter)();
  var _useReactAuthKitConfi = (0, _AuthContext.useReactAuthKitConfig)(),
    fallbackPath = _useReactAuthKitConfi.fallbackPath;
  var navigate = router ? router.useNavigate() : null;
  var path = router ? router.usePath() : null;
  return function () {
    if (value.auth && new Date(value.auth.expiresAt) > new Date()) {
      return true;
    }
    if (value.auth && new Date(value.auth.expiresAt) <= new Date()) {
      set((0, _reducers.doSignOut)());
    }
    if (router && navigate && fallbackPath && path && path() !== fallbackPath) {
      navigate({
        to: fallbackPath
      });
    }
    return false;
  };
}
var _default = exports.default = useIsAuthenticated;