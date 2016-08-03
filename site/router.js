var hxdx = require('hxdx')
var actions = require('./reducers/actions')
var sheetRouter = require('sheet-router')

module.exports = sheetRouter('/', function (route) {
  function repo (params) {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port
    var url = baseURL + '/repo/' + params.org + '/' + params.repo
    if (params.branch) url += '/tree/' + params.branch
    window.location.href = url
  }

  function status (params) {
    var imageName = params.project + '-' + params.repo
    if (params.branch) imageName += '-' + params.branch
    actions.showDetail(imageName)(hxdx.dx)
  }

  return [
    route('/', function (params){
      actions.showOverview()(hxdx.dx)
    }),
    route('/repo/:org/:repo', repo),
    route('/repo/:org/:repo/tree/:branch', repo),
    route('/status/:project/:repo', status),
    route('/status/:project/:repo/tree/:branch', status)
  ]
})
