var assign = require('object-assign')
var request = require('request')

var constants = {
  SHOW_DETAIL: 'SHOW_DETAIL',
  HIDE_DETAIL: 'HIDE_DETAIL',
  SHOW_LOADING: 'SHOW_LOADING',
  SHOW_ALL: 'SHOW_ALL',
  FILTER: 'FILTER',
  OVERVIEW_SEND: 'OVERVIEW_SEND'
  OVERVIEW_RCV: 'OVERVIEW_RCV'
}

/*
 * Binder client functions
 * TODO: move into a separate file
 */

function fetch () {
  return function (dx) {
    request('/api/overview')
    .then(function success (templates) {
      dx({
        type: constants.OVERVIEW_RCV,
        success: true,
        entries: templates.map(function (t) {
          // for now, make them all visible
          t.visible = true
        })
      })
    }, function error (err) {
      dx({
        type: constants.OVERVIEW_RCV,
        success: false
      })
    })
  }
}
  
function submit (value) {
  return function (dx) {
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
