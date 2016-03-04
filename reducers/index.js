var combineReducers = require('redux').combineReducers
var actions = require('./actions')
var assign = require('object-assign')
var initial = require('./initial')

var overview = function (overview, action) {
  if (typeof overview === 'undefined') overview = initial.overview

  switch (action.type) {
    case actions.SHOW_OVERVIEW:
      var all = overview.list.entries.map(function (binder) {
        return assign({}, binder, {visible: true})
      })
      return assign({}, overview.list, {entries: all})

    case actions.HIDE_OVERVIEW:
      return assign({}, overview.list, {})

    case actions.SEARCH:
      var filtered = overview.list.entries.map(function (binder) {
        var found = binder.name.indexOf(action.props.value) > -1
        return assign({}, binder, {visible: found || action.props.value === ''})
      })
      return assign({}, overview.list, {entries: filtered})

    case actions.POPULATE:
      return assign({}, overview.list, {loading: false})

    default:
      return overview
  }
}

var detail = function (detail, action) {
  if (typeof detail === 'undefined') detail = initial.detail

  switch (action.type) {
    case actions.SHOW_DETAIL:
      return assign({}, detail, {selection: action.props})

    case actions.HIDE_DETAIL:
      return assign({}, detail, {})

    default:
      return detail
  }
}

var binders = function (binders, action) {
  if (typeof binders === 'undefined') binders = initial.binders

  switch (action.type) {
    case actions.GET_BINDERS:
      return assign({}, binders, { loading: true, failed: false })
    default:
      return binders
  }
}

var selected = function (selected, action) {
  if (typeof selected === 'undefined') selected = initial.selected

  switch (action.type) {
    case actions.BUILD_STATUS:
      return assign({}, selected, { loading: true, failed: false })
    default:
      return selected
  }
}

var bo = {}
bo[actions.BINDERS_FAILED] = function (state, action) {
  var newState = assign({}, state.binders.bindersByName, [])
  assign(newState.binders, {
    loading: false,
    failed: true
  })
  var list = newState.overview.list
  if (list) {
    list.entries = []
  }
  return newState
}

bo[actions.BINDERS_SUCCEEDED] = function (state, action) {
  var newState = assign({}, state.binders.bindersByName, action.props)
  assign(newState.binders, {
    loading: false,
    failed: false
  })
  var list = newState.overview.list
  if (list) {
    list.entries = Object.keys(action.props.keys)
  }
  return newState
}

var so = {}
so[actions.BUILD_STATE_SUCCEEDED] = function (state, action) {}
so[actions.BUILD_STATE_FAILED] = function (state, action) {}

var combined = combineReducers({
  binders: binders,
  selected: selected,
  overview: overview,
  detail: detail
})

module.exports = function (state, action) {
  if (action in bo) {
    return bo[action](state, action)
  } else if (action in so) {
    return so[action](state, action)
  } else {
    return combined(state, action)
  }
}
