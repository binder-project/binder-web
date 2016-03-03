var hxdx = require('hxdx')

var createStore = require('redux').createStore
var reducer = require('./reducers/index')
var store = createStore(reducer)

var components = require('./components')

hxdx.render(components, store)