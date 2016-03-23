var hx = require('hxdx').hx
var binder = require('../overview/binder')

module.exports = function (item) { 
  var style = {
    container: {
      width: '55%',
      height: '26%',
      marginLeft: '2%',
      marginRight: '2%',
      display: 'inline-block',
      verticalAlign: 'top',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
      padding: '2%'
    }
  }

  return hx`
  <div style=${style.container}>
    ${binder(item)}
  </div>`
}
