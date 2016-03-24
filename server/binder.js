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
  'api-key': '880df8bbabdf4b48f412208938c220fe'
}
var registryOpts = {
  host: '104.197.23.111',
  port: '8082',
  'api-key': '880df8bbabdf4b48f412208938c220fe'
}
var deployOpts = {
  host: '104.197.23.111',
  port: '8084',
  'api-key': '880df8bbabdf4b48f412208938c220fe'
}

var buildTimeout = 60 * 30 * 1000
var buildInterval = 10000

function startBuild (repo, cb) {
  var opts = assign({}, buildOpts, { repository: repo })
  binder.build.start(opts, function (err, body) {
    if (err) return cb(err)
    // immediately send the http response
    cb(null, body)
    var imageName = body['name']
    var queryBuild = function (cb) {
      var opts = { times: buildTimeout / buildInterval, interval: buildInterval }
      async.retry(opts, function (next) {
        var opts = assign({}, buildOpts, { 'image-name': imageName })
        binder.build.status(opts, function (err, body) {
          if (err) return next(err)
          if (body.status === 'failed') {
            return next(new Error('build failed'))
          }
          if (!(body.status === 'completed')) {
            return next('build not yet completed')
          } else {
            return next(null)
          }
        })
      }, function (err) {
        if (err) return cb(err)
        return cb(null)
      })
    }
    var preload = function (cb) {
      var opts = assign({}, deployOpts, { 'template-name': imageName })
      binder.deploy._preload(opts, function (err) {
        return cb(err)
      })
    }
    async.waterfall([
      queryBuild,
      preload
    ], function (err) {
      if (err) return console.error('could not build image: ' + imageName, err)
    })
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
    if (err) return cb(err)
    async.map(map(builds, 'name'), getTemplateInfo, function (err, infos) {
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
  var opts = assign({}, buildOpts, { 'image-name': imageName })
  binder.build.status(opts, function (err, status) {
    if (err) return cb(err)
    if ((status.phase === 'building') && (status.status === 'running')) {
      status.status = 'building'
      return cb(null, status)
    } else if ((status.phase === 'finished') && (status.status === 'completed')) {
      status.status = 'pending'
      var opts = assign({}, deployOpts, { 'template-name': imageName })
      binder.deploy._preloadStatus(opts, function (err, preStatus) {
        if (err) return cb(err)
        if (preStatus.status === 'completed') {
          // the image is both built and preloaded -- build has fully completed
          console.log('preload status completed')
          status.status = 'completed'
        } else if (preStatus.status === 'loading') {
          console.log('preload status loading')
          status.status = 'loading'
        }
        return cb(null, status)
      })
    } else {
      return cb(null, status)
    }
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

function getLogs (templateName, startTime, cb) {
  var reader = getReader({ host: buildOpts.host })
  reader.getLogs({ app: templateName, after: startTime }).then(function (logs) {
    return cb(null, logs)
  }, function (err) {
    return cb(err)
  })
}

function streamBuildLogs (templateName, startTime) {
  var reader = getReader({ host: buildOpts.host })
  var rawStream = reader.streamLogs({ app: templateName })
  var msgStream = es.mapSync(function (data) {
    if (data) {
      return data.message
    }
    return null
  })
  rawStream.pipe(msgStream)
  rawStream.resume()
  return msgStream
}

module.exports = {
  startBuild: startBuild,
  getOverview: getOverview,
  getTemplateInfo: getTemplateInfo,
  getBuildStatus: getBuildStatus,
  getFullTemplate: getFullTemplate,
  deployBinder: deployBinder,
  getDeployStatus: getDeployStatus,
  streamBuildLogs: streamBuildLogs,
  getLogs: getLogs
}
