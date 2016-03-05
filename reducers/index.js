var combine = require('redux').combineReducers
var actions = require('./actions')
var initial = require('./initial')
var assign = require('object-assign')

var selection = function (state, action) {
  if (typeof state == 'undefined') state = initial.selection

  switch (action.type) {

    case actions.SHOW_DETAIL:
      return assign({}, state, {entry: action.props})

    case actions.HIDE_DETAIL:
      return assign({}, state, {entry: null})

    default:
      return state
  }
}

var collection = function (state, action) {
  if (typeof state == 'undefined') state = initial.collection

  switch (action.type) {

    case actions.SHOW_ALL:
      var all = state.entries.map(function (item) {
        return assign({}, item, {visible: true})
      })
      return assign({}, state, {entries: all})

    case actions.FILTER:
      var filtered = state.entries.map(function (item) {
        var found = item.name.indexOf(action.props.value) > -1 
        return assign({}, item, {visible: found || action.props.value === ''})
      })
      return assign({}, state, {entries: filtered})

    case actions.FETCH:
      return assign({}, state, {loading: false, entries: action.entries})

    default:
      return state
  }
}

module.exports = combine({
  selection: selection,
  collection: collection
})