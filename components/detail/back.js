var hx = require('hxdx').hx
var dx = require('hxdx').dx

module.exports = function (state) {
  function onclick () {
    dx({
      type: 'HIDE_DETAIL'
    })
  }

  return hx`<div>
    <span>arrow</span>
    <button onclick=${onclick}>back</button>
  </div>`
}