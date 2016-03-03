var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (state) { 
  function oninput (event) {
    dx({ type: 'SEARCH', props: {value: event.target.value}})
  }

  var style = {
    container: {
      width: '90%',
      height: '100%',
      textAlign: 'left',
      padding: '3%'
    },
    input: {
      border: 'none',
      fontSize: '120%'
    }
  }

  return hx`
  <div style=${style.container}>
    <span>search</span>
    <input style=${style.input} oninput=${oninput}>
  </div>`
}