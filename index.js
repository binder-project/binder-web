var hxdx = require('hxdx')

var createStore = require('redux').createStore
var reducer = require('./reducers/index')
var store = createStore(reducer)

var app = require('./components')

hxdx.render(app, store)