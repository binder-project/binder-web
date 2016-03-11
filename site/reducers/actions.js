var request = require('request')

var constants = {
  SHOW_DETAIL: 'SHOW_DETAIL',
  HIDE_DETAIL: 'HIDE_DETAIL',
  SHOW_LOADING: 'SHOW_LOADING',
  SHOW_ALL: 'SHOW_ALL',
  FILTER: 'FILTER',

  OVERVIEW_SEND: 'OVERVIEW_SEND',
  OVERVIEW_RCV: 'OVERVIEW_RCV',

  BUILD_SEND: 'BUILD_SEND',
  BUILD_RCV: 'BUILD_RCV'
}

/*
 * Binder client functions
 * TODO: move into a separate file
 */

// TODO: config?
var host = 'http://localhost:3000'

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
      console.log('templates: ' + JSON.stringify(templates))
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

function submit (value) {
  return function (dx) {
    console.log('submitting value: ' + value)
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
  submit: submit
}
