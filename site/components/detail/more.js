var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (state) {
  var style = {
    container: {
      width: '12%',
      height: '26%',
      padding: '2%',
      display: 'inline-block',
      verticalAlign: 'top',
      background: 'rgb(210, 210, 210)',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
    }
  }

  return hx`
  <div style=${style.container}>
    <span>more info</span>
  </div>`
}