var hxdx = require('hxdx')
var actions = require('./reducers/actions')
var sheetRouter = require('sheet-router')

module.exports = sheetRouter('/', function (route) {
  return [
    route('/', function (params){ 
      actions.showOverview()(hxdx.dx)
    }),
    route('/repo/:org/:repo', function (params) {
      var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port
      window.location.href =  baseURL + '/repo/' + params.org + '/' + params.repo
    }),
    route('/status/:project/:repo', function (params) {
      actions.showDetail(params.project + '-' + params.repo)(hxdx.dx)
    })
  ]
})
