"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useInterval = useInterval;
var _react = require("react");
function useInterval(callback, delay) {
  const savedCallback = (0, _react.useRef)(callback);
  const intervalRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    savedCallback.current = callback;
  }, [callback]);
  (0, _react.useEffect)(() => {
    const tick = () => savedCallback.current();
    if (typeof delay === 'number') {
      intervalRef.current = window.setInterval(tick, delay * 60 * 1000);
    }
    return () => {
      if (intervalRef.current) {
        window.clearTimeout(intervalRef.current);
      }
    };
  }, [delay]);
  return intervalRef;
}