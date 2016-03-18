# shaco-router

This is a component for [Shaco](http://github.com/highercomve/shadowDOMcomponent) that allow use the window.history to change the URL on the browser and render diferents components depending of the URL


## Example

```
const TodoContainer = Shaco.ComponentFactory({
  elementName: 'todo-container',
  template: `<content></content>`,
  view: function () {
    /*
     * RouteManager: will allow render one component depending the URL in the browser.
     *
     * the routeIs function receive to params:
     * Fist the pattern to match the URL, Example:
     *    This could be something like:
     *    "/" -> the index
     *    "/tasks"
     *    "/tasks/:id"
     *    ".*" -> the rest
     * The second parameter is and array that will be past to Shaco.createElement. You don't add the state here
     * The State will be passed to all the components inside the router-manager
     * You can use router-manager using JSX like before or using javascript functions, like this:
     *
     */
     
    // With Javascript functions (normal Shaco components)
    // Shaco.createElement('route-manager', null, this.state, {}, () => {
    //   Shaco.createElement('route-selector', null, { pattern: '/', params: ['todo-app', null]} )
    //   Shaco.createElement('route-selector', null, { pattern: '.*', params: ['div', null, {}, "Not found"]} )
    // })

    // With JSX
    return (
      <route-manager state={this.state}>
        <route-selector state={{ pattern: '/', params: ['todo-app', null] }}></route-selector>
        <route-selector state={{ pattern: '.*', params: ['div', null, {}, "Not found"]}}></route-selector>
      </route-manager>
    )
  }
})
```
