var request = require('request')
var url = require('url')
var SocketIO = require('socket.io-client')
var map = require('lodash.map')
var zipObject = require('lodash.zipobject')

var constants = {
  SHOW_DETAIL: 'SHOW_DETAIL',
  HIDE_DETAIL: 'HIDE_DETAIL',
  SHOW_ALL: 'SHOW_ALL',
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
var apiServer = '104.197.23.111'
var port = 3000
var host = 'http://' + apiServer
var pollPeriod = 2000

function showDetail (id) {
  return function (dx) {
    dx({ type: constants.OVERVIEW_STOP })
    dx({ type: constants.SHOW_DETAIL, id: id })
    buildStatus(id)(dx)
    //logs(id)(dx)
  }
}

function showOverview () {
  return function (dx) {
    dx({ type: constants.LOGS_STOP })
    dx({ type: constants.BUILD_STOP })
    dx({ type: constants.HIDE_DETAIL })
    templateList()(dx)
  }
}

function templateList () {
  return function (dx) {
    dx({ type: constants.OVERVIEW_SEND })
    var poller = null
    var pollFunc = function () {
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
          templates.map(function (t) {
            t.stage = t.build.status
          })
          var entries = zipObject(map(templates, 'name'), templates)
          return dx({
            type: constants.OVERVIEW_RCV,
            success: true,
            poller: poller,
            entries: entries
          })
        }
      })
    } 
    poller = setInterval(pollFunc, pollPeriod)
    pollFunc()
  }
}

function buildStatus (name) {
  return function (dx) {
    var poller = null
    var pollFunc = function () {
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
        var name = body['name']
        var entries = {}
        entries[name] = {
          name: name,
          stage: body['status'],
          startTime: body['start-time']
        }
        return dx({
          type: constants.BUILD_RCV,
          success: true,
          poller: poller,
          entries: entries
        })
      })
    }
    poller = setInterval(pollFunc, pollPeriod)
    pollFunc()
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
      var name = body['name']
      var entries = {}
      entries[name] = {
        name: name,
        stage: 'building',
        visible: 'true',
        startTime: body['start-time']
      }
      dx({
        type: constants.BUILD_RCV,
        success: true,
        entries: entries
      })
      showDetail(name)(dx)
    })
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


module.exports = {
  constants: constants,
  showDetail: showDetail,
  showOverview: showOverview,
  submitBuild: submitBuild
}
