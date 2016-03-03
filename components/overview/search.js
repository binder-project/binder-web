var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (state) { 
  function oninput (event) {
    dx({ type: 'SEARCH', props: {value: event.target.value}})
  }

  return hx`<div>
    <span>search</span><input oninput=${oninput}>
  </div>`
}