"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doRefresh = doRefresh;
exports.doSignIn = doSignIn;
exports.doSignOut = doSignOut;
function doSignIn(signInParams) {
  const authType = signInParams.auth.type || 'Bearer';
  const authToken = signInParams.auth.token;
  return {
    auth: {
      token: authToken,
      type: authType
    },
    refresh: signInParams.refresh,
    refreshExpiresAt: signInParams.refreshExpiresAt,
    userState: signInParams.userState || {}
  };
}
function doRefresh(refreshTokenParam) {
  let ret = {
    auth: {
      token: refreshTokenParam.newAuthToken,
      type: refreshTokenParam.newAuthTokenType || 'Bearer'
    }
  };
  if (refreshTokenParam.newAuthUserState) {
    ret = {
      ...ret,
      userState: refreshTokenParam.newAuthUserState
    };
  }
  if (refreshTokenParam.newRefreshToken) {
    ret = {
      ...ret,
      refresh: refreshTokenParam.newRefreshToken
    };
  }
  return ret;
}
function doSignOut() {
  return {
    auth: null
  };
}