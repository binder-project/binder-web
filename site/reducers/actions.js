var request = require('request')
var url = require('url')
var SocketIO = require('socket.io-client')

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
var apiServer = '104.197.23.111'
var port = 3000
var host = 'http://' + apiServer
var pollPeriod = 1000

function fetch () {
  return function (dx) {
    dx({ type: constants.OVERVIEW_SEND })
    var poller = setInterval(function () {
      request({
        url: url.resolve(host, '/api/overview'),
        json: true
      }, function (err, rsp, body) {
        if (err) {
          return dx({
            type: constants.OVERVIEW_RCV,
            poller: poller,
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
          poller: poller,
          entries: templates
        })
      })
    }, pollPeriod)
  }
}

function logs (app, after) {
  return function (dx) {
    console.log('opening websocket to', host)
    var socket = SocketIO(host)
    dx({ 
      type: constants.LOGS_SEND,
      ws: socket
    })
    socket.on('connect', function () {
      console.log('connection opened')
      socket.send(JSON.stringify({
        app: app,
        after: after
      }))
    })
    socket.on('message', function (data, flags) {
      console.log('receiving message')
      return dx({
        type: constants.LOGS_RCV,
        success: true,
        data: data
      })
    })
    socket.on('error', function (err) {
      return dx({
        type: constants.LOGS_RCV,
        success: false
      })
    })
  }
}

function _postBuild (repo) {
 request({
    method: 'POST',
    url: url.resolve(host, '/api/builds'),
    json: true,
    body: { 'repo': repo }
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
        name: body['name'],
        stage: 'building',
        visible: 'true',
        startTime: body['start-time']
        // TODO: other information?
      }
    })
  })
}

function _queryBuild (repo) {
  request({
    method: 'GET',
    url: url.resolve(host, '/api/builds/' + repo),
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
        name: body['name'],
        stage: 'building',
        visible: 'true',
        startTime: body['start-time']
        // TODO: other information?
      }
    })
  })
}

function submit (value) {
  return function (dx) {
    dx({ type: constants.BUILD_SEND })
    request({
      method: 'POST',
      url: url.resolve(host, '/api/builds'),
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
          name: body['name'],
          stage: 'building',
          visible: 'true',
          startTime: body['start-time']
          // TODO: other information?
        }
      })
    })
  }
}

module.exports = {
  constants: constants,
  fetch: fetch,
  submit: submit,
  logs: logs
}
