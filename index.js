var hxdx = require('hxdx')

var createStore = require('redux').createStore
var reducer = require('./reducers')
var initial = require('./reducers/initial')
var dev = window.devToolsExtension ? window.devToolsExtension() : undefined
var store = createStore(reducer, initial, dev)

var components = require('./components')

hxdx.render(components, store)