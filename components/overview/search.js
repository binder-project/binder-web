var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (state) { 
  function oninput (event) {
    dx({ type: 'SEARCH', props: {value: event.target.value}})
  }

  var style = {
    container: {
      width: '90%',
      height: '50px',
      textAlign: 'left',
      padding: '1%'
    },
    input: {
      border: 'none',
      fontSize: '120%',
      height: '60%',
      width: '85%',
      paddingLeft: '12px'
    },
    icon: {
      width: '30px',
      verticalAlign: 'middle'
    }
  }

  return hx`
  <div style=${style.container}>
    <img style=${style.icon} src='./assets/images/search.svg'>
    <input style=${style.input} oninput=${oninput}>
  </div>`
}