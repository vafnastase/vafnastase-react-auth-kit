"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _jsCookie = _interopRequireDefault(require("js-cookie"));
var _deepEqual = _interopRequireDefault(require("deep-equal"));
var _rxjs = require("rxjs");
var _errors = require("./errors");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class TokenObject {
  constructor(authStorageName, authStorageType, refreshTokenName, debug, cookieDomain, cookieSecure, refreshExpiresAt) {
    this.authStorageName = authStorageName;
    this.authStorageType = authStorageType;
    this.stateStorageName = `${authStorageName}_state`;
    this.refreshTokenName = refreshTokenName;
    this.refreshExpiresAt = refreshExpiresAt;
    this.cookieDomain = cookieDomain;
    this.cookieSecure = cookieSecure;
    this.debug = debug;
    this.authStorageTypeName = `${this.authStorageName}_type`;
    this.isUsingRefreshToken = !!this.refreshTokenName;
    this.authValue = this.initialToken_();
    this.authSubject = new _rxjs.BehaviorSubject(this.authValue);
    this.log(`Initial Value`, this.authValue);
    this.authSubject.subscribe({
      next: this.syncTokens
    });
  }
  subscribe = (next, error, complete) => {
    this.authSubject.subscribe({
      next: next,
      error: error,
      complete: complete
    });
  };
  onSignIn(callback) {
    this.subscribe(value => {
      if (value.auth !== null) {
        callback(value);
      }
    });
  }
  onSignOut(callback) {
    this.subscribe(value => {
      if (value.auth === null) {
        callback();
      }
    });
  }
  set = data => {
    this.log(`Set Function is called with`, data);
    this.log(`Set Function Old Data`, this.value);
    let obj = {
      ...this.value
    };
    if (data.userState !== undefined) {
      obj.userState = data.userState;
    }
    if (data.auth) {
      try {
        const exp = this.getExpireDateTime(data.auth.token);
        if (exp > new Date()) {
          obj = {
            ...obj,
            auth: {
              'token': data.auth.token,
              'type': data.auth.type,
              'expiresAt': exp
            },
            isSignIn: true
          };
        } else {
          obj = {
            ...obj,
            auth: null,
            isSignIn: false,
            userState: null
          };
          new _errors.AuthError('Given Auth Token is already expired.');
        }
      } catch (e) {
        obj = {
          ...obj,
          auth: null,
          isSignIn: false,
          userState: null
        };
        new _errors.AuthError('Error pursing the Auth Token. Make sure you provided a valid JWT.');
      }
    } else if (data.auth === null) {
      obj = {
        ...obj,
        auth: null,
        isSignIn: false,
        userState: null
      };
    }
    if (this.isUsingRefreshToken) {
      if (obj.auth === null) {
        obj = {
          ...obj,
          refresh: null
        };
      } else if (data.refresh) {
        try {
          let refreshExpireTime = null;
          try {
            refreshExpireTime = this.getExpireDateTime(data.refresh);
          } catch (error) {
            if (this.refreshExpiresAt) {
              refreshExpireTime = new Date(this.refreshExpiresAt);
            } else {
              new _errors.AuthError('Refresh Token is not a valid JWT. And no manual refresh expiration time is set.');
            }
          }
          if (refreshExpireTime !== null) {
            if (refreshExpireTime > new Date()) {
              obj = {
                ...obj,
                refresh: {
                  'token': data.refresh,
                  'expiresAt': refreshExpireTime
                }
              };
            } else {
              obj = {
                ...obj,
                auth: null,
                isSignIn: false,
                userState: null,
                refresh: null
              };
              new _errors.AuthError('Given Refresh Token is already expired.');
            }
          }
        } catch (e) {
          obj = {
            ...obj,
            auth: null,
            isSignIn: false,
            userState: null,
            refresh: null
          };
          new _errors.AuthError('Error pursing the Auth Token.' + ' Make sure you provided a valid JWT.');
        }
      } else if (data.refresh === null) {
        obj = {
          ...obj,
          refresh: null
        };
      }
    }
    this.log(`Set Function New Data`, obj);
    if (!(0, _deepEqual.default)(this.value, obj)) {
      this.log('Updating the value in the Set Function');
      this.authValue = obj;
      this.authSubject.next(obj);
    }
  };
  get value() {
    return this.authSubject.value;
  }
  initialToken_ = () => {
    if (this.authStorageType === 'cookie') {
      return this.initialCookieToken_();
    } else {
      return this.initialLSToken_();
    }
  };
  initialCookieToken_ = () => {
    const authToken = _jsCookie.default.get(this.authStorageName);
    const authTokenType = _jsCookie.default.get(this.authStorageTypeName);
    const stateCookie = _jsCookie.default.get(this.stateStorageName);
    const refreshToken = this.isUsingRefreshToken && this.refreshTokenName != null ? _jsCookie.default.get(this.refreshTokenName) : null;
    return this.checkTokenExist_(authToken, authTokenType, stateCookie, refreshToken);
  };
  initialLSToken_ = () => {
    const authToken = localStorage.getItem(this.authStorageName);
    const authTokenType = localStorage.getItem(this.authStorageTypeName);
    const stateCookie = localStorage.getItem(this.stateStorageName);
    const refreshToken = this.isUsingRefreshToken && this.refreshTokenName != null ? localStorage.getItem(this.refreshTokenName) : null;
    return this.checkTokenExist_(authToken, authTokenType, stateCookie, refreshToken);
  };
  checkTokenExist_ = (authToken, authTokenType, stateCookie, refreshToken) => {
    this.log('checkTokenExist_ is called');
    this.log(`Params: authToken: ${authToken}, authTokenType: ${authTokenType},
      stateCookie: ${stateCookie}, refreshToken: ${refreshToken}`);
    try {
      let refresh;
      if (this.isUsingRefreshToken && !!refreshToken) {
        this.log(`checkTokenExist - isUsingRefreshToken
          = ${this.isUsingRefreshToken} refrehToken - ${refreshToken}`);
        let refreshTokenExpiresAt = null;
        try {
          refreshTokenExpiresAt = this.getExpireDateTime(refreshToken);
        } catch (error) {
          if (this.refreshExpiresAt) {
            refreshTokenExpiresAt = new Date(this.refreshExpiresAt);
          } else {
            throw new _errors.AuthError('Refresh Token is not a valid JWT. And no manual refresh expiration time is set.');
          }
        }
        if (refreshTokenExpiresAt) {
          if (refreshTokenExpiresAt < new Date()) {
            this.log(`checkTokenExist - refresh token is expired
            ${refreshTokenExpiresAt} ${new Date()}`);
            refresh = null;
          } else {
            this.log(`checkTokenExist - new refresh token is assigned
            ${refreshToken}`);
            refresh = {
              token: refreshToken,
              expiresAt: refreshTokenExpiresAt
            };
          }
        }
      } else {
        this.log(`checkTokenExist - Refesh Token is invalid or not using
           refresh feature ${this.isUsingRefreshToken} ${refreshToken}`);
        refresh = null;
      }
      if (this.isUsingRefreshToken && !refresh) {
        this.log(`checkTokenExist - Removing Refresh Token`);
        this.removeAllToken();
        return {
          auth: null,
          refresh: null,
          userState: null,
          isUsingRefreshToken: this.isUsingRefreshToken,
          isSignIn: false
        };
      }
      let auth;
      let authState;
      if (!!authToken && !!authTokenType && !!stateCookie) {
        this.log(`checkTokenExist - authToken, authTokenType, stateCookie exists`);
        try {
          const expiresAt = this.getExpireDateTime(authToken);
          if (expiresAt < new Date()) {
            this.log(`checkTokenExist - auth token is expired
              ${expiresAt} ${new Date()}`);
            auth = null;
            authState = null;
          } else {
            try {
              authState = JSON.parse(stateCookie.replaceAll('\\', ''));
              auth = {
                token: authToken,
                type: authTokenType,
                expiresAt: expiresAt
              };
            } catch (err) {
              this.log('state cookie JSON parsing failed ${err}');
              auth = null;
              authState = null;
            }
          }
        } catch (e) {
          this.log(`checkTokenExist - auth token or auth state is invalid
            ${authToken} ${stateCookie}`);
          this.log(`Error Occured: ${e}`);
          auth = null;
          authState = null;
        }
      } else {
        this.log(`checkTokenExist ` + `- authToken, authTokenType, stateCookie doesn't exists`);
        auth = null;
        authState = null;
      }
      if (refresh) {
        if (!!auth && !!authState) {
          this.log('checkTokenExist - Returning auth and refrsh');
          this.log({
            auth: auth,
            refresh: refresh,
            userState: authState,
            isUsingRefreshToken: this.isUsingRefreshToken,
            isSignIn: true
          });
          return {
            auth: auth,
            refresh: refresh,
            userState: authState,
            isUsingRefreshToken: this.isUsingRefreshToken,
            isSignIn: true
          };
        }
        this.log('checkTokenExist - Removing Auth Token');
        this.removeAuth();
        this.log({
          auth: null,
          refresh: refresh,
          userState: null,
          isUsingRefreshToken: this.isUsingRefreshToken,
          isSignIn: false
        });
        return {
          auth: null,
          refresh: refresh,
          userState: null,
          isUsingRefreshToken: this.isUsingRefreshToken,
          isSignIn: false
        };
      } else if (!this.isUsingRefreshToken && !!auth && !!authState) {
        this.log('checkTokenExist - Returning auth');
        this.log({
          auth: auth,
          refresh: null,
          userState: authState,
          isUsingRefreshToken: this.isUsingRefreshToken,
          isSignIn: true
        });
        return {
          auth: auth,
          refresh: null,
          userState: authState,
          isUsingRefreshToken: this.isUsingRefreshToken,
          isSignIn: true
        };
      }
      {
        this.log('checkTokenExist- removing all tokens. Returning null');
        this.removeAllToken();
        return {
          auth: null,
          refresh: null,
          userState: null,
          isUsingRefreshToken: this.isUsingRefreshToken,
          isSignIn: false
        };
      }
    } catch (e) {
      this.removeAllToken();
      return {
        auth: null,
        refresh: null,
        userState: null,
        isUsingRefreshToken: this.isUsingRefreshToken,
        isSignIn: false
      };
    }
  };
  parseJwt = token => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };
  getExpireDateTime = token => {
    const jwtData = this.parseJwt(token);
    if (Object.prototype.hasOwnProperty.call(jwtData, 'exp')) {
      const d = new Date(0);
      d.setUTCSeconds(jwtData.exp);
      return d;
    } else {
      throw new _errors.AuthError('JWT has no exp param');
    }
  };
  syncTokens = authState => {
    if (authState.auth) {
      this.setAuthToken(authState.auth.token, authState.auth.type, authState.userState);
    } else {
      this.removeAuth();
    }
    if (!!authState.refresh && this.isUsingRefreshToken) {
      this.setRefreshToken(authState.refresh.token);
    } else {
      this.removeRefresh();
    }
  };
  setAuthToken = (authToken, authTokenType, authState) => {
    if (this.authStorageType === 'cookie') {
      const expiresAt = this.getExpireDateTime(authToken);
      _jsCookie.default.set(this.authStorageName, authToken, {
        expires: expiresAt,
        domain: this.cookieDomain,
        secure: this.cookieSecure
      });
      _jsCookie.default.set(this.authStorageTypeName, authTokenType, {
        expires: expiresAt,
        domain: this.cookieDomain,
        secure: this.cookieSecure
      });
      if (authState) {
        _jsCookie.default.set(this.stateStorageName, JSON.stringify(authState), {
          expires: expiresAt,
          domain: this.cookieDomain,
          secure: this.cookieSecure
        });
      }
    } else {
      window.localStorage.setItem(this.authStorageName, authToken);
      window.localStorage.setItem(this.authStorageTypeName, authTokenType);
      if (authState) {
        window.localStorage.setItem(this.stateStorageName, JSON.stringify(authState));
      }
    }
  };
  setRefreshToken = refreshToken => {
    if (this.authStorageType === 'cookie') {
      if (this.isUsingRefreshToken && !!this.refreshTokenName && !!refreshToken) {
        let refreshTokenExpiresAt = null;
        try {
          refreshTokenExpiresAt = this.getExpireDateTime(refreshToken);
        } catch (error) {
          if (this.refreshExpiresAt) {
            refreshTokenExpiresAt = new Date(this.refreshExpiresAt);
          } else {
            throw new _errors.AuthError('Refresh Token is not a valid JWT. And no manual refresh expiration time is set.');
          }
        }
        if (refreshTokenExpiresAt) {
          _jsCookie.default.set(this.refreshTokenName, refreshToken, {
            expires: refreshTokenExpiresAt,
            domain: this.cookieDomain,
            secure: this.cookieSecure
          });
        }
      }
    } else if (this.isUsingRefreshToken && !!this.refreshTokenName && !!refreshToken) {
      localStorage.setItem(this.refreshTokenName, refreshToken);
    }
  };
  removeAllToken = () => {
    if (this.authStorageType === 'cookie') {
      this.removeAllCookieToken_();
    } else {
      this.removeAllLSToken_();
    }
  };
  removeAllCookieToken_ = () => {
    _jsCookie.default.remove(this.authStorageName, {
      domain: this.cookieDomain,
      secure: this.cookieSecure
    });
    _jsCookie.default.remove(this.authStorageTypeName, {
      domain: this.cookieDomain,
      secure: this.cookieSecure
    });
    _jsCookie.default.remove(this.stateStorageName, {
      domain: this.cookieDomain,
      secure: this.cookieSecure
    });
    if (this.isUsingRefreshToken && !!this.refreshTokenName) {
      _jsCookie.default.remove(this.refreshTokenName, {
        domain: this.cookieDomain,
        secure: this.cookieSecure
      });
    }
  };
  removeAllLSToken_ = () => {
    localStorage.removeItem(this.authStorageName);
    localStorage.removeItem(this.authStorageTypeName);
    localStorage.removeItem(this.stateStorageName);
    if (this.isUsingRefreshToken && !!this.refreshTokenName) {
      localStorage.removeItem(this.refreshTokenName);
    }
  };
  removeAuth = () => {
    if (this.authStorageType === 'cookie') {
      this.removeAuthCookie();
    } else {
      this.removeAuthToken();
    }
  };
  removeAuthCookie = () => {
    _jsCookie.default.remove(this.authStorageName, {
      domain: this.cookieDomain,
      secure: this.cookieSecure
    });
    _jsCookie.default.remove(this.authStorageTypeName, {
      domain: this.cookieDomain,
      secure: this.cookieSecure
    });
    _jsCookie.default.remove(this.stateStorageName, {
      domain: this.cookieDomain,
      secure: this.cookieSecure
    });
  };
  removeAuthToken = () => {
    localStorage.removeItem(this.authStorageName);
    localStorage.removeItem(this.authStorageTypeName);
    localStorage.removeItem(this.stateStorageName);
  };
  removeRefresh = () => {
    if (this.authStorageType === 'cookie') {
      this.removeRefreshCookie();
    } else {
      this.removeRefreshLocalStorage();
    }
  };
  removeRefreshCookie = () => {
    if (this.isUsingRefreshToken && !!this.refreshTokenName) {
      _jsCookie.default.remove(this.refreshTokenName, {
        domain: this.cookieDomain,
        secure: this.cookieSecure
      });
    }
  };
  removeRefreshLocalStorage = () => {
    if (this.isUsingRefreshToken && !!this.refreshTokenName) {
      localStorage.removeItem(this.refreshTokenName);
    }
  };
  log = (msg, ...optionalParams) => {
    if (this.debug) {
      console.log(`React Auth Kit - ${msg}`, optionalParams);
    }
  };
}
var _default = exports.default = TokenObject;