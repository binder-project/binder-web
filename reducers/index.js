var combineReducers = require('redux').combineReducers
var actions = require('./actions')
var assign = require('object-assign')

// UI-only reducers
var overview = function (overview, action) {
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
  switch (action.type) {
    case actions.SHOW_DETAIL:
      return assign({}, detail, {selection: action.props})

    case actions.HIDE_DETAIL:
      return assign({}, detail, {})

    default:
      return detail
  }
}

// DB-only reducers
const binders = function (binders, action) {
  switch (action.type) {
    case actions.BINDERS:
      return assign({}, binders, { loading: true, failed: false })
    default:
      return binders
  }
}

const selected = function (selected, action) {
  switch (action.type) {
    case actions.BUILD_STATUS:
      return assign({}, selected, { loading: true, failed: false })
    default:
      return selected
  }
}

// DB/UI helper functions
const 

// binders/overview reducers
const bo = {}
bo[actions.BINDERS_FAILED] = function (state, action) {
  const newState = assign({}, state.binders.bindersByName, [])
  assign(newState.binders, {
    loading: false,
    failed: true
  })
  const list = newState.overview.list
  if (list) {
    list.entries = []
  }
  return newState
}

bo[actions.BINDERS_SUCCEEDED] = function (state, action) {
  const newState = assign({}, state.binders.bindersByName, action.props)
  assign(newState.binders, {
    loading: false,
    failed: false
  })
  const list = newState.overview.list
  if (list) {
    list.entries = Object.keys(action.props.keys)
  }
  return newState
}

// selected/detailed reducers
const so = {}
so[actions.BUILD_STATE_SUCCEEDED] = function (state, action) {
}
so[actions.BUILD_STATE_FAILED] = function (state, action) {
}

const combined = combineReducers([
  binders,
  selected,
  overview,
  detail
])

module.exports = function (state, action) {
  if (action in bo) {
    bo[action](state, action)
  } else if (action in so) {
    so[action](state, action)
  } else {
    combined(state, action)
  }
}

module.exports = rootReducer
