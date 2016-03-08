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
      return assign({}, state, {loading: true, entries: [], success: false})

    case o.OVERVIEW_RCV:
      console.log('action.entries: ' + JSON.stringify(action.entries))
      return assign({}, state, {loading: false, entries: action.entries, success: action.success})

    default:
      return state
  }
}

module.exports = combine({
  selection: selection,
  collection: collection
})
