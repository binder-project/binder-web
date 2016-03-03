var hx = require('hxdx').hx
var binder = require('./binder')

module.exports = function (state) {
  var style = {
    list: {
      width: '90%',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
      height: '100%',
      textAlign: 'left',
      padding: '3%'
    }
  }
  return hx`
  <div style=${style.list}>
  ${state.map(function (item) {
    return binder(item)
  })}
  </div>`
}