var async = require('async')
var map = require('lodash.map')
var filter = require('lodash.filter')
var assign = require('object-assign')
var binder = require('binder-cli')

// TODO: set these parameters according to your production environment
var buildOpts = {
  host: '104.197.23.111',
  port: '8082',
  'api-key': '60dc798d55521d0552334c70797cb15f'
}
var registryOpts = {
  host: '104.197.23.111',
  port: '8083',
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
    var imageName = body['image-name']
    return cb(null, imageName)
  })
}

function getTemplateInfo (templateName, cb) {
  function getStatuses (next) {
    var opts = assign({}, deployOpts, { 'template-name': templateName })
    binder.deploy.statusAll(opts, function (err, statuses) {
      if (err) return next(err)
      var numDeployed = filter(statuses, 'state', 'deployed').length
      return next(null, numDeployed)
    })
  }
  async.parallel([
    getStatuses,
    getBuildStatus
  ], function (err, res) {
    if (err) return cb(err)
    return cb(null, {
      'template-name': templateName,
      'deployed': res[0],
      'stage': res[1]
    })
  })
}

function getOverview (cb) {
  binder.registry.fetchAll(registryOpts, function (err, templates) {
    if (err) return cb(err)
    async.each(map(templates, 'name'), getTemplateInfo, function (err, infos) {
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

module.exports = {
  startBuild: startBuild,
  getOverview: getOverview,
  getTemplateInfo: getTemplateInfo,
  getBuildStatus: getBuildStatus,
  getFullTemplate: getFullTemplate,
  deployBinder: deployBinder,
  getDeployStatus: getDeployStatus
}


