'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var historyManager = history;
var listeners = [];

// Private Functions
function ifNotEmpty(variable) {
  return typeof variable !== 'undefined' && variable !== null && variable !== '' && typeof variable === 'string';
}

function extractQuery(url) {
  return url.slice(1).split('&').reduce(function (result, query, index) {
    var _query$split = query.split('=');

    var _query$split2 = _slicedToArray(_query$split, 2);

    var variable = _query$split2[0];
    var value = _query$split2[1];

    if (ifNotEmpty(variable)) {
      result[variable] = value;
    }
    return result;
  }, {});
}

function extractVariables(url, pattern) {
  var regPattern = getPattern(pattern);
  var matchedUrl = url.match(regPattern) || [];
  var patternVariables = getVariables(pattern);

  return matchedUrl.slice(1).reduce(function (result, match, index) {
    result[patternVariables[index]] = match;
    return result;
  }, {});
}

function getPattern(patternString) {
  var pattern = patternString.replace(/\:[a-zA-z0-9]*/g, '([a-zA-Z0-9]*)') + '(?=\\?|$)';
  return new RegExp(pattern, 'i');
}

function getVariables(pattern) {
  var matches = pattern.match(/\:([a-zA-Z0-9]*)/g) || [];
  return matches.map(function (match) {
    return match.replace(/\:/, '');
  });
}

// Public Functions
function match(pattern) {
  var url = arguments.length <= 1 || arguments[1] === undefined ? window.location : arguments[1];

  var result = url.href.match(getPattern(pattern));
  return result !== null;
}

function processUrl(pattern) {
  var url = arguments.length <= 1 || arguments[1] === undefined ? window.location : arguments[1];

  return _extends({}, extractQuery(url.search), extractVariables(url.href, pattern));
}

function callListeners() {
  listeners.map(function (listener) {
    listener();
  });
}

function push(url) {
  var state = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var title = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

  historyManager.pushState(state, title, url);
  callListeners();
}

function go() {
  var n = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];

  historyManager.go(n);
  callListeners();
}

function back() {
  historyManager.back();
  callListeners();
}

function forward() {
  historyManager.forward();
  callListeners();
}

function subscribe(listener) {
  listeners.push(listener);

  return function () {
    listeners = listeners.filter(function (f) {
      return f !== listener;
    });
  };
}

exports.default = {
  go: go,
  push: push,
  back: back,
  forward: forward,
  processUrl: processUrl,
  subscribe: subscribe,
  match: match
};