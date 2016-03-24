var async = require('async')
var startsWith = require('lodash.startswith')
var request = require('request')

// TODO: extract to config file
var apiServer = 'http://104.197.23.111'

var templateName = window.location.pathname

var div = document.createElement('div')
div.innerHTML = 'Deploying' + templateName + '...'
document.body.appendChild(div)

var makeError = function (err) {
  var div = document.createElement('div')
  div.innerHTML = 'FAILED to deploy '  + templateName + ':' + err
  document.body.appendChild(div)
}

var makeProgress = function () {
   var div = document.createElement('div')
  div.innerHTML = 'checking...'
  document.body.appendChild(div)
}

async.waterfall([
  function (next) {
    request({ 
      url: apiServer + '/api/deploy' + templateName,
      json: true
    }, function (err, res, json) {
      if (err) {
        makeError(err)
      }
      return next(null, json['id'])
    })
  },
  function (deployId, next) {
    async.retry({ times: 60, interval: 1000 }, function (next) {
      makeProgress()
      request({ 
        url: apiServer + '/api/apps' + templateName + '/' + deployId,
        json: true
      }, function (err, res, json) {
        var location  = json['location']
        if (location) {
          if (!startsWith(location, 'http://')) {
            location = 'http://' + location
          }
          window.location.href = location
        } else {
          return next('retrying')
        }
      })
    }, function (err) {
      return next(new Error('deployment timed out'))
    })
  }
], function (err) {
  if (err) {
    makeError(err)
  }
})
