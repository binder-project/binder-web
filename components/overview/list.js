var hx = require('hxdx').hx
var binder = require('./binder')

module.exports = function (state) {
  var style = {
    list: {
      width: '93%',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
      height: '100%',
      textAlign: 'left',
      padding: '3%',
      paddingBottom: '2%'
    }
  }
  console.log(state.loading)
  if (!state.loading) {
    return hx`
    <div style=${style.list}>
    ${state.entries.map(function (item) {
      return binder(item)
    })}
    </div>`
  } else {
    return hx`
    <div style=${style.list}>loading</div>`
  }
  
}