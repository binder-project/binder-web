var hxdx = require('hxdx')
var createStore = require('redux').createStore
var reducer = require('./reducers')
var initial = require('./reducers/initial')
var actions = require('./reducers/actions')
var components = require('./components')
var sheetRouter = require('sheet-router')

var store = createStore(reducer, initial)
hxdx.render(components, store)

var router = sheetRouter('/', function (route) {
  return [
    route('/', function (params){ 
      actions.showOverview()(hxdx.dx)
    }),
    route('/status/:project/:repo', function (params) {
      actions.showDetail(params.project + '-' + params.repo)(hxdx.dx)
    })
  ]
})

router(window.location.pathname)