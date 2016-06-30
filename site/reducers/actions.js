var request = require('request')
var url = require('url')
var SocketIO = require('socket.io-client')
var map = require('lodash.map')
var zipObject = require('lodash.zipobject')

var util = require('../util')

var conf = require('../../server/settings')

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

// TODO: config?
var host = util.getOrigin()
var pollPeriod = 2000

function showDetail (id, after) {
  return function (dx) {
    dx({ type: constants.OVERVIEW_STOP })
    dx({ type: constants.SHOW_DETAIL, id: id })
    buildStatus(id)(dx)
  }
}

function showOverview () {
  return function (dx) {
    dx({ type: constants.BUILD_STOP })
    dx({ type: constants.HIDE_DETAIL })
    if (!conf.public) templateList()(dx)
  }
}

function templateList () {
  return function (dx) {
    dx({ type: constants.OVERVIEW_SEND })
    var poller = null
    var pollFunc = function () {
      request({
        url: url.resolve('http://' + host, '/api/overview'),
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
            t.status = t.build.status
            t.phase = t.build.phase
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
        url: url.resolve('http://' + host, '/api/builds/' + name),
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
          repo: body['repository'],
          status: body['status'],
          phase: body['phase'],
          'display-name': body['display-name'],
          'start-time': body['start-time']
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
   dx({ type: constants.BUILD_STOP })
   dx({ type: constants.BUILD_SEND })
   request({
      method: 'POST',
      url: url.resolve('http://' + host, '/api/builds'),
      json: true,
      body: { 'repo': repo }
    }, function (err, rsp, body) {
      if (err) {
        return dx({
          type: constants.BUILD_RCV,
          success: false
        })
      }
      if (body && (typeof body === 'object')) {
        var name = body['name']
        var entries = {}
        entries[name] = {
          name: name,
          repo: body['repository'],
          stage: 'building',
          visible: 'true',
          'display-name': body['display-name'],
          'start-time': body['start-time']
        }
        dx({
          type: constants.BUILD_RCV,
          success: true,
          entries: entries
        })
        showDetail(name, body['start-time'])(dx)
      }
    })
  }
}

module.exports = {
  constants: constants,
  showDetail: showDetail,
  showOverview: showOverview,
  submitBuild: submitBuild
}
