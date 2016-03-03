var actions = require('./actions')
var assign = require('object-assign')

module.exports = function (state, action) {
  console.log('state:')
  console.log(state)
  console.log('action:')
  console.log(action)

  switch (action.type) {
    case actions.SHOW_DETAIL:
      return assign({}, state, 
        {view: 'detail'}, 
        {detail: assign({}, state.detail, {selection: action.props})}
      )

    case actions.HIDE_DETAIL:
      return assign({}, state, 
        {view: 'overview'}, 
        {detail: null}
      )

    case actions.SHOW_ALL:
      var all = state.overview.list.entries.map(function (binder) {
        return assign({}, binder, {visible: true})
      })
      var list = assign({}, state.overview.list, {entries: all})
      return assign({}, state, {overview: assign({}, state.overview, {list: list})})

    case actions.SEARCH:
      var filtered = state.overview.list.entries.map(function (binder) {
        var found = binder.name.indexOf(action.props.value) > -1 
        return assign({}, binder, {visible: found || action.props.value === ''})
      })
      var list = assign({}, state.overview.list, {entries: filtered})
      return assign({}, state, {overview: assign({}, state.overview, {list: list})})

    case 'POPULATE':
      var list = assign({}, state.overview.list, {loading: false})
      return assign({}, state, {overview: assign({}, state.overview, {list: list})})

    default:
      return state
  }
}