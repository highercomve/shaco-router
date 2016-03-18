import Shaco from 'shadow-component'
import HistoryManager from './history_manager'

let alreadyRender = false

let RouterLink = Shaco.ComponentFactory({
  elementName: 'route-link',
  template: `
    <content></content>
  `,
  to (e) {
    e.preventDefault()
    HistoryManager.push(this.state.to)
  },
  view () {
    Shaco.createElement('a', null, null, {
      href: this.state.to,
      onclick: this.to.bind(this)
    }, this.state.child)
  }
})

let RouterSelector = Shaco.ComponentFactory({
  elementName: 'route-selector',
  template: `
    <content></content>
  `,
  state: {},
  renderComponent () {
    this.parentElement.routeIs(this.state.pattern, this.state.params)
  },
  view () {
    this.renderComponent()
  }
})

let RouterManager = Shaco.ComponentFactory({
  elementName: 'route-manager',
  template: `
  <content></content>
  `,
  onMount () {
    this.watchRoute()
  },
  unMount () {
    this.history()
    window.onpopstate = function () {}
  },
  routes: [],
  defaultRoute: {},
  watchRoute () {
    this.routeVariable = {}
    window.onpopstate = (event) => {
      this.render(true)
    }
    this.history = HistoryManager.subscribe((e) => {
      this.render(true)
    })
  },
  getComponentForRoute () {
    var selectedRoute = this.routes.filter((route) => {
      return HistoryManager.match(route.pattern)
    })
    if (selectedRoute.length === 0) {
      selectedRoute = this.defaultRoute
    } else {
      selectedRoute = selectedRoute[0]
    }
    return selectedRoute
  },
  routeIs (pattern, paramsArray) {
    paramsArray = [
      ...paramsArray.slice(0,2),
      this.state,
      ...paramsArray.slice(2)
    ]
    if (pattern !== '*') {
      this.routes.push({pattern, paramsArray})
    } else {
      Object.assign(this.defaultRoute, { pattern, paramsArray })
    }
  },
  renderRouteComponent () {
    let selectedRoute = this.getComponentForRoute()
    if (selectedRoute.hasOwnProperty('pattern')) {
      selectedRoute.paramsArray[2] = Object.assign(this.state, HistoryManager.processUrl(selectedRoute.pattern))
      Shaco.createElement(...selectedRoute.paramsArray)
    }
  },
  view: function () {
    this.renderChildren()
    this.renderRouteComponent()
  }
})

export default RouterManager
