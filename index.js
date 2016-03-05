var hxdx = require('hxdx')

var createStore = require('redux').createStore
var reducer = require('./reducers')
var initial = require('./reducers/initial')
var dev = window.devToolsExtension ? window.devToolsExtension() : undefined
var store = createStore(reducer, initial, dev)

var components = require('./components')

hxdx.render(components, store)

setTimeout(function () {
  hxdx.dx({
    type: 'FETCH',
    entries: [
      {
        name: 'binder-project/example-requirements',
        stage: 'building',
        deployed: 9,
        visible: true
      },
      {
        name: 'binder-project/example-dockerfile',
        stage: 'deployed',
        deployed: 5,
        visible: true
      },
      {
        name: 'binder-project/example-conda',
        stage: 'error',
        deployed: 25,
        visible: true
      }
    ]
  })
}, 400)