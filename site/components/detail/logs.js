var hx = require('hxdx').hx

module.exports = function (state) {
  var style = {
    container: {
      width: '55%',
      height: '82%',
      padding: '2%',
      marginLeft: '2%',
      marginRight: '2%',
      display: 'inline-block',
      verticalAlign: 'top',
      borderRadius: '8px',
      border: 'solid 5px rgb(210, 210, 210)',
    }
  }

  return hx`
  <div style=${style.container}>
  live logs
  </div>`
}