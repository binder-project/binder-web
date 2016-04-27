var combine = require('redux').combineReducers
var find = require('lodash.find')
var actions = require('./actions')
var initial = require('./initial')
var assign = require('object-assign')
var o = actions.constants

var selection = function (state, action) {
  if (typeof state == 'undefined') state = initial.selection

  switch (action.type) {

    case o.SHOW_DETAIL:
      console.log('selection is now: ' + action.id)
      return action.id

    case o.HIDE_DETAIL:
      return null

    default:
      return state
  }
}

var filter = function (state, action) {
  if (typeof state === 'undefined') state = initial.filter

  switch (action.type) {

    case o.FILTER:
      var filtered = action.all.filter(function (item) {
        return item.indexOf(action.value) > -1
      })
      var set = {}
      for (var i in filtered) {
        set[filtered[i]] = true
      }
      return set

    default:
      return state
  }
}

// this function mutates state (state should be created with assign before calling)
function updateEntries(state, action) {
  if (action.entries) {
    for (var key in action.entries) {
      if (key in state.entries) {
        assign(state.entries[key], action.entries[key])
      } else {
        state.entries[key] = action.entries[key]
      }
    }
  }
  return state
}

// this function mutates state (state should be created with assign before calling)
function updateLogs(state, action) {
  if (action.message) {
    state.log = state.log.concat(action.message.message)
  }
  return state
}

function sendState (state, action, key) {
  var newState = assign({}, state)
  var newPoller = action.poller || state[key].poller
  if (action.poller && state[key].poller) {
    clearInterval(state[key].poller)
  }
  newState[key] = assign({}, state[key], {loading: true, success: false, poller: newPoller})
  return newState
}

function receiveState (state, action, key) {
  var newState = assign({}, state)
  var newPoller = action.poller || state[key].poller
  newState[key] = assign({}, state[key], {loading: false, success: action.success, poller: newPoller})
  return newState
}

function stopPolling (state, action, key) {
  var newState = assign({}, state)
  clearInterval(state[key].poller)
  newState[key] = assign({}, state[key], {poller: null})
  return newState
}

var model = function (state, action) {
  if (typeof state === 'undefined') state = initial.model

  switch (action.type) {

    case o.BUILD_SEND:
      return sendState(state, action, 'build')

    case o.OVERVIEW_SEND:
      return sendState(state, action, 'overview')

    case o.LOGS_SEND:
      return sendState(state, action, 'logs')

    case o.BUILD_RCV:
      var newState = receiveState(state, action, 'build')
      return updateEntries(newState, action)

    case o.OVERVIEW_RCV:
      var newState = receiveState(state, action, 'overview')
      return updateEntries(newState, action)

    case o.LOGS_RCV:
      var newState = receiveState(state, action, 'logs')
      return updateEntries(newState, action)

    case o.BUILD_STOP:
      return stopPolling(state, action, 'build')

    case o.OVERVIEW_STOP:
      return stopPolling(state, action, 'overview')

    default:
      return state
  }
}

module.exports = combine({
  selection: selection,
  filter: filter,
  model: model
})
