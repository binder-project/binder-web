var hxdx = require('hxdx')
var actions = require('./reducers/actions')
var sheetRouter = require('sheet-router')

module.exports = sheetRouter('/', function (route) {
  return [
    route('/', function (params){ 
      actions.showOverview()(hxdx.dx)
    }),
    route('/status/:project/:repo', function (params) {
      actions.showDetail(params.project + '-' + params.repo)(hxdx.dx)
    })
  ]
})