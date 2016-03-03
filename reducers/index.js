var actions = require('./actions')

var initial = {
  selection: null,
  binders: [
    {
      name: 'binder-project/example-requirements',
      stage: 'building',
      deployed: 9,
      visible: true
    },
    {
      name: 'binder-project/example-dockerfile',
      stage: 'deployed',
      deployed: 5,
      visible: true
    }
  ]
}

module.exports = function (state, action) {
	if (typeof state === 'undefined') state = initial

  console.log('state:')
  console.log(state)
  console.log('action:')
  console.log(action)

	switch (action.type) {
    case actions.SHOW_DETAIL:
      return Object.assign(state, {selection: action.props})

    case actions.HIDE_DETAIL:
      return Object.assign(state, {selection: null})

    case actions.SEARCH:
      var filtered = state.binders.map(function (binder) {
        var found = binder.name.indexOf(action.props.value) > -1 
        return Object.assign(binder, {
          visible: found || action.props.value === ''
        })
      })
      return Object.assign(state, {binders: filtered})

    default:
      return state
	}
}