var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (state) {
  var style = {
    container: {
      width: '100%',
      height: '35%',
      padding: '2%',
      marginBottom: '20%',
      display: 'inline-block',
      verticalAlign: 'top',
      background: 'rgb(210, 210, 210)',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
    }
  }

  return hx`
  <div style=${style.container}>
    <span>badge</span>
  </div>`
}