var request = require('request')

var constants = {
  SHOW_DETAIL: 'SHOW_DETAIL',
  HIDE_DETAIL: 'HIDE_DETAIL',
  SHOW_LOADING: 'SHOW_LOADING',
  SHOW_ALL: 'SHOW_ALL',
  FILTER: 'FILTER',
  OVERVIEW_SEND: 'OVERVIEW_SEND',
  OVERVIEW_RCV: 'OVERVIEW_RCV'
}

/*
 * Binder client functions
 * TODO: move into a separate file
 */

// TODO: config?
var host = 'http://localhost:3000'

function fetch () {
  return function (dx) {
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
    reqeust({
      method: 'POST',
      url: host + '/api/builds',
      json: true,
      body: { 'image-name': value }
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
          
      })
    })
    // TODO: resume here
    dx({ type: constants.SHOW_LOADING })
    setTimeout(function () {
      dx({
        type: constants.SHOW_DETAIL,
        entry: {
          name: 'binder-project/example-requirements',
          stage: 'building',
          deployed: 9,
          visible: true,
          template: 'language: python'
        }
      })
    }, 400)
  }
}

module.exports = {
  constants: constants,
  fetch: fetch,
  submit: submit
}
