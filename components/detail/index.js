var hx = require('hxdx').hx
var back = require('./back')
var logs = require('./logs')
var selection = require('./selection')

module.exports = function (state) {
  return hx`<div>
  ${back()}
  ${selection(state)}
  ${logs(state)}
  </div>`
}