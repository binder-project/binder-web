var actions = require('./actions')
var assign = require('object-assign')

module.exports = function (state, action) {
  console.log('state:')
  console.log(state)
  console.log('action:')
  console.log(action)

  switch (action.type) {
    case actions.SHOW_DETAIL:
      return assign({}, state, {selection: action.props})

    case actions.HIDE_DETAIL:
      return assign({}, state, {selection: null})

    case actions.SHOW_ALL:
      var all = state.binders.map(function (binder) {
        return assign({}, binder, {visible: true})
      })
      return assign({}, state, {binders: all})

    case actions.SEARCH:
      var filtered = state.binders.map(function (binder) {
        var found = binder.name.indexOf(action.props.value) > -1 
        return assign({}, binder, {
          visible: found || action.props.value === ''
        })
      })
      return assign({}, state, {binders: filtered})

    default:
      return state
  }
}