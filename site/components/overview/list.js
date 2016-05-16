var hx = require('hxdx').hx
var binder = require('./binder')

module.exports = function (filter, model) {
  var style = {
    list: {
      width: '93%',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
      height: '100%',
      textAlign: 'left',
      padding: '3%',
      paddingBottom: '2%'
    },
    loader: {
      textAlign: 'center'
    }
  }

  var getBinders = function () {
    var binders = []
    if (Object.keys(filter).length !== 0) {
      binders = Object.keys(filter)
    } else {
      binders = Object.keys(model.entries)
    }
    return binders.map(function (name) {
      return binder(model.entries[name])
    })
  }

  if (!model.overview.loading) {
    return hx`
    <div style=${style.list}>
    ${getBinders()}
    </div>`
  } else {
    return hx`
    <div style=${style.list}><div style=${style.loader}><div className='three-quarters-loader'></div></div></div>`
  } 
}
