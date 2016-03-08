var hxdx = require('hxdx')
var createStore = require('redux').createStore
var reducer = require('./reducers')
var initial = require('./reducers/initial')
var actions = require('./reducers/actions')
var dev = window.devToolsExtension ? window.devToolsExtension() : undefined
var components = require('./components')

var store = createStore(reducer, initial, dev)
hxdx.render(components, store)

actions.fetch()(hxdx.dx)