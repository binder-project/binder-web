var combine = require('redux').combineReducers
var actions = require('./actions')
var initial = require('./initial')
var assign = require('object-assign')
var o = actions.constants

var selection = function (state, action) {
  if (typeof state == 'undefined') state = initial.selection

  switch (action.type) {

    case o.SHOW_DETAIL:
      return assign({}, state, {loading: false}, {entry: action.entry})

    case o.HIDE_DETAIL:
      return assign({}, state, {entry: null})

    case o.SHOW_LOADING:
      return assign({}, state, {loading: true}, {entry: {}})

    case o.BUILD_SEND:
      return assign({}, state, {loading: true, entry: {}, success: false, poller: action.poller})

    case o.BUILD_RCV:
      if (state.entry) {
        console.log('VIEW: poller: ' + action.poller)
        var newEntry = assign({}, state.entry, action.entry)
        var newPoller = state.poller || action.poller
        return assign({}, state, {loading: false, poller: newPoller, success: action.success, 
                      entry: newEntry})
      } else {
        console.log('NO VIEW: poller: ' + action.poller)
        if (action.poller) clearInterval(action.poller)
      }
      return state

    case o.BUILD_STOP:
      console.log('clearing interval for: ' + state.poller)
      clearInterval(state.poller)
      return assign({}, state, {poller: null})

    case o.LOGS_STOP:
      var ws = state.logs.ws
      if (ws) ws.close()
      return assign({}, state, {logs: {loading: false, success: false, ws: null, msgs: ''}})

    case o.LOGS_SEND:
      return assign({}, state, {logs: {loading: true, success: false, ws: action.ws, msgs: ''}})

    case o.LOGS_RCV:
      var msg = (action.data) ? action.data : ''
      var newMsgs = state.logs.msgs + '\n' + msg
      return assign({}, state, {logs: {loading: false, success: action.success, msgs: newMsgs}})

    default:
      return state
  }
}

var collection = function (state, action) {
  if (typeof state === 'undefined') state = initial.collection

  switch (action.type) {

    case o.SHOW_ALL:
      var all = state.entries.map(function (item) {
        return assign({}, item, {visible: true})
      })
      return assign({}, state, {entries: all})

    case o.FILTER:
      var filtered = state.entries.map(function (item) {
        var found = item.name.indexOf(action.props.value) > -1
        return assign({}, item, {visible: found || action.props.value === ''})
      })
      return assign({}, state, {entries: filtered})

    case o.OVERVIEW_SEND:
      return assign({}, state, {loading: true, entries: [], success: false, poller: action.poller})

    case o.OVERVIEW_RCV:
      return assign({}, state, {loading: false, poller: action.poller, entries: action.entries, 
                    success: true})

    case o.OVERVIEW_STOP:
      console.log('clearing interval for: ' + state.poller)
      clearInterval(state.poller)
      return assign({}, state, {poller: null})

    default:
      return state
  }
}

module.exports = combine({
  selection: selection,
  collection: collection
})
