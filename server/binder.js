var async = require('async')
var map = require('lodash.map')
var filter = require('lodash.filter')
var partial = require('lodash.partial')
var assign = require('object-assign')
var binder = require('binder-cli')
var getReader = require('binder-logging/lib/reader')
var es = require('event-stream')

// TODO: set these parameters according to your production environment
var buildOpts = {
  host: '104.197.23.111',
  port: '8082',
  'api-key': '60dc798d55521d0552334c70797cb15f'
}
var registryOpts = {
  host: '104.197.23.111',
  port: '8082',
  'api-key': '60dc798d55521d0552334c70797cb15f'
}
var deployOpts = {
  host: '104.197.23.111',
  port: '8084',
  'api-key': '60dc798d55521d0552334c70797cb15f'
}

function startBuild (repo, cb) {
  var opts = assign({}, buildOpts, { repository: repo })
  binder.build.start(opts, function (err, body) {
    if (err) return cb(err)
    return cb(null, body)
  })
}

function getTemplateInfo (templateName, cb) {
  function getStatuses (next) {
    var opts = assign({}, deployOpts, { 'template-name': templateName })
    binder.deploy.statusAll(opts, function (err, statuses) {
      if (err) return next(err)
      var numDeployed = filter(statuses, { status: 'deployed' }).length
      return next(null, numDeployed)
    })
  }
  async.parallel([
    getStatuses,
    partial(getBuildStatus, templateName)
  ], function (err, res) {
    if (err) return cb(err)
    return cb(null, {
      'name': templateName,
      'deployed': res[0],
      'build': res[1]
    })
  })
}

function getOverview (cb) {
  binder.build.statusAll(buildOpts, function (err, builds) {
    console.log('builds: ' + JSON.stringify(builds))
    if (err) return cb(err)
    async.map(map(builds, 'name'), getTemplateInfo, function (err, infos) {
      console.log('infos: ' + JSON.stringify(infos))
      if (err) return cb(err)
      return cb(null, infos)
    })
  })
}

function getFullTemplate (templateName, cb) {
  var opts = assign({}, registryOpts, { 'template-name': templateName })
  binder.registry.fetch(opts, function (err, template) {
    if (err) return cb(err)
    return cb(null, template)
  })
}

function getBuildStatus (imageName, cb) {
  console.log('getting build status for', imageName)
  var opts = assign({}, buildOpts, { 'image-name': imageName })
  binder.build.status(opts, function (err, status) {
    if (err) return cb(err)
    if ((status.phase === 'building') && (status.status === 'running')) {
      status.status = 'building'
    } else if ((status.phase === 'building') && (status.status === 'completed')) {
      status.status = 'completed'
    }
    return cb(null, status)
  })
}

function getDeployStatus (templateName, id, cb) {
  var opts = assign({}, deployOpts, {
    'template-name': templateName,
    id: id
  })
  binder.deploy.status(opts, function (err, status) {
    if (err) return cb(err)
    return cb(null, status)
  })
}

function deployBinder (templateName, cb) {
  var opts = assign({}, deployOpts, { 'template-name': templateName })
  binder.deploy.deploy(opts, function (err, status) {
    if (err) return cb(err)
    return cb(null, status)
  })
}

function streamBuildLogs (templateName, startTime) {
  var reader = getReader({ host: buildOpts.host })
  console.log('startTime: ' + startTime)
  var rawStream = reader.streamLogs({ app: templateName })
  var mapStream = es.map(function (data, cb) {
    if (!data || !data.message) {
      return cb(null)
    }
    return cb(null, message)
  })
  rawStream.pipe(mapStream)
  return mapStream
}

module.exports = {
  startBuild: startBuild,
  getOverview: getOverview,
  getTemplateInfo: getTemplateInfo,
  getBuildStatus: getBuildStatus,
  getFullTemplate: getFullTemplate,
  deployBinder: deployBinder,
  getDeployStatus: getDeployStatus,
  streamBuildLogs: streamBuildLogs
}
