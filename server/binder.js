var async = require('async')
var map = require('lodash.map')
var filter = require('lodash.filter')
var partial = require('lodash.partial')
var assign = require('object-assign')
var binder = require('binder-client')
var getReader = require('binder-logging/lib/reader')
var streamMap = require('through2-map')

var buildTimeout = 60 * 30 * 1000
var buildInterval = 10000

function Binder(opts) {
  if (!(this instanceof Binder)) return new Binder(opts)

  var apiKey = opts.apiKey || process.env['BINDER_API_KEY']
  this.buildOpts = {
    host: opts.build.host,
    port: opts.build.port,
    'api-key': apiKey
  }
  this.registryOpts = {
    host: opts.registry.host,
    port: opts.registry.port,
    'api-key': apiKey
  }
  this.deployOpts = {
    host: opts.deploy.host,
    port: opts.deploy.port,
    'api-key': apiKey
  }
  this.healthOpts = {
    host: opts.health.host,
    port: opts.health.port,
    'api-key': apiKey
  }
}

Binder.prototype.startBuild = function (repo, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  var self = this
  var buildOpts = assign({}, self.buildOpts, { repository: repo })
  buildOpts.force = opts.force || false
  binder.build.start(buildOpts, function (err, body) {
    if (err && err.message.search('alreadyBuilding') !== -1) {
      return cb(null)
    }
    if (err) return cb(err)
    // immediately send the http response
    cb(null, body)
    var imageName = body['name']
    var queryBuild = function (cb) {
      var opts = { times: buildTimeout / buildInterval, interval: buildInterval }
      async.retry(opts, function (next) {
        var opts = assign({}, self.buildOpts, { 'image-name': imageName })
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
      var opts = assign({}, self.deployOpts, { 'template-name': imageName })
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

Binder.prototype.getTemplateInfo = function (templateName, cb) {
  var self = this
  function getStatuses (next) {
    var opts = assign({}, self.deployOpts, { 'template-name': templateName })
    binder.deploy.statusAll(opts, function (err, statuses) {
      if (err) return next(err)
      var numDeployed = filter(statuses, { status: 'deployed' }).length
      return next(null, numDeployed)
    })
  }
  async.parallel([
    getStatuses,
    partial(self.getBuildStatus.bind(self), templateName)
  ], function (err, res) {
    if (err) return cb(err)
    return cb(null, {
      'name': templateName,
      'deployed': res[0],
      'build': res[1]
    })
  })
}

Binder.prototype.getOverview = function (cb) {
  var self = this
  binder.build.statusAll(self.buildOpts, function (err, builds) {
    if (err) return cb(err)
    async.map(map(builds, 'name'), self.getTemplateInfo.bind(self), function (err, infos) {
      if (err) return cb(err)
      return cb(null, infos)
    })
  })
}

Binder.prototype.getFullTemplate = function (templateName, cb) {
  var self = this
  var opts = assign({}, self.registryOpts, { 'template-name': templateName })
  binder.registry.fetch(opts, function (err, template) {
    if (err) return cb(err)
    return cb(null, template)
  })
}

Binder.prototype.getBuildStatus = function (imageName, cb) {
  var self = this
  var opts = assign({}, self.buildOpts, { 'image-name': imageName })
  binder.build.status(opts, function (err, status) {
    if (err) return cb(err)
    if ((status.phase === 'building') && (status.status === 'running')) {
      status.status = 'building'
      return cb(null, status)
    } else if ((status.phase === 'finished') && (status.status === 'completed')) {
      status.status = 'pending'
      var opts = assign({}, self.deployOpts, { 'template-name': imageName })
      binder.deploy._preloadStatus(opts, function (err, preStatus) {
        if (err) return cb(err)
        if (preStatus.status === 'completed') {
          // the image is both built and preloaded -- build has fully completed
          status.status = 'completed'
        } else if (preStatus.status === 'loading') {
          status.status = 'loading'
        }
        return cb(null, status)
      })
    } else {
      return cb(null, status)
    }
  })
}

Binder.prototype.getDeployStatus = function (templateName, id, cb) {
  var self = this
  var opts = assign({}, self.deployOpts, {
    'template-name': templateName,
    id: id
  })
  binder.deploy.status(opts, function (err, status) {
    if (err) return cb(err)
    return cb(null, status)
  })
}

Binder.prototype.deployBinder = function (templateName, cb) {
  var self = this
  var opts = assign({}, self.deployOpts, {
    'template-name': templateName,
    'cull-timeout': 60 * 60 * 1000
  })
  binder.deploy.deploy(opts, function (err, status) {
    if (err) return cb(err)
    return cb(null, status)
  })
}

Binder.prototype.getLogs = function (templateName, startTime, cb) {
  var self = this
  var reader = getReader({ host: self.buildOpts.host })
  reader.getLogs({ app: templateName, after: startTime }).then(function (logs) {
    return cb(null, logs)
  }, function (err) {
    return cb(err)
  })
}

Binder.prototype.streamBuildLogs = function (templateName, startTime) {
  var self = this
  var reader = getReader({ host: self.buildOpts.host })
  var rawStream = reader.streamLogs({ app: templateName, after: startTime })
  var msgStream = streamMap.obj(function (data) {
    if (data) {
      return data.message
    }
  })
  rawStream.on('data', function (data) {
    msgStream.write(data)
  })
  rawStream.resume()
  return msgStream
}

Binder.prototype.getHealth = function (cb) {
  var opts = assign({}, this.healthOpts)
  binder.health.status(opts, function (err, health) {
    if (err) return cb(err)
    return cb(null, health)
  })
}

module.exports = Binder
