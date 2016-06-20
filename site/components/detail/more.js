var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (item) {
  var style = {
    container: {
      width: '12%',
      height: '26%',
      padding: '2%',
      display: 'inline-block',
      verticalAlign: 'top',
      background: 'white',
      borderRadius: '8px',
      border: 'solid 5px rgb(225, 226, 227)',
    },
    message: {
      fontSize: '120%',
      color: 'rgb(190,190,190)'
    }
  }

  return hx`
  <div style=${style.container}>
    <span style=${style.message}>BUILD STATUS</span>
  </div>`
}
