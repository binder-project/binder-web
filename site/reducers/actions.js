var request = require('request')
var getReader = require('binder-logging/lib/reader')

var constants = {
  SHOW_DETAIL: 'SHOW_DETAIL',
  HIDE_DETAIL: 'HIDE_DETAIL',
  SHOW_LOADING: 'SHOW_LOADING',
  SHOW_ALL: 'SHOW_ALL',
  APPEND_LOG: 'APPEND_LOG',
  FILTER: 'FILTER',

  OVERVIEW_SEND: 'OVERVIEW_SEND',
  OVERVIEW_RCV: 'OVERVIEW_RCV',

  BUILD_SEND: 'BUILD_SEND',
  BUILD_RCV: 'BUILD_RCV',

  STOP_LOGS: 'STOP_LOGS',
  LOGS_SEND: 'LOGS_SEND',
  LOGS_RCV: 'LOGS_RCV'
}

/*
 * Binder client functions
 * TODO: move into a separate file
 */

// TODO: config?
var host = 'http://localhost:3000'
var apiServer = '104.197.23.111'

function fetch () {
  return function (dx) {
    dx({ type: constants.OVERVIEW_SEND })
    request({
      url: host + '/api/overview',
      json: true
    }, function (err, rsp, body) {
      if (err) {
        return dx({
          type: constants.OVERVIEW_RCV,
          success: false
        })
      }
      var templates = body
      // for now, make them all visible
      templates.map(function (t) {
        t.visible = true
        t.stage = t.build.status
      })
      return dx({
        type: constants.OVERVIEW_RCV,
        success: true,
        entries: templates
      })
    })
  }
}

function logs (app) {
  return function (dx) {
    var reader = getReader({ host: apiServer })
    var stream = reader.streamLogs({ app: app })
    dx({ type: constants.LOGS_SEND,
         stream: stream
    })
    stream.on('data', function (data) {
      return dx({
        type: constants.LOGS_RCV,
        success: true,
        data: data
      })
    })
    stream.on('error', function (err) {
      return dx({
        type: constants.LOGS_RCV,
        success: false
      })
    })
  }
}

function submit (value) {
  return function (dx) {
    dx({ type: constants.BUILD_SEND })
    request({
      method: 'POST',
      url: host + '/api/builds',
      json: true,
      body: { 'repo': value }
    }, function (err, rsp, body) {
      if (err) {
        return dx({
          type: constants.BUILD_RCV,
          success: false
        })
      }
      return dx({
        type: constants.BUILD_RCV,
        success: true,
        entry: {
          name: body['image-name'],
          stage: 'building',
          visible: 'true'
          // TODO: other information?
        }
      })
    })
    // TODO: resume here
  }
}

module.exports = {
  constants: constants,
  fetch: fetch,
  submit: submit,
  logs: logs
}
