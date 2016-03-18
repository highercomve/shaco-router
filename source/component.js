'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shadowComponent = require('shadow-component');

var _shadowComponent2 = _interopRequireDefault(_shadowComponent);

var _history_manager = require('./history_manager');

var _history_manager2 = _interopRequireDefault(_history_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var alreadyRender = false;

var RouterSelector = _shadowComponent2.default.ComponentFactory({
  elementName: 'route-selector',
  template: '\n    <content></content>\n  ',
  state: {},
  renderComponent: function renderComponent() {
    this.parentElement.routeIs(this.state.pattern, this.state.params);
  },
  view: function view() {
    this.renderComponent();
  }
});

var RouterManager = _shadowComponent2.default.ComponentFactory({
  elementName: 'route-manager',
  template: '\n  <content></content>\n  ',
  onMount: function onMount() {
    this.watchRoute();
  },
  unMount: function unMount() {
    this.history();
    window.onpopstate = function () {};
  },

  routes: [],
  defaultRoute: {},
  watchRoute: function watchRoute() {
    var _this = this;

    this.routeVariable = {};
    window.onpopstate = function (event) {
      _this.render(true);
    };
    this.history = _history_manager2.default.subscribe(function (e) {
      _this.render(true);
    });
  },
  getComponentForRoute: function getComponentForRoute() {
    var selectedRoute = this.routes.filter(function (route) {
      return _history_manager2.default.match(route.pattern);
    });
    if (selectedRoute.length === 0) {
      selectedRoute = this.defaultRoute;
    } else {
      selectedRoute = selectedRoute[0];
    }
    return selectedRoute;
  },
  routeIs: function routeIs(pattern, paramsArray) {
    paramsArray = [].concat(_toConsumableArray(paramsArray.slice(0, 2)), [this.state], _toConsumableArray(paramsArray.slice(2)));
    if (pattern !== '*') {
      this.routes.push({ pattern: pattern, paramsArray: paramsArray });
    } else {
      Object.assign(this.defaultRoute, { pattern: pattern, paramsArray: paramsArray });
    }
  },
  renderChild: function renderChild() {
    var child = arguments.length <= 0 || arguments[0] === undefined ? this.state.child : arguments[0];

    if (typeof child === 'function') {
      return child();
    } else if (Array.isArray(child)) {
      child.forEach(this.renderChild);
    } else {
      return child;
    }
  },
  renderRouteComponent: function renderRouteComponent() {
    var selectedRoute = this.getComponentForRoute();
    if (selectedRoute.hasOwnProperty('pattern')) {
      selectedRoute.paramsArray[2] = Object.assign(this.state, _history_manager2.default.processUrl(selectedRoute.pattern));
      _shadowComponent2.default.createElement.apply(_shadowComponent2.default, _toConsumableArray(selectedRoute.paramsArray));
    }
  },

  view: function view() {
    this.renderChild();
    this.renderRouteComponent();
  }
});

exports.default = RouterManager;