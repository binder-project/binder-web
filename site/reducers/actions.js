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

  OVERVIEW_STOP: 'OVERVIEW_STOP',
  OVERVIEW_SEND: 'OVERVIEW_SEND',
  OVERVIEW_RCV: 'OVERVIEW_RCV',

  BUILD_STOP: 'BUILD_STOP',
  BUILD_SEND: 'BUILD_SEND',
  BUILD_RCV: 'BUILD_RCV',

  LOGS_STOP: 'LOGS_STOP',
  LOGS_SEND: 'LOGS_SEND',
  LOGS_RCV: 'LOGS_RCV'
}

/*
 * Binder client functions
 * TODO: move into a separate file
 */

// TODO: config?
var apiServer = 'localhost:3000'
var port = 3000
var host = 'http://' + apiServer
var pollPeriod = 2000

function showDetail (entry) {
  return function (dx) {
    dx({ type: constants.OVERVIEW_STOP })
    if (entry) {
      dx({ type: constants.SHOW_DETAIL, entry: entry })
      buildStatus(entry.name)(dx)
      logs(entry.name, entry.startTime)(dx)
    }
  }
}

function showOverview () {
  return function (dx) {
    dx({ type: constants.LOGS_STOP })
    dx({ type: constants.BUILD_STOP })
    dx({ type: constants.HIDE_DETAIL })
    dx({ type: constants.SHOW_ALL })
    templateList()(dx)
  }
}

function templateList () {
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
        if (rsp.statusCode === 200 || rsp.statusCode === 304) {
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
        }
      })
    }, pollPeriod)
  }
}

function buildStatus (name) {
  return function (dx) {
    var poller = setInterval(function () {
      request({
        method: 'GET',
        url: url.resolve(host, '/api/builds/' + name),
        json: true,
        body: { 'repo': name }
      }, function (err, rsp, body) {
        if (err) {
          return dx({
            type: constants.BUILD_RCV,
            poller: poller,
            success: false
          })
        }
        var entry = {
            name: body['name'],
            stage: body['status'],
            visible: 'true',
            startTime: body['start-time']
        }
        return dx({
          type: constants.BUILD_RCV,
          success: true,
          poller: poller,
          entry: entry
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

function submitBuild (repo) {
  return function (dx) {
   dx({ type: constants.BUILD_SEND })
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
      var entry = {
        name: body['name'],
        stage: 'building',
        visible: 'true',
        startTime: body['start-time']
      }
      dx({
        type: constants.BUILD_RCV,
        success: true,
        entry: entry       
      })
      showDetail(entry)(dx)
    })
  }
}

module.exports = {
  constants: constants,
  showDetail: showDetail,
  showOverview: showOverview,
  submitBuild: submitBuild
}
